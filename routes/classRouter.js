var express = require("express");
var mongoose = require("mongoose");
var Class = require("../models/Class");
var Users = require("../models/Users");
var ClassTemplate = require("../models/ClassTemplate");
var Profile = require("../models/Profile");

var classRouter = express.Router();
//adding the /class-list route to our /api classRouter
classRouter
  .route("/class-list")
  //retrieve all classes from the database
  .get((req, res) => {
    //looks at our feed Schema
    Class.find()
      .sort({ level: -1 })
      .exec(function(err, _class) {
        if (err) res.send(err);
        //responds with a json object of our database classes.
        res.json(_class);
      });
  });

classRouter.route("/class-list/:type").get((req, res) => {
  Class.find({type: req.params.type})
  .sort({ level: 1 })
  .exec( (err, _class) => {
    if(err) res.send(err);
    res.json(_class);
  });
});

//Finding a class based on its id
classRouter.route("/class/:class_id").get((req, res) => {
  Class.findById(req.params.class_id, function(err, _class) {
    if (err) res.send(err);
    res.json(_class);
  });
});

classRouter.route("/user_classes/:user_id").get((req, res) => {
  Users.findById(req.params.user_id, (err, user) => {
    if (err) res.send(err);
    let classes = user.classes.map(item =>{
      return mongoose.Types.ObjectId(item.class_id);
    });
    Class.find({_id:{$in:classes}}, (err, _classes) =>{
      if(err) console.log(err); 
      res.json(_classes);
    });
    //let classes = user.classes.map( item => {
    //  let x = Class.findById(item.class_id, (err, _class) => {
    //    if(err) throw(err);
    //    return _class;
    //  });
    //  return x;
    //});
    //Promise.all(classes).then(all_classes => res.json(all_classes));
  });
});

classRouter.route("/verify_user_of_class").put((req, res)=>{
  Class.findById(req.body.class_id, (err, _class)=>{
    if(err) throw err;
    let index = _class.unverifiedStudents.indexOf(req.body.user_id);
    let temp_user = _class.unverifiedStudents.splice(index, 1);
    let temp_array = _class.studentList.concat(temp_user);
    _class.studentList = temp_array;
    _class.save(err => {
      if(err) res.send(err);
      Users.findById(req.body.user_id, (err, user) => {
        let temp_class = user.classes.find(_class => {
          return _class.class_id === req.body.class_id;
        });
        let index = user.classes.indexOf(temp_class);
        user.classes.splice(index, 1);
        temp_class.verified = true;
        user.classes.push(temp_class);
        user.save(err => {
          if(err) throw err;
          Profile.findOne({user_id:req.body.user_id}, (err, profile) => {
            let class_for_profile = {type: _class.type, level: _class.level,
            subject: _class.subject, description: _class.description};
            profile.classes.push(class_for_profile);
            profile.save(err => {
              if(err) console.log(err);
            });
          });
        });
      });
      res.json({message: "Student verified!"});
    });
  });
});

//Finding a class based on its id and grab the announcements
classRouter.route("/ClassAnnouncements/:class_id").get((req, res) => {
  Class.findById(req.params.class_id, function(err, _class) {
    if (err) res.send(err);
    res.json(_class);
  });
});

classRouter.route("/ComposeClassAnnouncement/:class_id").put((req, res) => {
  Class.findById(req.params.class_id, (err, _class) => {
    if (err) res.send(err);
    _class.announcements.push(req.body);
    _class.save( err => {
      if(err) res.send(err);
      res.json({id: _class._id, message: "New Announcement Posted"});
    });
  });
});

//Finding a class based on its id and grab the content
classRouter.route("/ClassContent/:class_id").get((req, res) => {
  Class.findById(req.params.class_id, function(err, _class) {
    if (err) res.send(err);
    res.json(_class);
  });
});

classRouter.route("/ContentItem/:class_id/:date").get((req, res) => {
  Class.findById(req.params.class_id, function(err, _class) {
    if (err) res.send(err);
    let content = _class.content.find( item =>{
      return item.date == req.params.date;
    });
    res.json(content);
  });
});

classRouter.route("/ComposeClassContent/:class_id").put((req, res) => {
  Class.findById(req.params.class_id, (err, _class) => {
    if (err) res.send(err);
    _class.content.push(req.body);
    _class.save( err => {
      if(err) res.send(err);
      res.json({id: _class._id, message: "New Content Posted"});
    });
  });
});

/* This is the feed router for create class, it is responsible for
     post events that are made through the api/create-class URI */

classRouter.route("/create-class").post((req, res) => {
  var _class = new Class();
  _class.type = req.body.type;
  _class.level = req.body.level;
  _class.subject = req.body.subject;
  _class.section = req.body.section;
  _class.description = req.body.description;
  _class.teacher = req.body.teacher;
  _class.content = [];
  _class.unverifiedStudents = [];
  _class.studentList = [];
  _class.announcements = [];
  _class.save(err => {
    if (err) res.send(err);
    res.json({ id: _class._id, message: "Class Section Created" });
  });
});

//Creating a class template for the purpose of grabbing it from the admins to grab them
//from the database later on, this is a dev tool only.
classRouter.route("/create-class_template").post((req, res) => {
  console.log("IN CREATE-CLASS TEMPLATE POST");
  
  const { type, level, subject, description } = req.body;
  req.checkBody("type", "Class Type is required!").notEmpty();
  req.checkBody("level", "Class Level is required!").notEmpty();
  req.checkBody("subject", "Class Subject is required!").notEmpty();
  req
    .checkBody("description", "Class Description is required!")
    .notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.json(errors);
    console.log(errors);
  } else {
    var _class = new ClassTemplate();
    _class.type = type;
    _class.level = level;
    _class.subject = subject;
    _class.description = description;
    _class.save(err => {
      if (err) res.send(err);
      res.json("posted");
    });
  }
});

// Search for a class_template by their types
classRouter.route("/class_template/:class_type").get((req, res) => {
  ClassTemplate.find({type: req.params.class_type}, (err, _class) => {
    if (err) res.send(err);
    res.json(_class);
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
module.exports = classRouter;
