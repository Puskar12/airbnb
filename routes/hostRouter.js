const express = require('express');
const hostRouter = express.Router();

const home = require('../controller/host')

hostRouter.get("/edit-home", home.getAddHome)
hostRouter.post("/add-home", home.postAddHome)
hostRouter.get("/host-home-list", home.getHostHomes)
hostRouter.get("/edit-home/:homeId",home.getEditHome )
hostRouter.post("/edit-home", home.postEditHome)
hostRouter.post("/delete-home/:homeId", home.postDeleteHome)

exports.hostRouter = hostRouter;
