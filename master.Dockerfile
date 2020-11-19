FROM python:3.7
WORKDIR /app/
COPY . /app/
RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "master:app", "--host", "0.0.0.0"]

# docker build -t master -f master.Dockerfile .
# docker run -p 8000:8000 master