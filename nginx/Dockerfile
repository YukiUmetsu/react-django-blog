FROM nginx:1.17.4-alpine

RUN apk update \
    && apk add sudo vim
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf