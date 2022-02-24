FROM node:16

WORKDIR /home/node/app

COPY . ./

COPY .env_example ./.env

RUN npm install

EXPOSE 8000

CMD [ "npm", "start" ]