#!/bin/bash
#aws s3 cp --recursive --acl public-read ./build s3://image-processing-front-store/
aws s3 sync ./build s3://image-processing-front-store/ --delete
aws cloudfront create-invalidation --distribution-id E195QY8FTHUTVJ --paths "/*"