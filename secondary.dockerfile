# Pull base image
FROM python:3.7
# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /code/
# Install dependencies
RUN pip install pipenv
COPY Pipfile Pipfile.lock /code/
RUN pipenv install --system --dev
COPY . /code/
EXPOSE 8000
CMD ["python", "main.py", "--reload", "--workers 1", "--host 0.0.0.0", "--port 8000"]