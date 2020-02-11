FROM python:3.7.5

RUN apt-get update \
	&& apt-get install -y --no-install-recommends

COPY requirements.txt ./

RUN pip install -r requirements.txt