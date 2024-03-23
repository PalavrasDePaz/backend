FROM node:17.9-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

ENTRYPOINT [ "npm", "run" ]
CMD ["start"]