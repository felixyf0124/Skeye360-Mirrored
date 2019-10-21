FROM python:3.6.8

RUN apt-get update \
	&& apt-get install -y --no-install-recommends

# Set working directory
ADD . /usr/src/app
WORKDIR /usr/src/app


COPY /djangosite/requirements.txt ./
RUN pip install -r requirements.txt

EXPOSE 8000

# Migrate database and Run server
CMD ["python", "/usr/src/app/djangosite/manage.py", "makemigrations"]
CMD ["python", "/usr/src/app/djangosite/manage.py", "migrate"]
CMD ["python", "/usr/src/app/djangosite/manage.py", "runserver", "0.0.0.0:8000"]
