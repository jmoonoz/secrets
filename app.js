//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// for the DB
const mongoose = require("mongoose");
// for encryption, will need to install seperate package 
var encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.API_KEY);

//to view static pages
app.use(express.static("public"));
app.set("view engine", "ejs");
// use body parser to grab txt from web pages
app.use(bodyParser.urlencoded({extended: true}));

//establish a connection to the DB
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

// mongoose schema is needed for encryption
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// this is a long 
// const secret = "thisisoursecrete";
// only encryp password, only one frield is going to be encrypted
// make sure to add the encrypted fields and state whats going to be encrypted
userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
    
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        } else {
            console.log(err);
        }
    });
});


app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else {
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                } 
            }
        }
    })

});

app.listen(3000, function(){
    console.log("listening on port 3000");
});