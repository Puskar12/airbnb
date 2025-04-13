exports.pageNotFound = (req, res, next)=>{
  res.status(404).render('404',{titleName:'404' , checkTitle : '404',isLoggedIn :req.isLoggedIn, user : req.user})
}