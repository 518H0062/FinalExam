var express = require("express");
var mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID; 
var Feed = require("../models/Feed");
var News = require("../models/NewsPost");
var Events = require("../models/EventPost");
var Comment = require("../models/Comment");
var moment = require("moment-timezone");

var feedRouter = express.Router();
//adding the /feeds route to our /api feedRouter
feedRouter
//skip is a parameter used to designate the limit of the search
  .route("/main-feed/:skip")
  //retrieve all feeds from the database
  .get( (req, res) => {
    let queryLimit = 6;
    let skip = Number(req.params.skip);
    //looks at our feed Schema
    Feed.find().
    limit(queryLimit).
    skip(skip).
    sort({_id: -1})
    .exec(function(err, feed) {
      if (err) res.send(err);
      //responds with a json object of our database feeds.
      res.json(feed);
    });
  });

  feedRouter
    .route("/feed/:feed_id")
    .get( (req, res) => {
      Feed.findById(req.params.feed_id, function(err, feed){
        if(err)
          res.send(err);
        
        res.json(feed);
      });
    })
    .delete((req, res) => {
      Feed.remove({_id: req.params.feed_id}, (err, feed) => {
        if (err)
          res.send(err);
        res.json({ message: 'Feed post has been deleted' });
      });
    });

  /* This is the feed router for news posts, it is responsible for
     post and put events that are made through the api/feed/news URI */

  feedRouter
    .route("/feed/news-post")
    .post( (req, res) =>{
        var news = new News();
        news.author = req.body.author;
        news.user_id = req.body.user_id;
        news.authorAvatar = req.body.avatar;
        news.title = req.body.title;
        news.postDate = moment().tz("America/New_York").format('ddd, Do MMM YYYY hh:mm a');
        news.delta = req.body.delta;
        news.preview = req.body.preview;
        news.comments = [];

        var feed = new Feed();
        feed.type = "news";
        feed.feedItem = news;
        feed.save((err) => {
            if(err)
                res.send(err);
            res.json({message: 'news item successfully posted'});
        });
    });

    feedRouter
    .route("/feed/update-post")
    .post( (req, res) =>{
        console.log("Add api/feed/update-post ");
        var news = new News();
        news.author = req.body.author;
        news.user_id = req.body.user_id;
        news.authorAvatar = req.body.avatar;
        news.title = req.body.title;
        news.postDate = moment().tz("America/New_York").format('ddd, Do MMM YYYY hh:mm a');
        news.delta = req.body.delta;
        news.preview = req.body.preview;
        news.comments = [];

        Feed.findById(req.body.id, function(err, feed) {
          if (err) res.send(err);
          //setting the new author and text to whatever was changed. If nothing was changed
          // we will not alter the field.
          feed.feedItem = news;
          //save feed
          feed.save(function(err) {
            if (err) res.send(err);
            res.json({ message: "feed has been updated" });
          });
        });

        console.log("End api/feed/update-post ");
    });

      /* This is the feed router for event posts, it is responsible for
     post and put events that are made through the api/feed/events URI */

    feedRouter
    .route("/feed/event-post")
    .post( (req, res) => {
        var event = new Events();
        event.author = req.body.author;
        event.user_id = req.body.user_id;
        event.authorAvatar = req.body.avatar;
        event.title = req.body.title;
        event.postDate = moment().tz("America/New_York").format('ddd, Do MMM YYYY hh:mm a');
        event.delta = req.body.delta;
        event.preview = req.body.preview;
        event.comments = [];

        var feed = new Feed();
        feed.type = "event";
        feed.feedItem = event;
        feed.save((err) => {
            if(err)
                res.send(err);
            res.json({message: 'event item successfully posted'});
        });
    });
/*
















//Adding a route to a specific feed based on the database ID
feedRouter
  .route("/feed/:feed_id")
  //The put method gives us the chance to update our feed based on the ID passed to the route
  .put(function(req, res) {
    Feed.findById(req.params.feed_id, function(err, feed) {
      if (err) res.send(err);
      //setting the new author and text to whatever was changed. If nothing was changed
      // we will not alter the field.
      req.body.author ? (feed.author = req.body.author) : null;
      req.body.text ? (feed.text = req.body.text) : null;
      //save feed
      feed.save(function(err) {
        if (err) res.send(err);
        res.json({ message: "feed has been updated" });
      });
    });
  })
  //delete method for removing a feed from our database
  .delete(function(req, res) {
    //selects the feed by its ID, then removes it.
    Feed.remove({ _id: req.params.feed_id }, function(err, feed) {
      if (err) res.send(err);
      res.json({ message: "feed has been deleted" });
    });
  });
*/
  module.exports = feedRouter;
