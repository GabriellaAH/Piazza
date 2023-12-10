FROM alpine
RUN apk add --update nodejs npm
COPY . /src
WORKDIR /src
# Install app dependencies
RUN npm install
EXPOSE 3000
ENTRYPOINT ["node", "./app.js"]