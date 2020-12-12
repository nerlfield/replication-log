FROM python:3.7

WORKDIR /app/
COPY . /app/

RUN pip install -r requirements.txt

CMD ["uvicorn", "secondary:app", "--host", "0.0.0.0"]
