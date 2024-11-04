FROM mcr.microsoft.com/devcontainers/python:1-3.11-bullseye

RUN apt-get update && apt-get install -y \
    libmysqlclient-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONUNBUFFERED 1