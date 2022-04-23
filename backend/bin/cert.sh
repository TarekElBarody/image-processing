#!/bin/bash
mkdir cert
aws s3 cp s3://elasticbeanstalk-us-east-1-964295443472/server.cert cert/server.cert
aws s3 cp s3://elasticbeanstalk-us-east-1-964295443472/server.key cert/server.key