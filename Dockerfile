FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 3000

CMD ["npm", "run", "start:dev", "node", "dist/main"]