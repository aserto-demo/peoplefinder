#!/bin/bash
docker build --build-arg CACHEBUST=1 --tag gcr.io/$PROJ/$IMAGE .