//requiring our mongodb file that gives us access to the database
require('./config/db')
//to create our server we use express which is a library for node
const app = require('express')();
const port = process.env.PORT || 3000;

//cross site resource sharing enables us to make api calls to our backend without the requests being blocked by the frontend
const cors = require("cors")
app.use(cors)

const UserRouter = require('./api/User')
//for accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter)

app.listen(port, ()=> {
  console.log(`Server running on port ${port}`)
})