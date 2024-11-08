ARG VARIANT=3-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/python:0-${VARIANT}

ENV PYTHONUNBUFFERED 1

ARG NODE_VERSION="none"
RUN if [ "${NODE_VERSION}" != "none" ]; then su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"; fi

COPY requirements.txt /tmp/pip-tmp/
RUN pip3 install --upgrade pip setuptools \
    && pip3 --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements.txt \
    && rm -rf /tmp/pip-tmp 

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
     && apt-get -y install --no-install-recommends unixodbc-dev curl \
     && rm -rf /var/lib/apt/lists/*

RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list > /etc/apt/sources.list.d/mssql-release.list

RUN ACCEPT_EULA=Y apt-get install -y --allow-unauthenticated msodbcsql17
RUN ACCEPT_EULA=Y apt-get install -y --allow-unauthenticated mssql-tools

