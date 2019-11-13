FROM node:12.13.0-alpine

#Create app directory
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/package.json

#Run yarn install to install all the dependencies 
RUN yarn install --force

#install mocha for global use
RUN npm install mocha -g
RUN npm install ts-node

COPY . /app

#Build the app with yarn
RUN yarn build

#Execute the code with yarn start
CMD [ "yarn", "start" ]