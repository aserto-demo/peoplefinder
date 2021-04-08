#!/bin/bash

REGISTRY=${REGISTRY:-gcr.io}
PROJECT=${PROJECT:-aserto-298622}
IMAGE=${IMAGE:-peoplefinder}
SERVICE=${SERVICE:-peoplefinder}

# extract version from package.json
VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

gcloud run deploy $SERVICE \
  --image $REGISTRY/$PROJECT/$IMAGE:$VERSION \
  --platform managed --allow-unauthenticated