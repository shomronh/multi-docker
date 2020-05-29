FROM node:alpine

WORKDIR '/app'

COPY ./package.json ./

RUN npm install

COPY . .

# in dev mode we are using nodemon
# in production mode we dont use nodemon 
CMD ["npm","run","start"]