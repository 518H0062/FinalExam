const mongoose = require("mongoose");

const { Schema } = mongoose;

const classTemplateSchema = new Schema({
  type: String,
  level: Number,
  subject: String,
  description: String
  });

module.exports = mongoose.model("classTemplate", classTemplateSchema);