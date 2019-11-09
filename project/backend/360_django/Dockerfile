FROM python:3.7.5

RUN apt-get update \
	&& apt-get install -y --no-install-recommends

# Set working directory
ADD . /usr/src/app
WORKDIR /usr/src/app


COPY /djangosite/requirements.txt ./
RUN pip install -r requirements.txt

EXPOSE 8000