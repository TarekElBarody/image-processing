#  Database Schema

> NOTE THAT THE SERVER AT START WILL INSERT THE DEFAULT ADMIN USER WITH DEFAULT PASSWORD

> YOU SOULD LOGIN FIRST TO GENERATE ADMIN TOKEN
```

{
    "email": "admin@admin.com",
    "password": "123456789"
}
```

## Database Schema

- [Users TABLE](#Users-TABLE-users)
- [Images TABLE](#Images-TABLE-images)
- [Thumbs TABLE](#Thumbs-TABLE-thumbs)


#### Users (TABLE users)
- id [SERIAL PRIMARY KEY]
- first_name [VARCHAR(50)]
- last_name [VARCHAR(50)]
- birthday [DATE]
- email [VARCHAR(200)] [UNIQUE]
- password [VARCHAR(255)]
- mobile [VARCHAR(20)] [UNIQUE]
- role [INTEGER]  >  Admin = 1, Moderator = 2, User = 3
- created [DATE]

#### Images (TABLE images)
- id [SERIAL PRIMARY KEY]
- user_id > Forgien Key [users.id](#Users-TABLE-users)
- filename [VARCHAR(255)] [UNIQUE]
- width [INTEGER] 
- height [INTEGER] 
- created [TIMESTAMP] 
- bucket_key [TEXT]
- access [INTEGER]

#### Thumbs (TABLE thumbs)
- id [SERIAL PRIMARY KEY]
- image_id > Forgien Key [images.id](#Images-TABLE-images)
- filename [VARCHAR(255)] [UNIQUE]
- width [INTEGER] 
- height [INTEGER] 
- format [VARCHAR(10)]
- fit [VARCHAR(10)]
- modified [TIMESTAMP] 
- bucket_key [TEXT]
- UNIQUE (image_id, width, height, format, fit)
