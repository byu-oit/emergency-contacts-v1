FROM node

WORKDIR /app

ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm install

ADD index.js claims.js
ADD swagger.json swagger.json
ADD controllers controllers

CMD [ "node","claims.js"]
