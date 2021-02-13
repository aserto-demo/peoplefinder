#!/bin/bash

# bump the patch number in the version 
VERSION=$(npm version patch)

# strip the 'v' from the vM.m.r
VERSION=$(echo $VERSION | cut -c 2-)

# submit the build to google cloud build and tag the image with the version
gcloud builds submit --tag gcr.io/$PROJ/$IMAGE:$VERSION
