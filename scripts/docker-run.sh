#!/bin/bash

REGISTRY=${REGISTRY:-gcr.io}
PROJECT=${PROJECT:-aserto-298622}
IMAGE=${IMAGE:-peoplefinder}

# extract version from package.json
VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

docker run --rm --env-file .env.docker -d -p 3000:3000 -p 3001:3001 --name peoplefinder $REGISTRY/$PROJECT/$IMAGE:$VERSION
