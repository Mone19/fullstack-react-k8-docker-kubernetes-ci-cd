import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "https://firebasestorage.googleapis.com/v0/b/it-guru-blog.appspot.com/o/profil.jpg?alt=media&token=31b7b468-0c96-4aa0-a302-5ac662315035",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  }, {timestamps: true}
);


const User = mongoose.model("User", userSchema);

export default User;