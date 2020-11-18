from typing import Optional
import logging
from fastapi import FastAPI, Response
from http import HTTPStatus
from pydantic import BaseModel

logger = logging.getLogger("master")

class MessageModel(BaseModel):
    message: str

app = FastAPI()

INMEMORY_MESSAGE_LIST = []



@app.get("/message")
def get_message():
    return INMEMORY_MESSAGE_LIST

@app.post("/__message")
def post_message(message: MessageModel):
    logging.info(message)
    INMEMORY_MESSAGE_LIST.append(message)
    return Response(status_code=HTTPStatus.NO_CONTENT.value)