# Nightlife Coordination App
## Description
- Developed Nightlife Bar App using AngularJS, Meteor.js framework and MongoDB database
- Implemented club search via Yelp API. Allowed users to view all the bars in the area, mark or unmark a bar as one’s favorite
- Dockerize the application and deploy on AWS ECS

## User stories:
- As an unauthenticated user, I can view all bars in my area.
- As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
- As an authenticated user, I can remove myself from a bar if I no longer want to go there.
- As an unauthenticated user, when I login I should not have to search again.

## Dockerize and Deploy to AWS
### Clone and Build APP
```
$ mkdir nightlife && cd nightlife
$ git clone https://github.com/mengzhen94/nightlife.git
```
Install dependencies before meteor build, or we'll get error (Unable to resolve some modules)
```
$ npm install
$ meteor build ../build
```
Unzip build file and change the directory to bundle (bundle is the root directory of source code)
```
$ cd ../build && tar -zxvf nightlife.tar.gz && cd bundle
```
### Write Dockerfile
In bundle folder, create empty Dockerfile (touch is the easiest way to create new, empty file)
```
$ touch Dockerfile
```
Here is the Dockerfile source code
```Dockerfile
FROM node:4.4.7
COPY . /bundle
RUN (cd /bundle/programs/server && npm install)
ENV PORT=80
ENV MONGO_URL=###
EXPOSE 80
CMD node /bundle/main.js
```
### Docker Build and Run
Yelp environment variables are in Settings.json, cat and assign it to METEOR_SETTINGS 
```
$ docker build -t nightlife .
$ docker run -d -e ROOT_URL=http://yourapp.com -e METEOR_SETTINGS="$(cat ../../nightlife/settings.json)" -p 7000:80 nightlife
```
### Deploy on AWS 
Follow the tutorial [Deploying a MeteorJS app to ECS](http://krishamoud.me/deploying-meteor-to-aws-ecs/). Make sure set Environment Variables:
```
key: ROOT_URL
value: http://tempdomain.com
key: PORT
value: 80
key: MONGO_URL
value: xxx
key: METEOR_SETTINGS
value: {ConsumerKey:xxx, ConsumerSecret:xxx, Token: xxx, TokenSecret:xxx}
```
BTW, don't worry if Environment Variables are not correct, we can create new task revision, update settings, stop the running task and add the new revision taks to Cluster

## DONE! 
:tada::tada::tada::tada:
