# Image Processing Backend

This is a starter application that contains generic configurations, code formatter, error checking, code checking, and test modules to check the effectiveness of the application over 30 code checks. Using [`nodeJS`](https://nodejs.org/en/) with [`Express`](https://www.npmjs.com/package/expresss), [`TypeScript`](https://www.npmjs.com/package/typescript) , [`ESlint`](https://www.npmjs.com/package/eslint), [`Prettier`](https://www.npmjs.com/package/prettier) , [`Jasmine`](https://www.npmjs.com/package/jasmine) , [`supertest`](https://www.npmjs.com/package/supertest) , [`Sharp`](https://www.npmjs.com/package/sharp) , [`multer`](https://www.npmjs.com/package/multer) , [`compression`](https://www.npmjs.com/package/compression) , [`bcrypt`](https://www.npmjs.com/package/bcrypt) , [`body-parser`](https://www.npmjs.com/package/body-parser) , [`morgan`](https://www.npmjs.com/package/morgan) modules . 
- The application supports SSL and is ready to work on both HTTP and HTTPS.
- Front-end application with a simple control panel with login feature, password authentication and encryption.
- API calls to get stats and update the front end with the latest updates.
 - photo manager, for upload and resize photos , very simple and effective interface
- generate the thumbnail on the fly and work with organized API endpoint 
- changing the size of the thumbnails by selecting the appropriate size 
- output as an image or as a JSON format with all the data that you can use in developing your own application
- easy to deal with the stored image and clearing the cache.
- dealing with images through API points very easy and fun
- All programming steps have been explained inside each page
- All necessary checks have been done as a reference that you can develop on
- Strong typing is providing by Typescript for reduce errors

# Table of contents:

- [Database Setup](#Database-Setup)
- [Environment Setup](#Environment-Setup)
- [Running the server](#Running-the-server)
	 - [Starting the server](#Starting-the-server)
	 - [Linting code error](#Linting-code-error)
	 - [Formatting the code](#Formatting-the-code)
	 - [Clean destination folder](#Clean-dist-folder)
	 - [build the project](#Build-the-project)
	 - [Build and Serve the project](#Build-and-Serve-the-project)
	 - [Run jasmine test](#Run-jasmine-test)
- [App Directory](#App-Directory) 
- [API Documentation](#API-Documentation)
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



# Database Setup 
- Using PostgreSQL 14
- [Download & Install PostgreSQL](https://www.postgresql.org/download/)
- Run psql script
- Create User & database :

```ssh
CREATE USER store_user WITH PASSWORD '123456789';
returns > CREATE ROLE

CREATE DATABASE store_db;
returns > CREATE DATABASE

CREATE DATABASE store_db_test;
returns > CREATE DATABASE

GRANT ALL PRIVILEGES ON DATABASE store_db TO store_user;
returns > GRANT

GRANT ALL PRIVILEGES ON DATABASE store_db_test TO store_user;
returns > GRANT

```

- Migrate the database tables

```
npm run migrate

```
- Follow Database Schema [database documentation](Database-Schema.md)


# Environment Setup 
- Using nodeJS v16.13.2 and NPM 8.4.1
- If you using lower or higher version of node please use [Node Package Manager](https://www.npmjs.com/)
- Install all modules by using :
```ssh
npm install
```
## Running the server

#### Starting the server
> we user ts-node & nodemon to running the code
```ssh
npm start
> image-processing@1.0.0 start

HTTP server on port 5000 at http://localhost:5000/
HTTPS server on port 8443 at https://localhost:8443/
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
+ Executed 41 of 41 specs SUCCESS in 2 secs.

```



# App Directory 
```
 - dist               # transpile Typescript to es5 js to this folder
   - env              # store ssl keys and user.json for saved password
   - bin              # Bash script to run deploy 
   - logs             # store user logs and processing image logs and access server logs
   - public           # public folder for front-end (html + css + js)
   - spec             # configures for Jasmine Testing
   - src              # source code for typescript *.ts
     - handlers       # API Hndler , image handler & user handler
     - lib            # function , middleware , helper
     - routes         # API routs & web routs & middleware & functions
     - types          # All types for typescript
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
> change :filename with the image file name
`GET /api/images`

    http://localhost:5000/api/images/:filename?width=1000&height=1000&catching=1&out=json
    


### Response Resize Out Json

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
    "original": "return full api path for the full image file name",
    "thumbFile": "return the full api path for the thumb file name",
    "width": 1000,
    "height": 1000,
    "format": "jpeg"
    }

### Request Resize Out Image
> change :filename with the image file name
`GET /api/images`

    http://localhost:5000/api/images?name=encenadaport&ext=jpg&width=200&height=200&catching=1&out=img    


### Request All thumbs for image
> change :filename with the image file name
`GET /api/images`

    http://localhost:5000/api/images?name=encenadaport&out=all
    
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

### Request Clear Thumbs
`POST /api/images/delete/thumbs`

    http://localhost:5000/api/images/delete/thumbs
    

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
> require user token
```
- [folder]      # select full or thumb folder     ||  default is full folder
- [filter]      # filter images by name           ||  default no filter


```

### Request List
> requier user token
`GET /api/images/list`

    http://localhost:5000/api/images/list?folder=full&filter=el
    

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
> require user token
```
- [noConsole]	# in development turn off the console out put for testing (0 | 1)
- [jasmine]	# in development using jasmine token to bypass login requirement (Token is safe in  helper folder)

```

### Request Images & Thumb Count
> requier user tokens
`GET /api/images/count`

    http://localhost:5000/api/images/count
    

### Response Images & Thumb Count

    HTTP/1.1 200 OK
    Status Code: 200 OK
    Content-Type: application/json

	   {
	   "fullCount":6,
	   "thumbCount":6 
	   }

## Get Image Process History
> require user tokens


### Request Image Process History
`GET /api/images/history`

    http://localhost:5000/api/images/history
    

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
> require user tokens

### List Parameters 
```
- field [photo]      # the name of photo field name that the server will seeking for it to process

```

### Request Upload
`POST /api/upload`

    http://localhost:5000/api/upload
    
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
> require user tokens

### Reset Parameters 
```
- [password]      # Current user password
- [newpassword]      # New user password
- [newpassword2]      # Verify for New user Password

```

### Request Reset
`POST /api/users/reset`

    http://localhost:5000/api/users/reset
    
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


