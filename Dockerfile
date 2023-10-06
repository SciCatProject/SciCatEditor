FROM node:alpine
LABEL maintainer="spencer.bliven@psi.ch"

WORKDIR /app
VOLUME /app/src
VOLUME /app/dist

ADD package.json /app/
ADD package-lock.json /app/
ADD *.config.js /app/

RUN npm install
RUN npm install webpack webpack-dev-server

EXPOSE 8080

ENTRYPOINT ["npx", "webpack-dev-server", "--host", "0.0.0.0"]
CMD ["--hot", "--progress"]