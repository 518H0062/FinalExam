const mongoose = require("mongoose");

const { Schema } = mongoose;

const newsSchema = new Schema({
  author: String,
  user_id: String,
  authorAvatar: String,
  title: String,
  postDate: String,
  delta: Object,
  preview: String,
  comments: Array
});

module.exports = mongoose.model("news", newsSchema);