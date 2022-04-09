#!/bin/bash
eb deploy

aws cloudfront create-invalidation --distribution-id E3SRADI6HYOK0D --paths "/*"