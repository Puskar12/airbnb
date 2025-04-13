const path = require('path')

const express = require('express');
const authRouter = express.Router();
const authController = require('../controller/authController');


const home = require('../controller/store');

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.get("/signup", authController.getSignup);
authRouter.post("/signup", authController.postSignup);

exports.authRouter = authRouter;