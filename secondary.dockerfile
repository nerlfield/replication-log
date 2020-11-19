FROM python:3.7

WORKDIR /app/
COPY . /app/

RUN pip install -r requirements.txt

EXPOSE 5200
CMD ["uvicorn", "secondary:app", "--host", "0.0.0.0"]