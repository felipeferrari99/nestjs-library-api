FROM node:18.17.1

COPY . .

COPY package*.json ./ 

RUN npm i

WORKDIR /usr/app

EXPOSE 3000

CMD [ "npm", "run", "dev" ]