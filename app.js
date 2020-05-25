//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

console.log(process.env.SECRET)
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    name: String,
    password: String
})


userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
})

app.get("/register", function (req, res) {
    res.render("register");
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.post("/register", function (req, res) {
    const newUser = req.body.username;
    const newPassword = req.body.password;

    const user = new User({
        name: newUser,
        password: newPassword
    })

    user.save(function (err) {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets")
        }
    })
})

app.post("/login", function (req, res) {
    const exUser = req.body.username;
    const exPassword = req.body.password;

    User.findOne({name:exUser},function(err,foundUser){
        if(err){
            console.log(err)
        }else{
            if(foundUser){
                if(foundUser.password === exPassword){
                    res.render("secrets")
                }else{
                    console.log("Wrong Password")
                }
            }else{
                res.redirect("/register");
            }
        }
    })
})

app.get("")
app.listen(3000, function () {
    console.log("Server is running");
})