import os
from typing import Optional
import logging
import time
from fastapi import FastAPI, Response
from http import HTTPStatus
from pydantic import BaseModel
import time
import grequests
from threading import Thread
from requests import Session
import gevent
from gevent import monkey as curious_george
from gevent.pool import Pool

logger = logging.getLogger("master")


class MessageModel(BaseModel):
    message: str
    is_blocked: bool = False


app = FastAPI(debug=True)


message_number = -1
INMEMORY_MESSAGE_LIST = ["test"]
SECONDARIES = [f"http://{sec_name}:8000/__message" for sec_name in os.environ['SECONDARIES_NAMES'].split(sep=',')]
HEALTHCKECK_LOOP_TIMEOUT=1
UNHEALTHY_TIMEOUT=5
HEALTH_STATUSES = {sec_name:'Suspected' for sec_name in os.environ['SECONDARIES_NAMES'].split(sep=',')}


def imap(requests, stream=False, size=2, exception_handler=None):
    pool = Pool(size)

    def send(r):
        return r.send(stream=stream)

    for request in pool.imap_unordered(send, requests):
        if request.response.status_code == 500:
            ex_result = exception_handler(request, stream)
            if ex_result is not None:
                yield ex_result
            continue

        if request.response is not None:
            yield request.response
            

    pool.join()


def exception_handler(r, stream=False):
    request = r.send(stream=stream)
    retr_timeout = 3
    while request.response.status_code == 500:
        time.sleep(retr_timeout)
        retr_timeout = retr_timeout*2
        print(f'Retry func with timeout: {retr_timeout}')
        request = r.send(stream=stream)
    
    return request.response


def healthcheck_loop(sec_name):
    secondary_ping_uri = f"http://{sec_name}:8000/ping"
    print("sec_name", sec_name)
    while True:
        request = grequests.get(secondary_ping_uri)
        response = grequests.map([request])[0]

        if not response or response.status_code != 204:
            if HEALTH_STATUSES[sec_name] == "Suspected":
                HEALTH_STATUSES[sec_name] = "Unhealthy"
            else:
                HEALTH_STATUSES[sec_name] = "Suspected"
        else:
            HEALTH_STATUSES[sec_name] = "Healthy"


        time.sleep(HEALTHCKECK_LOOP_TIMEOUT)

for sec_name in os.environ['SECONDARIES_NAMES'].split(sep=','):
    Thread(target=healthcheck_loop, args=[sec_name]).start()


def replicate_to_secondaries(message, write_concern, id_):
    rs = [grequests.post(secondary, json={'message': message.message, 'id': id_, 'is_blocked': message.is_blocked}) for secondary in SECONDARIES]
    results = imap(rs, exception_handler=exception_handler)

    return results


def is_success_replication(results, write_concern):
    for i in range(0, write_concern - 1):
        if not next(results):
            return False
    return True


def threading_start(results, write_concern):
    threadOfUpdates = Thread(target=is_success_replication, args=[results, 3])
    threadOfUpdates.start()


@app.get("/health")
def health():
    """Reports secondaries' statuses"""
    return HEALTH_STATUSES


@app.get("/message")
def get_message():
    return INMEMORY_MESSAGE_LIST


@app.post("/message")
def post_message(message: MessageModel, write_concern: int):
    global message_number
    message_number += 1
    INMEMORY_MESSAGE_LIST.append(message)
    print(f'Input message in master: {message.message}')
    print(f"With write concern: {write_concern}")

    replication_results = replicate_to_secondaries(message, write_concern, message_number)

    if is_success_replication(replication_results, write_concern):
        threading_start(replication_results, write_concern)
        print('Successful replication!')
        return Response('Successfull replication!', status_code=HTTPStatus.OK.value)
    else:
        return Response(status_code=HTTPStatus.SERVICE_UNAVAILABLE.value)
