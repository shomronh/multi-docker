FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .

# this CMD format not working
# CMD ["npm","run","build"]

# This works
CMD npm run build

FROM nginx
EXPOSE 3000
COPY  ./nginx/default.conf  /ect/nginx/conf.d/default.conf
COPY  --from=builder  /app/build  /usr/share/nginx/html