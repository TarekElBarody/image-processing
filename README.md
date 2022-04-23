# Image Processing Frontend & Backend API With Deployment
[![CircleCI Build Status](https://circleci.com/gh/TarekElBarody/image-processing.svg?style=shield)](https://circleci.com/gh/TarekElBarody/image-processing)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/circleci/circleci-docs/master/LICENSE)

This is a full web app with full deployment process using :
- Backend Express & NodeJS & Postgres as an API Server [See Backend README](backend/README.md)
- Frontend application with a simple control panel with login feature Using React 18 [See Frontend README](frontend/README.md).
- AWS RDS PostgreSQL Database for store user data and images URLs.
- AWS Elastic Beanstalk for API Server
- AWS S3 Bucket for storing React App Static Files
- AWS S3 Bucket for Store Images uploaded to API
- AWS CloudFront for demonstrate caching and speed delivery for React Static File from S3 Bucket
- AWS CloudFront for S3 Bucket that hold the images for best catching techniques and prevent public access
- CircleCI Platform to Create Pipeline and CI/CD deployment
- Cloudflare for domain name point to servers

# Runbook 
> RunBook will redirect you to the file .md for each one

- [App dependencies](runbook/App-dependencies.md)
- [Infrastructure Description (AWS)](runbook/Infrastructure-description.md)
- [Pipeline process (CircleCI)](runbook/Pipeline-process.md)


# Table of contents:
- [Environment Setup](#Environment-Setup)
- [App Directory](#App-Directory)
- [Deployment Diagram](#Deployment-Diagram)
- [Access Web And Test](#Access-Web-And-Test)



# Environment Setup 
> get the repo from the GitHub

```ssh
git clone https://github.com/TarekElBarody/image-processing.git
cd  image-processing
```

> Follow the structured inside every stack folder we have
- Backend API Server [See Backend README](backend/README.md)
- Frontend application React 18 [See Frontend README](frontend/README.md)

> you can use the root package.json to call install and build for both stack folder

```ssh
npm frontend:install
npm frontend:build

npm backend:install
npm backend:build

```

# App Directory 
```
  - .circleci         # CircleCI Configuration Folder
    - config.yml      # CircleCI Configuration file for deployment pipeline script
  - backend           # Backend Express & NodeJS Project folder
  - frontend          # Frontend application React App Folder
  - runbooks          # A container of .md file explain all function needed to run AWS Services
  - screenshots       # Contain All Screenshots that needed for README files
  - package.json      # store all script and module and configuration for node project
  

```

# Deployment Diagram

![image-processing-diagram](screenshots/image-processing-diagram.jpg)





# Access Web And Test
> We use the domain name img-api.tk as a test of doplayment
* You can access the react app frontend from here [https://www.img-api.tk/](https://www.img-api.tk/)
* Server back end checkout from here [https://eb.img-api.tk/api](https://eb.img-api.tk/api)
> the default email is `admin@admin.com` and password is `123456789`