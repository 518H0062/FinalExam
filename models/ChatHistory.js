const mongoose = require("mongoose");

const { Schema } = mongoose;

const ChatHistory = new Schema({
  chat_id: String,
  user_id: String,
  user_name: String,
  key: String,
  message: String,
  date: String
});

module.exports = mongoose.model("chat-history", ChatHistory);