#!/bin/bash
eb use Imageprocessingbackend-env

#eb setenv AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY AWS_BUCKET_NAME=$AWS_BUCKET_NAME API_SERVER=$API_SERVER IMAGES_CLOUD=$IMAGES_CLOUD ENV=$ENV LOG_SIZE=$LOG_SIZE NO_CONSOLE=$NO_CONSOLE PEPPER=$PEPPER PORT=$PORT POSTGRES_DB=$POSTGRES_DB POSTGRES_DB_TEST=$POSTGRES_DB_TEST POSTGRES_HOST=$POSTGRES_HOST POSTGRES_PASSWORD=$POSTGRES_PASSWORD POSTGRES_USER=$POSTGRES_USER ROUND=$ROUND SECURE=$SECURE SESSION_SLAT=$SESSION_SLAT SSL_PORT=$SSL_PORT TOKEN_SECRET=$TOKEN_SECRET
eb deploy

aws cloudfront create-invalidation --distribution-id EGJUPFQMKH5XJ --paths "/*"