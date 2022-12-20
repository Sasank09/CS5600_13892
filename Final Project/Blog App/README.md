<H1 align ="center" > MERN BLOG  </h1>
<h5  align ="center"> 
Fullstack open source blogging application made with MongoDB, Express, React & Nodejs (MERN) </h5>
<br/>

## Configuration and Setup

Technologies Utilized:
• Frontend: ReactJS, NextJS, CSS, JavaScript, Bootstrap
• Backend: NodeJS
• Database: MongoDB

In order to run this project locally, 
- Open the project in your prefered code editor.
- Go to terminal -> New terminal (If you are using VS code)
- Split your terminal into two (run the Frontend on one terminal and the Backend on the other terminal)

```
In One Terminal: from project folder location, use the below commands to start mongo DB connection
• cd Backend
• npm install
• npm start
```
```
In Other Terminal: from project folder location, use the below commands to start Frontend react
connection
• cd Frontend
• npm install
• npm start
```

To Change Database Connection URL : Blog -> Backend -> Config -> config.env file Update mongo DB URI

 ---  Config.env  ---
NODE_ENV = development
PORT =5000
URI =http://localhost:3000 #or mongodb remote url
MONGO_URI = 
JWT_SECRET_KEY =
JWT_EXPIRE = 60m
RESET_PASSWORD_EXPIRE = 3600000 


##  Key Features

- User registration and login
- Authentication using JWT Tokens
- Story searching  and pagination 
- CRUD operations (Story create, read, update and delete)
- Upload user ımages and story ımages  to the server
- Liking/disliking stories and adding stories  to the Reading list
- Commenting  on the story and like/dislike comment
- blocking users to comment on their stories

<br/>

##  Technologies used

This project was created using the following technologies.

####  Frontend 

- [React js ](https://www.npmjs.com/package/react) - JavaScript library that is used for building user interfaces specifically for single-page applications
- [React Hooks  ](https://reactjs.org/docs/hooks-intro.html) - For managing and centralizing application state
- [react-router-dom](https://www.npmjs.com/package/react-router-dom) - To handle routing
- [axios](https://www.npmjs.com/package/axios) - For making Api calls
- [Css](https://developer.mozilla.org/en-US/docs/Web/CSS) - For User Interface
- [CK-Editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html) - Rich Text Editor 
- [uuid](https://www.npmjs.com/package/uuid) - For random id generator
- [React icons](https://react-icons.github.io/react-icons/) -
 Small library that helps you add icons  to your react apps.


####  Backend 


- [Node js](https://nodejs.org/en/) -A runtime environment to help build fast server applications using JS
- [Express js](https://www.npmjs.com/package/express) -The server for handling and routing HTTP requests
- [Mongoose  ](https://reactjs.org/docs/hooks-intro.html) - For modeling and mapping MongoDB data to JavaScript
- [express-async-handler](https://react-icons.github.io/react-icons/) - Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers 
- [jsonwebtoken  ](https://reactjs.org/docs/hooks-intro.html) - For authentication
- [bcryptjs](https://www.npmjs.com/package/react-router-dom) - For data encryption
- [Nodemailer](https://www.npmjs.com/package/axios) - Send e-mails from Node.js
- [dotenv](https://developer.mozilla.org/en-US/docs/Web/CSS) - Zero Dependency module that loads environment variables
- [multer](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html) - Node.js middleware for uploading files 
- [slugify](https://www.npmjs.com/package/uuid) - For encoding titles into a URL-friendly format
- [cors](https://www.npmjs.com/package/uuid) - Provides a Connect/Express middleware


####  Database 

 - [MongoDB ](https://www.npmjs.com/package/uuid)
 
