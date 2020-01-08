# How to start mongo container

## Getting started

1.	**Build MongoDB Image**

    ```docker build -t [Create a image name] .```
    
    Example: 
    docker build -t mongo-test . 
    (PS: don't forget '.' symbol)

2.	**Build MongoDB Container**

    ```docker run --name [Create a container name] -d -v /data/db:/data/db -p 27017:27017 [Image name you created]]```

   Example:
   docker run --name my-mongo -d -v /data/db:/data/db -p 27017:27017 mongo-test 

3.	**Execute your MongoDB container**
    ```docker exec -it [Container name you created] bash```

    Example:
    docker exec -it my-mongo bash

4. **Create a MongoDB admin user**
    
  * ```mongo```
    
  * ```
    use admin
    db.createUser(
    {
    user: "myUserAdmin",
    pwd: "abc123",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, 
             { role: "dbAdminAnyDatabase", db: "admin" }, 
             { role: "readWriteAnyDatabase", db: "admin" } ]
    }
    )   
    
    ```
5. **How to access local mongo DB though linux command?**

  * ```mongo 127.0.0.1:8300/admin -u myUserAdmin -p abc123```