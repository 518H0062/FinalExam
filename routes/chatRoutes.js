var express = require("express");
var mongoose = require("mongoose");
var Users = require("../models/Users");
var ChatHistory = require("../models/ChatHistory");

var chatRouter = express.Router();

chatRouter.route("/chat_history/:chat_id/:skip").get((req, res) => {
  let queryLimit = 20;
  let skip = Number(req.params.skip);
  ChatHistory.find({ chat_id: req.params.chat_id })
    .sort({ date: 1 })
    .limit(queryLimit)
    .skip(skip)
    .exec((err, chat) => {
      if (err) throw err;
      res.json(chat);
    });
});

module.exports = chatRouter;
