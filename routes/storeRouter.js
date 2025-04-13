const path = require('path')

const express = require('express');
const storeRouter = express.Router();


const home = require('../controller/store');

// storeRouter.use((req, res, next)=>{
//   console.log(req.url, req.method);
//   next();
// })

storeRouter.get("/", home.getHome);
storeRouter.get("/bookings", home.getBookings);
storeRouter.get("/favourites", home.getFavourites);
storeRouter.post("/favourites", home.postFavourites);
storeRouter.post("/favourites/delete-home/:homeId", home.postDeleteFavourites);
storeRouter.get("/homes", home.getHomeList);
storeRouter.get("/homes/:homeId", home.getHomeDetails);

exports.storeRouter = storeRouter;