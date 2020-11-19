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

@app.get("/message")
def get_message():
    return INMEMORY_MESSAGE_LIST


def replicate_to_secondaries(message):
    rs = [grequests.post(secondary, json={'message': message.message}) for secondary in SECONDARIES]
    results = grequests.map(rs)
    return results

def is_success_replication(results):
    for result in results:
        if not result:
            return False
    return True

@app.post("/message")
def post_message(message: MessageModel):

    INMEMORY_MESSAGE_LIST.append(message)
    print(message)

    replication_results = replicate_to_secondaries(message)
    if is_success_replication(replication_results):
        print('Successful replication!')
        return Response(status_code=HTTPStatus.NO_CONTENT.value)
    else:
        return Response(status_code=HTTPStatus.SERVICE_UNAVAILABLE.value)
