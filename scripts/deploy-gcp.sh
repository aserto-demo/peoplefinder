#!/bin/bash
gcloud run deploy $SVC \
  --image gcr.io/$PROJ/$IMAGE \
  --platform managed --allow-unauthenticated