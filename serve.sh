#!/bin/sh
docker run --rm --name datacat_editor -v $PWD:/usr/share/nginx/html:ro  -p 8080:80 -d nginx