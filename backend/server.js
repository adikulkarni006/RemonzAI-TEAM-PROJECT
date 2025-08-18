// server.js - Your basic server for today
const express = require('express');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
const path = require("path");
const cors = require('cors');
require('dotenv').config();

const app = express();

//models
const userModel = require("./models/user");

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(cors());

// View engine - setup
app.set("view engine", "ejs");

// ENV and constants
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "ukululelule";

// Home route
app.get('/', (req, res) => {
    res.render("index");
})

// Simple test route
app.get('/test', (req, res) => {
    console.log('🌟 Basic test route hit');
  res.json({ 
    message: '🚀 RemonzAi Backend is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Server is healthy',
    uptime: process.uptime()
  });
});


// Render signup
app.get("/signup", (req, res) => {
    res.render("signup.ejs")
})

// Signup POST handler
app.post('/signup', async (req, res) => {
  try {
    // let user = await userModel.findOne({email: req.body.email});
    let { username, email, password } = req.body;

    //check if user already exists
    const existingUser = await userModel.findOne({ email })
    if(existingUser) {
      return res.status(409).send("User with this email already exists.")
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    //create new user
    let createdUser = await userModel.create({
        username,
        email,
        password: hashedPassword,
    })
    //generate JWT token
    let token = jwt.sign({email}, JWT_SECRET , {expiresIn: "1h"});
    res.cookie("token", token, { httpOnly: true});

    res.redirect("/")
  } catch(error) {
    console.log(error);
    res.status(500).send("something went wrong during signup")
  }
})

// Render Login
app.get('/login', (req, res) => {
    res.render("login")
})

// Login POST handler
app.post("/login", async (req, res) => {
  try {
    let user = await userModel.findOne({email: req.body.email});
    //check if user exists
    if(!user)  {
      return res.send("something went wrong");
    }

    let isMatch = await bcrypt.compare(req.body.password, user.password)
        if(isMatch) {
          let token = jwt.sign({email: user.email}, JWT_SECRET , {expiresIn: "1h"});
          res.cookie("token", token, { httpOnly: true});
          res.redirect('/')
        } else {
          res.status(401).send("Invalid email or password");
        }
  } catch(error) {
    console.log(error);
    res.status(500).send("Something went wrong during login.")
  }
})

// Logout 
app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect("/")
})

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`RemonzAi Backend running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
