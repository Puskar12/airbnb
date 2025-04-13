
const User = require('../models/user')
const Home = require('../models/home')

exports.getHome = (req, res, next)=>{
  console.log("Value of session in airbnb :", req.session)
    Home.find().then(registeredHomes => {
    res.render('store/index', {registeredHomes: registeredHomes, titleName:'airbnb', checkTitle:'index' ,isLoggedIn :req.isLoggedIn, user:req.user})
  })
  }

exports.getHomeList = (req, res, next)=>{
    Home.find().then(registeredHomes => {
    res.render('store/home-list', {registeredHomes: registeredHomes, titleName:'Home List', checkTitle:'homesList',isLoggedIn :req.isLoggedIn, user:req.user})
  })
  } 

  exports.getFavourites = async (req, res, next) => {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('favourites');
    res.render("store/favourites-list", {
      favouritesHomes: user.favourites,
      titleName: "My Favourites",
      checkTitle: "favourites",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  };

  exports.postDeleteFavourites = async (req, res, next)=>{
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (user.favourites.includes(homeId)) {
      user.favourites = user.favourites.filter(fav => fav != homeId);
      await user.save();
    }
    res.redirect("/favourites");
  }
  

  exports.postFavourites = async(req, res, next)=>{
    const homeId = req.body.id;
    const userId = req.session.user._id
     const user = await User.findById(userId)
    if (!user.favourites.includes(homeId)){
      user.favourites.push(homeId);
      await user.save()
      res.redirect("/favourites")
    } else {
    console.log("already added")
    res.redirect("/favourites")
   }
  }

  exports.getHomeDetails = (req, res, next)=>{
    const homeId = req.params.homeId;
    Home.findById(homeId).then(home=>{
      if(!home){
        console.log("Home not found")
        res.redirect("/homes")
      } else{
      res.render('store/home-detail', {home : home, titleName:'Home Details', checkTitle:'homesList',isLoggedIn :req.isLoggedIn, user:req.user})
      }
    })
  }

  exports.getBookings = (req, res, next)=>{
    res.render('store/bookings', {titleName : 'My Booking', checkTitle: 'bookings',isLoggedIn :req.isLoggedIn, user:req.user})
  }