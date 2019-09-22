FROM python:3.6.8

RUN apt-get update \
	&& apt-get install -y --no-install-recommends

ADD . /usr/src/app
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
