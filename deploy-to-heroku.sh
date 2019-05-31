#!/bin/bash

# Build js bundle
cd src/client
npm run build-prod
cd ../..

# Make a new git repo for server
cp -r src/server server-copy
cp .gitignore server-copy
cd server-copy
git init
git remote add heroku https://git.heroku.com/watch-together-beta.git
git add .
git add dist -f
git commit -m 'Heroku deployment'
git push heroku master -f
cd ..

# Cleanup
rm -rf server-copy
