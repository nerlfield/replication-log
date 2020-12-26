import os
import time
from typing import Optional
import logging
from fastapi import FastAPI, Response, HTTPException
from http import HTTPStatus
from pydantic import BaseModel

logger = logging.getLogger("master")

class MessageModel(BaseModel):
    message: str
    is_blocked: bool

app = FastAPI(debug=True)

INMEMORY_MESSAGE_LIST = []
DELAY = None if 'DELAY' not in os.environ else float(os.environ['DELAY'])


ERROR_K = 0 if 'ERROR_K' not in os.environ else float(os.environ['ERROR_K'])

def error_simulation(is_blocked):
    global ERROR_K
    if ERROR_K > 0 and is_blocked:
        ERROR_K -= 1
        msg = f'Okay, we got an error, retry your request pls. You will get {ERROR_K} more errors'
        logging.info(msg)
        raise Exception(msg)


@app.get("/message")
def get_message():
    return INMEMORY_MESSAGE_LIST


@app.post("/__message")
def post_message(message: MessageModel):
    logging.info(message)

    try:
        error_simulation(message.is_blocked)
        if DELAY is not None and DELAY > 0:
            print(f'Introducing delay {DELAY} sec..')
            time.sleep(DELAY)
            print(f'Delay completed!')

        INMEMORY_MESSAGE_LIST.append(message)
        print(INMEMORY_MESSAGE_LIST)
        return Response(status_code=HTTPStatus.NO_CONTENT.value)
    except:
        raise HTTPException(status_code=500, detail="Item not found")
        
    