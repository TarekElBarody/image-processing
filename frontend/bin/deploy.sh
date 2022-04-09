#!/bin/bash
aws s3 cp --recursive --acl public-read ./build s3://image-processing-fronted-bucket/

aws cloudfront create-invalidation --distribution-id E3SRADI6HYOK0D --paths "/*"