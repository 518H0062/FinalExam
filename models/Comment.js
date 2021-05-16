const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema({
  key: String,
  feedItem_id: String,
  user_name: String,
  user_avatar: String,
  content: String,
  postDate: String
});

module.exports = mongoose.model("comment", commentSchema);