FROM node:latest
WORKDIR /youtube
COPY . /youtube/
EXPOSE 3000
CMD [ "npm", "run", "server" ]
