import os
import time
from typing import Optional
import logging
from fastapi import FastAPI, Response
from http import HTTPStatus
from pydantic import BaseModel

logger = logging.getLogger("master")

class MessageModel(BaseModel):
    message: str

app = FastAPI(debug=True)

INMEMORY_MESSAGE_LIST = []
DELAY = None if 'DELAY' not in os.environ else float(os.environ['DELAY'])


@app.get("/message")
def get_message():
    return INMEMORY_MESSAGE_LIST


@app.post("/__message")
def post_message(message: MessageModel):
    logging.info(message)

    if DELAY is not None and DELAY > 0:
        print(f'Introducing delay {DELAY} sec..')
        time.sleep(DELAY)
        print(f'Delay completed!')

    INMEMORY_MESSAGE_LIST.append(message)
    print(INMEMORY_MESSAGE_LIST)
    return Response(status_code=HTTPStatus.NO_CONTENT.value)