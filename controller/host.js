const Home = require('../models/home')

exports.getAddHome = (req, res, next)=>{
  res.render('host/edit-home',{titleName:'Add Home', checkTitle:'addHome', editing : false, isLoggedIn :req.isLoggedIn, user:req.user})
};

exports.getEditHome = (req, res, next)=>{
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';
  Home.findById(homeId).then(home =>{
    if (!home){
      res.redirect('/host/host-home-list')
    } else{
      res.render('host/edit-home',{titleName:'Add Home', checkTitle:'hostHomeList', editing : editing, home : home, isLoggedIn :req.isLoggedIn, user:req.user})

    }
  })
};

exports.postEditHome = (req, res, next)=>{
  const {houseName, price, location, rating, photoURL, description, id} = req.body
  Home.findById(id).then(home=>{
    home.houseName=houseName;
    home.price=price;
    home.location=location;
    home.rating=rating;
    home.photoURL=photoURL;
    home.description=description;
    home.save().then(result=>{
      console.log('Home updated successfully',result)
      res.redirect('/host/host-home-list')
    });
  }).catch(err=>{
    console.log('Error while updating home', err )
  }); 
};

exports.postDeleteHome = (req, res, next)=>{
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId).then(()=>{
    console.log("Home deleted successfully");
    res.redirect('/host/host-home-list');
  }).catch((error)=>{
    console.log("Error while deleting", error)
  })
};

exports.postAddHome = (req, res, next)=>{
  const {houseName, price, location, rating, photoURL, description} = req.body
  let homeObject = new Home({houseName, price, location, rating, photoURL, description})
  homeObject.save().then(()=>{
    console.log('home saved succesfully')
  });
  res.render('host/homeAdded',{titleName:'Add Home', checkTitle:'homeAdded', isLoggedIn :req.isLoggedIn, user:req.user})
};

exports.getHostHomes = (req, res, next)=>{
  Home.find().then(registeredHomes => {
  res.render('host/host-home-list', {registeredHomes: registeredHomes, titleName:'Host Homes', checkTitle:'hostHomeList', isLoggedIn :req.isLoggedIn, user:req.user})
})
}