#!/bin/bash

# extract version from package.json
VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

gcloud run deploy $SVC \
  --image gcr.io/$PROJ/$IMAGE:$VERSION \
  --platform managed --allow-unauthenticated