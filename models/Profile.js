const mongoose = require("mongoose");
const { Schema } = mongoose; // The same as 'const Schema = mongoose.Schema;'

const profileSchema = new Schema({
  user_id: String,
  displayName: String,
  name: {
    familyName: String,
    givenName: String
  },
  email: String,
  avatar: String,
  teacher: Boolean,
  teacherSubject: String,
  admin: Boolean,
  classes: Array,
  major: String,
  social_media: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedIn: String,
    gitHub: String
  },
  resume: String,
  research: Array,
  projects: Array,
  phone: String,
  address: String,
  about_me: String,
  interests: String,
  skills: String
});

module.exports = mongoose.model("user-profile", profileSchema);
