#!/bin/bash
eb use Imageprocessingbackend-env

eb deploy

aws cloudfront create-invalidation --distribution-id EGJUPFQMKH5XJ --paths "/*"