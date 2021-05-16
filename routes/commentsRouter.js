var express = require("express");
var mongoose = require("mongoose");
var Comment = require("../models/Comment");

var comments = express.Router();

comments.route("/get-comments/:feed_id").get((req, res) => {
  Comment.find({ feedItem_id: req.params.feed_id })
    .sort({ _id: -1 })
    .exec((err, comments) => {
      if (err) console.log(err);
      res.send(comments);
    });
});

comments.route("/get-comment-number/:feed_id").get((req, res) => {
  Comment.find({ feedItem_id: req.params.feed_id })
    .sort({ _id: -1 })
    .exec((err, comments) => {
      if (err) console.log(err);
      res.send({total_comments: comments.length});
    });
});

comments.route("/get-comments/:feed_id/:skip").get((req, res) => {
  let query = 5;
  let skip = Number(req.params.skip);
  Comment.find({ feedItem_id: req.params.feed_id })
    .limit(query)
    .skip(skip)
    .sort({ _id: 1 })
    .exec((err, comments) => {
      if (err) console.log(err);
      res.send(comments);
    });
});

comments.route("/new-comment/:feed_id").post((req, res) => {
  let comment = new Comment();
  comment.key = req.body.key;
  comment.feedItem_id = req.params.feed_id;
  comment.user_name = req.body.user_name;
  comment.user_avatar = req.body.user_avatar;
  comment.content = req.body.content;
  comment.postDate = req.body.postDate;
  comment.save(err => {
    if (err) console.log(err);
    res.json({ message: "Comment Posted" });
  });
});

module.exports = comments;
