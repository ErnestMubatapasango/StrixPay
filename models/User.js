//here we make use of mongoose to create  a model that helps us communicate with our database
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName:String,
  lastName: String,
  national_ID: String,
  email: String,
  password: String
})
const User = mongoose.model('User', UserSchema);

module.exports = User;