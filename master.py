from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

class MessageModel(BaseModel):
    message: str

app = FastAPI()

INMEMORY_MESSAGE_LIST = []



@app.get("/message")
def get_message():
    return INMEMORY_MESSAGE_LIST

@app.post("/message")
def post_message(message: MessageModel):
    INMEMORY_MESSAGE_LIST.append(message)
    return ''