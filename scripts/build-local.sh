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

docker build --build-arg CACHEBUST=1 --tag $REGISTRY/$PROJECT/$IMAGE:$VERSION .