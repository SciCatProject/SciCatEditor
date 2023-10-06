# SciCat Editor

A web-based editor for metadata.json files for use with PSI's Data Catalog.


## Docker Installation

The easiest way to get up-and-running is with docker. The following command will
build the editor and start an nginx server to serve the files:

    docker-compose up -d

Navigate your browser to http://127.0.0.1:8080.

After making changes to top-level configuration files you should rebuild the docker image:

    docker build -t scicateditor --no-cache .



## Local Installation

Requires npm for development.

To build:

    npm install
    npm run build

This will generate all needed files in `dist/`.

To update the build upon changes:

    npm run watch

## Dev Server

To serve files using webpack-dev-server:

    npm run serve

This will make a local server available at http://127.0.0.1:8080/.

This can also be run from docker:

    docker-compose run --service-ports -d devserver

