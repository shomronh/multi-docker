FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .

# instead of using CMD use a RUN command
# CMD ["npm","run","build"]

# This works
RUN npm run build

FROM nginx
EXPOSE 3000
COPY  ./nginx/default.conf  /ect/nginx/conf.d/default.conf
COPY  --from=builder  /app/build  /usr/share/nginx/html