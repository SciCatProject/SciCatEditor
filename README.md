# SciCat Editor

A web-based editor for metadata.json files for use with PSI's Data Catalog.


## Installation

Requires npm for development.

To build:

    npm install
    npm run build

This will generate all needed files in `dist/`.

To update the build upon changes:

    npm run build -- --watch

## Web Server

To serve files from a docker-based nginx webserver (requires docker):

    npm run docker-serve

This will make a local server available at http://127.0.0.1:8080/.
Alternative ports can be specified via the `PORT` environmental variable.

    PORT=9090 npm run docker-serve
