const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
exports.getLogin = (req, res, next) =>{
  res.render('./auth/login',{titleName:'login', checkTitle:'login', isLoggedIn:false, user:req.user})
}

exports.postLogin = async (req, res, next) =>{
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user){
    return res.status(422).render('./auth/login', {
      titleName:'login', 
      checkTitle:'login', 
      isLoggedIn:false,
      errorMessage:["User Don't Exist"],
      oldInput:{email}
    })
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch){
    return res.status(422).render('./auth/login', {
      titleName:'login', 
      checkTitle:'login', 
      isLoggedIn:false,
      errorMessage:["Password is invalid"],
      oldInput:{email}
    })
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  res.redirect('/')
}

exports.postLogout = (req, res, next) =>{
  req.session.destroy(err=>{
    console.log("postlogout",err)
    res.redirect('/login')
})
}

exports.getSignup = (req, res, next) =>{
  res.render('./auth/signup',{titleName:'Signup', checkTitle:'signup', isLoggedIn:false, user:req.user  })
}

exports.postSignup = [
  check('firstName')
  .notEmpty()
  .withMessage('First name is required')
  .trim()
  .isLength({min:3})
  .withMessage('First name must be at least 3 characters long')
  .matches(/^[a-zA-Z]+$/)
  .withMessage('First name must contain only letters'),

  check('lastName')
  .trim()
  .isLength({min:3})
  .withMessage('Last name must be at least 3 characters long')
  .matches(/^[a-zA-Z]+$/)
  .withMessage('Last name must contain only letters'),

  check('email')  
  .isEmail()
  .withMessage('Email is required')
  .normalizeEmail(),

  check('password') 
  .isLength({min:6})
  .withMessage('Password must be at least 6 characters long') 
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[\W_]/)
  .withMessage('Password must contain at least one special character')
  .trim(),

  check('confirmPassword')
  .custom((value, {req})=>{
    if(value !== req.body.password){
      throw new Error('Passwords do not match')
    }
    return true
  }),

  check('userType')
  .notEmpty()
  .withMessage('User type is required')
  .isIn(['guest', 'host'])
  .withMessage('User type must be either guest or host'),

  check('terms')
  .custom((value, {req})=>{
    if(value !== 'on'){
      throw new Error('You must accept the terms and conditions')
    }
    return true
  }),
  
  (req, res, next) =>{
    const {firstName, lastName, email, password, userType} = req.body;
    console.log("postsignup",req.body)
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(422).render('./auth/signup', {
        titleName:'Signup',
        checkTitle:'signup',
        isLoggedIn:false,
        errorMessage: errorMessages,
        oldInput: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          userType: userType
        }
      });
    }
    bcrypt.hash(password, 12).then(password =>{
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        userType: userType
      });
      return user.save()
    }).then(()=>{
      console.log("User created successfully")
      res.redirect('/login')
    }).catch(err=>{
      console.log("Error creating user")
      res.status(422).render('./auth/signup', {
        titleName:'Signup',
        checkTitle:'signup',
        isLoggedIn:false,
        errorMessage: [err],
        oldInput: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          userType: userType
        }
      })
    })
}]