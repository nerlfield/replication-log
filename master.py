from typing import Optional
import logging
from fastapi import FastAPI, Response
from http import HTTPStatus
from pydantic import BaseModel
import requests

logger = logging.getLogger("master")
class MessageModel(BaseModel):
    message: str


app = FastAPI()

INMEMORY_MESSAGE_LIST = ["test"]


@app.get("/message")
def get_message():
    return INMEMORY_MESSAGE_LIST


@app.post("/message")
def post_message(message: MessageModel):
    INMEMORY_MESSAGE_LIST.append(message)
    logging.info(message)
    r = requests.post('http://127.0.0.1:8889/__message', json={'message': message.message + ' mastered!'})
    print('r.status_code', r.status_code)
    return Response(status_code=HTTPStatus.NO_CONTENT.value)
