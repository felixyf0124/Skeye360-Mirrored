# Build a docker image
docker build -t mongo-test .

# Remove docker container
docker rm -f my-mongo

# Build a docker container
docker run --name my-mongo -d -v /data/db:/data/db -p 27017:27017 mongo-test