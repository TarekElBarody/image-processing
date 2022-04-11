#!/bin/bash
eb use Imageprocessingbackend-env

eb deploy --profile eb-cli

aws cloudfront create-invalidation --distribution-id EGJUPFQMKH5XJ --paths "/*"