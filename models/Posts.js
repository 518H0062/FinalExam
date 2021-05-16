
const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  author: String,
  text: String
});

module.exports = mongoose.model("posts", postSchema);