# This folder is only for update jenkins dependencies


## Prerequisites

mongo container must be running.

### How to start docker container?

```cd /home/Soen490/Soen490/project```

```docker-compose -f docker-compose-jenkins.yml up --build```

## How to update my python testing environment?

### STEP 1: Modify requirements.txt to add your new python dependencies

### SETP 2: SSH jenkins server 40.121.23.48

```cd /home/Soen490/Soen490```

```sudo docker build -t project_360_django .```