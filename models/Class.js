const mongoose = require("mongoose");

const { Schema } = mongoose;

const classSchema = new Schema({
  type: String,
  level: String,
  subject: String,
  section: String,
  description: String,
  teacher: String,
  content: Array,
  announcements: Array,
  unverifiedStudents: Array,
  studentList: Array
});

module.exports = mongoose.model("class", classSchema);