import os
from typing import Optional
import logging
from fastapi import FastAPI, Response
from http import HTTPStatus
from pydantic import BaseModel
import grequests

logger = logging.getLogger("master")


class MessageModel(BaseModel):
    message: str


app = FastAPI(debug=True)

INMEMORY_MESSAGE_LIST = ["test"]
SECONDARIES = [f"http://{sec_name}:8000/__message" for sec_name in os.environ['SECONDARIES_NAMES'].split(sep=',')]
#SECONDARIES = 'http://0.0.0.0:5200/__message', 'http://0.0.0.0:5300/__message'


@app.get("/message")
def get_message():
    return INMEMORY_MESSAGE_LIST


def replicate_to_secondaries(message, write_concern):
    rs = [grequests.post(secondary, json={'message': message.message}) for secondary in SECONDARIES]
    results = grequests.imap(rs)

    return results


def is_success_replication(results, write_concern):

    for i in range(0, write_concern - 1):

        if not next(results):
            return False
    return True


@app.post("/message")
def post_message(message: MessageModel, write_concern: int):
    INMEMORY_MESSAGE_LIST.append(message)
    print(message)
    print(write_concern)

    replication_results = replicate_to_secondaries(message, write_concern)
    if is_success_replication(replication_results, write_concern):
        print('Successful replication!')
        return Response('Successfull replication!', status_code=HTTPStatus.OK.value)
    else:
        return Response(status_code=HTTPStatus.SERVICE_UNAVAILABLE.value)
