#Uses node:12.13.0-alpine
FROM node:12.13.0-alpine

#Create app directory
RUN mkdir -p /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

#Run yarn install to install all the dependencies 
RUN yarn install

#install mocha for global use
RUN npm install mocha -g

COPY . /app

#Build the app with yarn
RUN yarn build

#Execute the code with yarn start
CMD [ "yarn", "start" ]