const pls = require("passport-local-mongoose")
const mongoose = require("mongoose")
mongoose.connect(process.env.mongose).then((result) => {
  console.log("Mongoose");
}).catch((err) => {
  console.log(err);
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  },
  posts: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  dp: {
    type: String, // Assuming dp is a URL or a path to an image 
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  profileimage:{
    type: String 
  },
  boards: {
    type:Array, 
    default: []
  },
  postimage: String,
}); 
userSchema.plugin(pls)
const user = mongoose.model('User', userSchema);

module.exports = user;