# Soen490 capstone project

## Introduction

Skeye360 is a smart camera intended to build smart cities. It enables smart and real-time management of traffic lights. This camera aims to reduce unnecessary wait time at traffic lights, improving their synchronization and time cycle.

The first feature would be the car and pedestrian detection at the intersection. Depending on the presence or absence of cars on the cross street, the light would turn red or remain green. Second feature would be to calculate the density of cars and pedestrians to adjust the traffic lights time cycle. The third feature would improve light synchronization by tracking car direction and having the traffic light turn or remain green upon approaching given speed limit and distance between lights.

Additionally, the project will have a dashboard displaying the data that the camera has collected enabling the possibility to analyze the data and help improve the streets (e.g. Widen the streets) or make priority lights depending on the data. 

## Getting Started

### Prerequisites

1. **local dev environment** [https://github.com/vincentsun870530/Soen490/tree/master/dev_env]
2. **docker-compose** [https://docs.docker.com/compose/install/]

### Start

Under project folder:

```docker network create --gateway 172.16.0.1 --subnet 172.16.0.0/24 app_net  // This command only needs to do the first time ```

```cd project/```

```docker-compose up --build```

### More reference:
1. [Frontend](https://github.com/vincentsun870530/Soen490/tree/master/project/frontend/360_dashboard)
2. [Backend_RESTAPI](https://github.com/vincentsun870530/Soen490/tree/master/project/backend/360_django)
3. [Backend_Detection](https://github.com/vincentsun870530/Soen490/tree/master/project/backend/backend_django)
4. [Backend_Data_Analytics](https://github.com/vincentsun870530/Soen490/tree/master/project/data_analytics/360_data_analytics)
5. [MongoDB](https://github.com/vincentsun870530/Soen490/tree/master/project/database/360_mongo)
