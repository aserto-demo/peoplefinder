#!/bin/bash
docker run --rm -d -p 3000:3000 -p 3001:3001 --name peoplefinder gcr.io/$PROJ/$IMAGE
