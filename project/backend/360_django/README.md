# How to start Django container

## Getting started

1.	**Build Django Image**

    ```docker build -t [Create a image name] .```
    
    Example: 
    docker build -t django-test . 
    (PS: don't forget '.' symbol)

2.	**Build Django Container**

    ```docker run --name [Create a container name] -p 8000:8000 [Image name you created]]```

    Example:
    docker run --name my-django -p 8000:8000 django-test

3.	**Manually migrate DB and Create Super User (The first time setting for Django)**

    * Entering Django container
    ```docker exec -it [Container name you created] bash```
    
    Example:
    docker exec -it my-django bash

    * Create DB collection in MongoDB
    ```cd djangosite```
    ```python manage.py makemigrations```
    ```python manage.py migrate```
    ```python manage.py createsuperuser```
    
4.	**Access Django though web browser**

    Open web browser in local VM and put 0.0.0.0:8000/admin, and you can log in using the user account you created
