
const { req, res } = require('express');
const express = require('express')
const router = express.Router();

//mongodb user model
const User = require('./../models/User')

//password handler
const bcrypt = require('bcryptjs')
//signup
router.post('/signup',(req, res) => {
  //getting input from req body 
  let{firstName, lastName,national_ID, email,password} = req.body;


  //we trim spaces from the input
  firstName = firstName.trim();
  lastName = lastName.trim();
  national_ID = national_ID.trim();
  email= email.trim();
  password = password.trim();
  
  

  if(firstName==""|| lastName==""|| national_ID==""|| email==""||password=="" ){
    res.json({ //JSON OBJECT
      status: "FAILED",
      message: "empty input fields"
    })
    
  }
  else if(!/^[a-zA-Z ]+$/.test(firstName || lastName)){
    res.json({
      status: "FAILED",
      message: "Invalid name entered"
    })
  }
 
  else if(national_ID.length < 12){
    res.json({
      status: "FAILED",
      message: "Identification number too short"
    })
  }
  else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
    res.json({
      status: "FAILED",
      message:"Invalid email address"
    })
  }
  else if(password.length < 8){
    res.json({
      status: "FAILED",
      message: "Password length too short"
    })
  }
  
  else{
    //checking if user already exists
    User.find({email}).then(result =>{
      if(result.length){
        //user already exists
        res.json({
          status:"FAILED",
          message:"User with the provided email already exists"
        })
      }
      else{
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds).then(hashedPassword => {
          const newUser = new User({
            firstName,lastName,national_ID,email,password: hashedPassword
          });

          newUser.save().then(result => {
            res.json({
              status:"Success",
              message:"Signup successful",
              data: result,
            })
          })
          .catch(err => {
             res.json({
              status: "FAILED",
              message:"An error occurred while saving user account"
             })
          })
        })
        .catch( err => {
          res.json({
            status: "FAILED",
            message:"An error occurred while hashing password"
          })
        })
      }
    }).catch(err => {
      console.log(err);
      res.json({
        status:"FAILED",
        message: "An error occured while checking for existing user!"
      })
    })
  }
})


//SIGNIN
router.post('/signin',(req, res) => {
  let {email,password} = req.body;

  email = email.trim();
  password = password.trim();

  if(email==""||password=="" ){
    res.json({
      status: "FAILED",
      message: "empty input fields"
    }) 
  }

  else{
    //checking if user already exists
    User.find({email}).then(data => {

      if(data.length){
        const hashedPassword = data[0].password
        bcrypt.compare(password, hashedPassword).then(result => {
          //if passwords match
          if(result){
            res.json({
              status: "SUCCESS",
              message: "Signed in Successfully",
              data: data,
            })
          }
          else{
            res.json({
              status:"FAILED",
              message: "Invalid password entered",
            })
          }
          })
            .catch(err => {
              res.json({
                status: "FAILED",
                message:"Error occured while comparing passwords"
              })
            })
            
        }
        else{
          res.json({
            status: "FAILED",
            message:"Invalid credentials entered"
          })
        }
      })
      .catch(err => {
        res.json({
          status: "FAILED",
          message:"Error occured while checking if user exists"
        })
      })
  }
})

module.exports = router;