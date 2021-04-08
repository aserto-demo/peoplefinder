#!/bin/bash

REGISTRY=${REGISTRY:-gcr.io}
PROJECT=${PROJECT:-aserto-298622}
IMAGE=${IMAGE:-peoplefinder}

# bump the patch number in the version 
VERSION=$(npm version patch)

git push --follow-tags

# strip the 'v' from the vM.m.r
VERSION=$(echo $VERSION | cut -c 2-)

# submit the build to google cloud build and tag the image with the version
gcloud builds submit --tag $REGISTRY/$PROJECT/$IMAGE:$VERSION
