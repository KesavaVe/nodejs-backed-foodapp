const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const dotenv = require('dotenv');
const app = express();
dotenv.config();
app.use(express.json());    
app.set('view engine', 'ejs');


const checkAuth = (req, res, next) => {
    const auth = req.session.isAuthenticed;
    if(!auth){
       res.status(404).json({message : "Authentication failed"})
    }   
    next();
}
const createUser = async (req, res)=> {
    try{
        const {username, email, phone, password} = req.body;

        const alreadyUser = await User.findOne({email});
        if(alreadyUser){
            return res.render("register", {
                error: "User Alredy Resistered"
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            phone,
            password: hashPassword
        })
        await newUser.save();
         req.session.user = {
               
                username: newUser.username,
                email: newUser.email
            };
          req.session.save(() => {
                res.redirect(`${process.env.BASE_URL}/food/api/signin`);
            });
            

    }catch(err){
        console.log(err)
          return res.render("register", {
                error: "Server Error"
            });

    }
}

const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
           return res.render("signin", {
                error: "User not found"
            });
        }

        const camparePassword = await bcrypt.compare(password, user.password);
        if(!camparePassword){
            return res.render("signin", {
                error: "Invalid password"
            });
        }
           req.session.isAuthenticed = true
           req.session.user = {
                id: user._id,
                username: user.username,
                email: user.email
            };
          req.session.save(() => {
                res.redirect(`${process.env.BASE_URL}/food/dashboard`);
            });
      
        
    }catch(err){
        console.log(err)
         return res.render("signin", {
                error: "Server Error"
            });

    }

}

const logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out successfully" });
    });
};

const userLogin = async(req, res)=> {
    res.render('signin')
}
const userRegister = async(req, res)=> {
    res.render('register')
}



 module.exports = {createUser, loginUser,userLogin,userRegister,logout, checkAuth}