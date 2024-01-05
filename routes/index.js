// @ts-nocheck
var express = require('express');
var router = express.Router();
const userModel = require("../models/users")
const postModel = require("../models/post");
const passport = require('passport');
const localStrategy = require("passport-local")
const upload = require("./multer")
const sendEmail = require("./email")
const jwt = require("jsonwebtoken")
passport.use(new localStrategy(userModel.authenticate()));
const {ObjectId} = require('mongodb')
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
// user.email = req.body.email;
await user.save();
res.redirect("profile")
// console.log(user);
});
router.post('/edit', isLoggedIn,upload.single("image"), async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  // user.profileimage = req.file.filename; 
  user.email = req.body.email;
  user.fullname = req.body.fullname;
  user.username = req.body.username;
  await user.save();
  res.redirect("profile")
  // console.log(user);
  }); 

  router.get('/files', isLoggedIn, async function(req, res, next) {
    const user = await 
    userModel.findOne({username: req.session.passport.user})
    res.render("files",{user, nav: true})
  });
// router.get('/profile',isLoggedIn, async function(req, res, next) {
//   const user = await 
//   userModel.findOne({username: req.session.passport.user})
//   .populate('posts')
//   console.log(user.posts.length);
//   res.render("profile",{user, nav: true})
// });

router.get('/profile', isLoggedIn , async function(req, res, next) {
  const {username} = req.user;
  // console.log(req.session.passport.user)
  const user = await userModel.findOne({username}).populate('posts');
  // console.log(user);
  res.render('profile',{user,username: user.username, fullname: user.fullname, post: user.posts,nav: true});
});

router.get('/show/posts',isLoggedIn, async function(req, res, next) {
  // const user = await 
  // userModel.findOne({username: req.session.passport.user})
  // .populate('posts')
  // res.render("show",{user, nav: true})

  const {username} = req.user;
  const user = await userModel.findOne({username}).populate('posts');
  res.render('show',{user,username: user.username, fullname: user.fullname, post: user.posts,nav: true});
});

router.post('/delete/:id',  async function(req,res){
  const itemId = req.params.id;
  // console.log('itemId', itemId);
  const itemObjId = new ObjectId(itemId);
  // console.log(itemObjId); 
  const deletedPost = await postModel.deleteOne({_id: itemObjId});
  const user = await userModel.findByUsername(req.session.passport.user).populate('posts');
  user.posts = user.posts.filter((dt) => !dt._id.equals(itemObjId));
  console.log(user);
  await user.save();
  res.redirect('/profile');
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
    user: user._id,
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

  router.post('/password-reset',isLoggedIn,async function(req, res, next) {
      const {email} = req.body;
      if(!email){
        res.status(401).json({status:401,message:"enter your Email"});
      }
      try{
          const user = await userModel.findOne({email:email});
          const token = jwt.sign({_id:userfind._id},)
      }catch(error){
        console.log(error);
      }
    }); 
    router.post('/test',async function(req, res, next) {
      const {email} = req.body;
        try{
            const transporter = nodemailer.createTransport({
                    host: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                      user: process.env.user,
                      pass: process.env.pass
                    }
            });
            const usermail = ({
                from: process.env.user,
                to: email,
                subject: 'subject',
                html: '<h1>oppdffvgbhhfkjgyr</h1>'
            })
            await transporter.sendMail(usermail,(error,info)=>{
                if(error){
                    console.log(("Error"),error);
                }else{
                    console.log("email sent" + info.response);
                    // resizeBy.status(201).json({status:201,info})
                }
            })
            console.log("opppppppppp");
        } catch (error){
            // console.log(error, "not sent email");
            // resizeBy.status(401).json({status:401,error})
        }
        const user = await userModel.findOne({username: req.session.passport.user});
        // user.profileimage = req.file.filename; 
        user.email = req.body.email;
 
    });
    router.get('/tests',isLoggedIn,async function(req, res, next) {
      const user = await 
      userModel.findOne({username: req.session.passport.user})
      // .populate('posts')
      console.log(user.user);
      res.render("text",{user, nav: true})
    });
module.exports = router;
 