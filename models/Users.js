const mongoose = require("mongoose");
const { Schema } = mongoose; // The same as 'const Schema = mongoose.Schema;'

const userSchema = new Schema({
  googleId: String,
  displayName: String,
  name: {
    familyName: String,
    givenName: String
  },
  EMPLID: String,
  email: String,
  password: String,
  avatar: String,
  teacher: Boolean,
  teacherSubject: String,
  admin: Boolean,
  classes: Array
});

module.exports = mongoose.model("users", userSchema);