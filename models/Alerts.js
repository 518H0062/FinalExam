const mongoose = require("mongoose");

const { Schema } = mongoose;

const alertsSchema = new Schema({
  type: String,
  content: String,
  postDate: String
});

module.exports = mongoose.model("alerts", alertsSchema);