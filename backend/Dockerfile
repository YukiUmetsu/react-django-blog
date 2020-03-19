FROM python:3.8.0-alpine

# set work directory
WORKDIR /usr/src/blog

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev jpeg-dev zlib-dev

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/blog/requirements.txt
RUN python -m pip install -r requirements.txt

EXPOSE 587

# copy project
COPY . /usr/src/blog/