var express = require("express");
var mongoose = require("mongoose");
var Alert = require("../models/Alerts");
var moment = require("moment-timezone");

var alertRouter = express.Router();

alertRouter
//skip is a parameter used to designate the limit of the search
  .route("/main-alert/:skip")
  //retrieve all feeds from the database
  .get( (req, res) => {
    let queryLimit = 5;
    let skip = Number(req.params.skip);
    //looks at our feed Schema
    Alert.find().
    limit(queryLimit).
    skip(skip).
    sort({_id: -1})
    .exec(function(err, alert) {
      if (err) res.send(err);
      //responds with a json object of our database feeds.
      res.json(alert);
    });
  });

alertRouter
  .route("/new-alert/")
  .post( (req, res) =>{
      var alert = new Alert();
      alert.type = req.body.type;
      alert.content = req.body.content;
      alert.postDate = moment().tz("America/New_York").format('ddd, Do MMM YYYY hh:mm a');
      alert.save((err) => {
          if(err)
              res.send(err);
          res.json({message: 'alert item successfully posted'});
      });
  });

  module.exports = alertRouter;