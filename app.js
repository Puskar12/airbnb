const path = require('path')

const express = require('express');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGO_URL = "mongodb+srv://pdforcoursera0318:Puskar%40123@puskardas.3kf7j.mongodb.net/airbnb?retryWrites=true&w=majority&appName=PuskarDas";

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: 'sessions'
});

const {storeRouter} = require('./routes/storeRouter')
const {hostRouter} = require('./routes/hostRouter')
const {authRouter} = require('./routes/authRouter')
const rootDir = require('./utils/utilPath')
const errors = require('./controller/errors');
const { default: mongoose } = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}))


app.use(session({
  secret:"Puskar Das",
  resave:false,
  saveUninitialized:true,
  store,
 })
 )

app.use((req,res,next)=>{
  req.isLoggedIn = req.session.isLoggedIn
  req.user = req.session.user
  next()
})
app.use("/host", (req, res , next)=>{
  if(!req.isLoggedIn){
    return res.redirect("/login")
  } else {
    next()
  }
});
app.use(storeRouter);
app.use("/host", hostRouter);
app.use(authRouter);

app.use(express.static(path.join(rootDir,'public')))

app.use(errors.pageNotFound)
  
const PORT = 3000;
mongoose.connect(MONGO_URL).then(()=>{
  console.log("Conected to mongoDB")
  app.listen(PORT, ()=>{
    console.log(`server running at http://localhost:${PORT}`);
  });
}).catch(err=>{
  console.log("Mongodb is not connected:", err);
  app.listen(PORT, ()=>{
    console.log(`server running at http://localhost:${PORT}`);
  }); 
})