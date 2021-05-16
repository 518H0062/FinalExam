var express = require("express");
var mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const bcrypt = require("bcryptjs");

// var Feed = require("../models/Feed");
// var News = require("../models/NewsPost");
// var Events = require("../models/EventPost");
// var Comment = require("../models/Comment");
// var moment = require("moment-timezone");

const User = require("../models/Users");

var changePassRouter = express.Router();

changePassRouter
  .route("/changePassword")
  .post((req, res) => {

    User.findById(req.body.userId, function (err, user) {
      if (err) res.send(err); ''

      bcrypt.compare(req.body.password, user.password).then(function (result) {
        if (!result) { res.json({ message: "Nhập sai mật khẩu cũ!" }) }
        else {
          bcrypt.genSalt(10, function (err, salt2) {
            bcrypt.hash(req.body.password2, salt2, function (err, hash2) {
              user.password = hash2;

              user.save(function (err) {
                if (err) res.send(err);
                console.log('done');
                res.json({ message: "Đổi Password thành công" });
              });
            });
          });
        }
      });
      
    });
  });

module.exports = changePassRouter;
