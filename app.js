//jshint esversion:6
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
mongoose.connect("mongodb://localhost:27017/userDB",
{
    useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//const secret = "Thisisourlittlesecret."

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("user", userSchema);


app.get("/", function(req, res) {
    res.render('home.ejs');
});
app.get("/login", function(req, res) {
    res.render('login.ejs');
});
app.get("/register", function(req, res) {
    res.render('register.ejs');
});

app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err, result){
        if (!err) res.render('secrets.ejs')
        else res.send(err);
    });
});

app.post('/login', function(req, res){
    const userName = req.body.username;
    const Password = req.body.password;
    User.findOne({
        email: userName,
    }, function(err, foundUser){
        if (err) res.send(err);
        else{
            if (foundUser) {
                if (foundUser.password === Password) {
                    res.render("secrets.ejs");
                }
                else {
                    res.send("Wrong password");
                    
                }
            }
            else res.send("No user");
        } 
        
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});