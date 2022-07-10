#!/bin/bash
npm i
npm install babel-plugin-import --save-dev
npm run build
cp -Rvp $1/dist/. /var/www/html