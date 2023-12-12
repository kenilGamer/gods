// @ts-nocheck
var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./post");
const passport = require('passport');
const localStrategy = require("passport-local")
const upload = require("./multer")
passport.use(new localStrategy(userModel.authenticate()));
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{error: req.flash('error'), nav: false})
});

router.get('/signup', function(req, res, next) {
  res.render('signup',{nav: false})
});

router.post('/file', isLoggedIn,upload.single("image"), async function(req, res, next) {
const user = await userModel.findOne({username: req.session.passport.user});
user.profileimage = req.file.filename; 
await user.save();
res.redirect("profile")
// console.log(user);
});

router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user = await 
  userModel.findOne({username: req.session.passport.user})
  .populate('posts')
  console.log(user.posts.length);
  res.render("profile",{user, nav: true})
});

router.get('/show/posts',isLoggedIn, async function(req, res, next) {
  const user = await 
  userModel.findOne({username: req.session.passport.user})
  .populate('posts')
  res.render("show",{user, nav: true})
});

router.get('/feed',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  const posts = await postModel.find()
  .populate('user')
  res.render("feed",{user,posts, nav: true})
});

router.get('/add',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate('posts')
  // console.log(user);
  res.render("add",{user, nav: true})
});

router.post('/add',isLoggedIn,upload.single("postimage"), async function(req, res, next) {
  if (!req.file){
    return res.status(400).send('no files were uploaded')
    console.error('ddd');
  }
  const user = await userModel.findOne({username: req.session.passport.user})
const post = await  postModel.create({
    image: req.file.filename, 
    imageText: req.body.filecaption,
    title: req.body.title,
    user: user._id
  })

user.posts.push(post._id)
 await user.save()
  res.redirect('profile')

});

router.post("/signup", function(req,res){
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });
  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("profile")
    })
    
  })

  });
  router.post("/login", passport.authenticate("local", {
    successRedirect:"/profile",
    failureRedirect: "/",
    failureFlash: true
  }), function(req,res){
  });
  router.get("/logout", function(req,res,next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  })
  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/");
  }
module.exports = router;
