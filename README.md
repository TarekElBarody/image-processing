# Image Processing Frontend & Backend API With Deployment
[![CircleCI Build Status](https://circleci.com/gh/TarekElBarody/image-processing.svg?style=shield)](https://circleci.com/gh/TarekElBarody/image-processing)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/circleci/circleci-docs/master/LICENSE)

This is a full web app with full deployment process using :
- Backend Express & NodeJS & Postgres as an API Server [See Backend README](backend/README.md)
- Frontend application with a simple control panel with login feature Using React 18 [See Frontend README](frontend/README.md).
- AWS RDS PostgreSQL Database for store user data and images urls.
- AWS Elastic Beanstalk for API Server
- AWS S3 Bucket for storing React App Static Files
- AWS S3 Bucket for Store Images uploaded to API
- AWS CloudFront for demonstrate caching and speed delivery for React Static File from S3 Bucket
- AWS CloudFront for S3 Bucket that hold the images for best catching techniques and prevent public access
- AWS CloudFront for Elastic Beanstalk Server to Enable best SSL support and CORS configuration
- CircleCI Platform to Create Pipeline and CI/CD deployment


# Table of contents:

- [Environment Setup](#Environment-Setup)
- [Deployment Diagram](#Environment-Setup)
- [AWS Configuration](#Running-the-server)
	 - [Starting the server](#Starting-the-server)
	 - [Linting code error](#Linting-code-error)
	 - [Formatting the code](#Formatting-the-code)
	 - [Clean destination folder](#Clean-dist-folder)
	 - [build the project](#Build-the-project)
	 - [Build and Serve the project](#Build-and-Serve-the-project)
	 - [Run jasmine test](#Run-jasmine-test)
- [CircleCI Pipeline](#App-Directory) 
	 - [Starting the server](#Starting-the-server)
	 - [Linting code error](#Linting-code-error)
- [RunBook](#API-Documentation)
	- [Image Resizing API](#Image-Resizing-API)
		- [Resizing Parameters](#Resizing-Parameters)	
		- [Request Resize to Json](#Request-Resize-Out-Json)
		- [Request Resize to Image](#Request-Resize-Out-Image)
		- [Request All thumbs](#Request-All-thumbs-for-image)
	- [Clear Thumb Cache](#Clear-Thumb-Cache)
	  	- [Request Clear Thumbs](#Request-Clear-Thumbs)
	- [Get a list of images folder](#Get-a-list-of-images-folder)
		- [List Parameters](#List-Parameters)
		- [Request List](#Request-List)
	- [Get a list of images folder](#Get-a-list-of-images-folder)
		- [Request List](#Request-List)
	- [Get Images & Thumb Count](#Get-Images-&-Thumb-Count)
		- [Request Count](#Request-Images-&-Thumb-Count) 
	- [Get Image Process History](#Get-Image-Process-History)
		- [Request History](#Request-Image-Process-History) 
	- [Upload Image to Full Folder](#Upload-Image-to-Full-Folder)
		- [Request Upload](#Request-Upload) 
	- [Reset User Password](#Reset-User-Password)
		- [Request Reset](#Request-Reset) 
- [Access Web Control Panel](#Access-Web-Control-Panel)
- [Screen Shots](#ScreenShots)




# Environment Setup 
> get the repo from the Github

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
## Running the server

#### Starting the server
> we user ts-node & nodemon to running the code
```ssh
npm start
> image-processing@1.0.0 start
> nodemon

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts
[nodemon] starting `ts-node ./src/index.ts`
HTTP server on port 3000 at http://localhost:3000/
HTTPS server on port 4000 at https://localhost:4000/
```

#### Linting code error
```ssh
npm run lint

> image-processing@1.0.0 lint
> eslint "src/**/*.ts"

```

#### Formatting the code
```ssh
npm run prettier

> image-processing@1.0.0 prettier
> prettier --config .prettierrc "src/**/*.ts" --write
src/index.ts 55ms
src/lib/app.ts 39ms
src/lib/functions/cryptUser.ts 82ms
src/lib/functions/getPathName.ts 26ms
src/lib/functions/handelCachedThumb.ts 23ms
src/lib/functions/handelImageNoSize.ts 26ms
src/lib/functions/handelImageResize.ts 42ms
src/lib/functions/handelOutputAll.ts 21ms
src/lib/functions/imageResize.ts 73ms
src/lib/functions/logger.ts 34ms
src/lib/functions/safeString.ts 9ms
src/lib/helper/jasmine tokens.ts 3ms
src/lib/middleware/imageDeleteSelected.ts 56ms
src/lib/middleware/imageDeleteThumbs.ts 30ms
src/lib/middleware/imageFetch.ts 46ms
src/lib/middleware/imageHistory.ts 20ms
src/lib/middleware/imageList.ts 23ms
src/lib/middleware/imageListCount.ts 18ms
src/lib/middleware/postLogin.ts 11ms
src/lib/middleware/uploadImages.ts 23ms
src/lib/middleware/usersReset.ts 26ms
src/lib/types/cryptType.ts 5ms
src/lib/types/fileUpload.ts 3ms
src/lib/types/ImageRequest.ts 10ms
src/lib/types/session.ts 4ms
src/routes/mainRoute.ts 5ms
src/routes/routePaths/apiRoute.ts 13ms
src/routes/routePaths/webRoute.ts 41ms
src/tests/helpers/jasmine tokens.ts 4ms
src/tests/helpers/prepTestImage.ts 11ms
src/tests/helpers/reporter.ts 5ms
src/tests/indexSpec.ts 9ms
src/tests/lib/functions/imageResizeSpec.ts 19ms
src/tests/lib/middleware/imageDeleteSelectedSpec.ts 19ms
src/tests/lib/middleware/imageDeleteThumbsSpec.ts 18ms
src/tests/lib/middleware/imageFetchSpec.ts 55ms
src/tests/lib/middleware/imageHistorySpec.ts 24ms
src/tests/lib/middleware/imageListSpec.ts 14ms
src/tests/lib/middleware/postLoginSpec.ts 15ms
src/tests/lib/middleware/uploadImagesSpec.ts 27ms
src/tests/routes/routePaths/apiRouteSpec.ts 12ms
src/tests/routes/routePaths/webRouteSpec.ts 8ms
```

#### Clean dist folder
```ssh
npm run clean
```
#### Build the project
```ssh
npm run build
```

#### Build and Serve the project
```ssh
npm run serve
```

#### Run jasmine test
```ssh
npm run test
```
```diff
Jasmine started
HTTP server on port 3000 at http://localhost:3000/
HTTPS server on port 4000 at https://localhost:4000/

  1 Test Server Start (indexSpec)
+    ✓ Should HTTP return status 200
+    ✓ Should HTTPS return status 200

  2 Test Image Resize Function (imageResizeSpec)
+    ✓ Should Resize the Image Successfully
+    ✓ Should return Error providing image fit option
+    ✓ Should return Error wrong Format

  3 Test Deleting Original Image From API (imageDeleteSelectedSpec)
+    ✓ Should Delete a Full Image API
+    ✓ Should SSL Delete a Full Image API

  4 Test Clear Thumb Images API (imageDeleteThumbsSpec)
+    ✓ Should Clear Thumb Images
+    ✓ Should SSL Clear Thumb Images

  5 Test Image Processing API (imageFetchSpec)
+   ✓ Should generate thumb file for 1st time
+    ✓ Should Process & Serve Cached thumb file
+    ✓ Should return Error wrong Format
+    ✓ Should return Error No file name provided
+    ✓ Should return Requested File name Not exist
+    ✓ Should return JSON output for image thumb
+    ✓ Should return JSON to all thumb for original image
+    ✓ Should SSL Enabled for Image Processed

  6 Test Get Image Processing History API (imageHistorySpec)
+    ✓ Should Get Image Processing History List
+    ✓ Should SSL Get Image Processing History List

  7 Test Getting Full Image List (imageListSpec)
+    ✓ Should Return JSON List for all full images
+    ✓ Should SSL Return JSON List for all full images

  8 Test User Login (postLoginSpec)
+    ✓ Should User Login & Redirected to Home Page /
+    ✓ Should SSL User Login & Redirected to Home Page /

  9 Test Upload Image API (uploadImagesSpec)
+    ✓ Should Upload Image Successfully
+    ✓ Should SSL Upload Image Successfully

  10 Test API Endpoints Access (apiRouteSpec)
+    ✓ Should Endpoint is Responding 200 With Json
+    ✓ Should API Return error 404 Not found for not controlled endpoint
+   ✓ Should SSL Enabled for Endpoint

  11 Test Web Route Access (webRouteSpec)
+    ✓ Should Web Front Forwarded to Login Page
+    ✓ Should SSL Web Front Forwarded to Login Page

+Executed 30 of 30 specs SUCCESS in 2 secs.

```



# App Directory 
```
 - dist               # transpile Typescript to es5 js to this folder
   - env              # store ssl keys and user.json for saved password
   - images           # store and process the resizing and caching for images
   - logs             # store user logs and processing image logs and access server logs
   - public           # public folder for front-end (html + css + js)
   - spec             # configures for Jasmine Testing
   - src              # source code for typescript *.ts
     - lib            # function , middleware , helper , types
     - routes         # API routs & web routs
     - tests          # Jasmine testing
   - package.json     # store all script and module and configuration for node project
   - tsconfig.json    # store Typescript Configuration
   - .prettierrc      # store Prettier configuration for code formatter
   - .eslintrc        # store ESlint code linting for typescript

```

# API Documentation

## Image Resizing API

### Resizing Parameters

```
- [name]      # set the filename                ||  Throw Error if not provided 
- [ext]       # set the extension               ||  seeking for default JPG // if wrong format throw error
- [width]     # set the width                   ||  return the original image width
- [height]    # set the height                  ||  return the original image height
- [format]    # set the output format           ||  return the default JPG // if wrong format throw error
- [fit]       # set the resize crop fitting      ||  return the default fill -- no crop
- [catching]  # enable or disable cache thumb   ||  its enabled by default ** if disabled will resize even the cache exists
- [out]       # set the final output            ||  (img) is default you can choose (json) or (all)

- [noConsole]	# in development phase turn off the console out put for testing (0 | 1)



[fit] cover, contain, fill, inside or outside., default 'fill'

[format & ext] heic, heif, avif, jpeg, jpg, png, raw, tiff, tif, webp, gif, jp2, jpx, j2k, j2c`

```
### Request Resize Out Json
`GET /api/images`

    http://localhost:3000/api/images?name=encenadaport&ext=jpg&width=1000&height=1000&catching=1&out=json
    


### Response Resize Out Json

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
    "original": "/images/full/encenadaport.jpg",
    "thumbFile": "/images/thumb/encenadaport_1000_1000_fill.jpg",
    "width": 1000,
    "height": 1000,
    "format": "jpeg"
    }

### Request Resize Out Image
`GET /api/images`

    http://localhost:3000/api/images?name=encenadaport&ext=jpg&width=200&height=200&catching=1&out=img    


### Response Resize Out Image

    HTTP/1.1 200 OK
    Content-Type: image/jpeg
    
![image](https://www.tameemat.com/encenadaport.jpg) 

### Request All thumbs for image
`GET /api/images`

    http://localhost:3000/api/images?name=encenadaport&out=all
    
### Response All thumbs for image

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
    "original": "/images/full/encenadaport.jpg",
    "thumbs": [
        {
            "thumbFile": "/images/thumb/encenadaport_1000_1000_fill.jpg",
            "width": 1000,
            "height": 1000,
            "format": "jpeg"
        },
        {
            "thumbFile": "/images/thumb/encenadaport_200_200_fill.gif",
            "width": 200,
            "height": 200,
            "format": "gif"
        },
        {
            "thumbFile": "/images/thumb/encenadaport_200_200_fill.jpg",
            "width": 200,
            "height": 200,
            "format": "jpeg"
        },
        {
            "thumbFile": "/images/thumb/encenadaport_200_200_fill.png",
            "width": 200,
            "height": 200,
            "format": "png"
        }
    ]
    }
 
## Clear Thumb Cache
> require user logged in with session.id to can perform this action
```
- [noConsole]	# in development phase turn off the console out put for testing (0 | 1)
- [jasmine]	# in development using jasmine token to bypass login requirement (Token is safe in  helper folder)

```

### Request Clear Thumbs
`POST /api/images/delete/thumbs`

    http://localhost:3000/api/images/delete/thumbs
    

### Response Clear Thumbs

    HTTP/1.1 200 OK
    Status Code: 200 OK
    Content-Type: application/json

	    {
	   "success":true,
	   "message":"Cached images deleted from the disk successfully"
	   }

## Get a list of images folder
### List Parameters 
> require user logged in with session.id to can perform this action 
```
- [folder]      # select full or thumb folder     ||  default is full folder
- [filter]      # filter images by name           ||  default no filter

- [noConsole]	# in development turn off the console out put for testing (0 | 1)
- [jasmine]	# in development using jasmine token to bypass login requirement (Token is safe in  helper folder)

```

### Request List
`GET /api/images/list`

    http://localhost:3000/api/images/list?folder=full&filter=el
    

### Response List

    HTTP/1.1 200 OK
    Status Code: 200 OK
    Content-Type: application/json
    
	 {
	   "folder":"full",
	   "filter":"el",
	   "images":[
	      {
		 "filename":"icelandwaterfall",
		 "format":"jpg"
	      },
	      {
		 "filename":"palmtunnel",
		 "format":"jpg"
	      }
	   	]
	  }

## Get Images & Thumb Count
> require user logged in with session.id to can perform this action 
```
- [noConsole]	# in development turn off the console out put for testing (0 | 1)
- [jasmine]	# in development using jasmine token to bypass login requirement (Token is safe in  helper folder)

```

### Request Images & Thumb Count
`GET /api/images/count`

    http://localhost:3000/api/images/count
    

### Response Images & Thumb Count

    HTTP/1.1 200 OK
    Status Code: 200 OK
    Content-Type: application/json

	   {
	   "fullCount":6,
	   "thumbCount":6 
	   }

## Get Image Process History
> require user logged in with session.id to can perform this action 
```
- [noConsole]	# in development turn off the console out put for testing (0 | 1)
- [jasmine]	# in development using jasmine token to bypass login requirement (Token is safe in  helper folder)

```

### Request Image Process History
`GET /api/images/history`

    http://localhost:3000/api/images/history
    

### Response Image Process History

    HTTP/1.1 200 OK
    Status Code: 200 OK
    Content-Type: application/json

	   {
	   "data":[
	      {
		 "num":1,
		 "time":"Mon Feb 21 2022 11:16:33",
		 "duration":"3ms",
		 "process":"Cached thumb served to user for image encenadaport with format jpeg with width 200 & height 200"
	      },
	      {
		 "num":2,
		 "time":"Mon Feb 21 2022 11:14:50",
		 "duration":"149ms",
		 "process":"Success processing thumb for image palmtunnel to format jpeg with width 245 & height 245"
	      },
	      {
		 "num":3,
		 "time":"Mon Feb 21 2022 11:14:50",
		 "duration":"168ms",
		 "process":"Success processing thumb for image encenadaport to format jpeg with width 245 & height 245"
	      },
	   ]
	}


## Upload Image to Full Folder
> require user logged in with session.id to can perform this action 

### List Parameters 
```
- field [photo]      # the name of photo field name that the server will seeking for it to process

- [noConsole]	# in development turn off the console out put for testing (0 | 1)
- [jasmine]	# in development using jasmine token to bypass login requirement (Token is safe in  helper folder)

```

### Request Upload
`POST /api/upload`

    http://localhost:3000/api/upload
    
	------ POST Form Data / multipart/form-data
	
	Content-Disposition: form-data; name="photo"; filename="test-post-image.png"
	Content-Type: image/png
	
	------POST Form Data
    

### Response Upload

    HTTP/1.1 200 OK
    Status Code: 200 OK
    Content-Type: application/json

	{
	   "status":"success",
	   "message":"File Uploaded successfully"
	}

## Reset User Password
> require user logged in with session.id to can perform this action 

### Reset Parameters 
```
- [password]      # Current user password
- [newpassword]      # New user password
- [newpassword2]      # Verify for New user Password

- [noConsole]	# in development turn off the console out put for testing (0 | 1)
- [jasmine]	# in development using jasmine token to bypass login requirement (Token is safe in  helper folder)

```

### Request Reset
`POST /api/users/reset`

    http://localhost:3000/api/users/reset
    
   	 ------ POST Form Data 
	
	username: admin
	password: admin
	newpassword: 123456
	newpassword2: 123456
	
	------POST Form Data
    

### Response Reset

    HTTP/1.1 200 OK
    Status Code: 200 OK
    Content-Type: application/json

	{
	   "success":true,
	   "message":"Password Changed Successfully"
	}

# Access Web Control Panel
> note: default username : admin && password : admin

- Use any browser and access the url with the hostname and the port

```
http://localhost:3000/

```
## Screen Shots
![image-processing](https://www.tameemat.com/image-processing.png) ![image-processing-2](https://www.tameemat.com/image-processing-2.png) ![image-processing-3](https://www.tameemat.com/image-processing-3.png)

