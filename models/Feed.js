const mongoose = require("mongoose");

const { Schema } = mongoose;

const feedSchema = new Schema({
  type: String,
  feedItem: Object
});

module.exports = mongoose.model("feed", feedSchema);