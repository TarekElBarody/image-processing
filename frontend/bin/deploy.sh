#!/bin/bash
aws s3 sync ./build s3://image-processing-front-store/ --delete