var express = require("express");
var mongoose = require("mongoose");
var Users = require("../models/Users");
var Classes = require("../models/Class");
var Profile = require("../models/Profile");

var router = express.Router();

router.route("/user/:user_id").get((req, res) => {
  Users.findById(req.params.user_id, (err, user)=> {
    if(err) throw err;
    res.json(user);
  });
});

router.route("/student-list/:class_id").get((req, res) => {
  Classes.findById(req.params.class_id, (err, _class)=> {
    var students = [];
    if(err) console.log(err);
    for(let i = 0; i < _class.studentList.length; i++){
      Users.findById(_class.studentList[i], (err, student) => {
        if(err) console.log(err);
        students.push(student);
        if(_class.studentList.length == students.length){
          res.json(students);
        }
      });
    }
  });
});

router
  .route("/users-list")
  //retrieve all users from the database
  .get(function(req, res) {
    console.log("IN USER LIST GET");
    //looks at our Users Schema
    Users.find(function(err, users) {
      if (err) res.send(err);
      //responds with a json object of our database users.
      res.json(users);
    });
  });

router
  .route("/teacher-list")
  //retrieve all users from the database
  .get(function(req, res) {
    //looks at our Users Schema
    Users.find({ teacher: true }, (err, users) => {
      if (err) res.send(err);
      //responds with a json object of our database users.
      res.json(users);
    });
  });
router
  .route("/teachers-only-list")
  //retrieve all users from the database
  .get(function(req, res) {
    //looks at our Users Schema
    Users.find({ teacher: true, admin: false }, (err, users) => {
      if (err) res.send(err);
      //responds with a json object of our database users.
      res.json(users);
    });
  });

router
  .route("/admin-list")
  //retrieve all users from the database
  .get(function(req, res) {
    console.log("IN TEACHER LIST GET");
    //looks at our Users Schema
    Users.find({ admin: true }, (err, users) => {
      if (err) res.send(err);
      //responds with a json object of our database users.
      res.json(users);
    });
  });

router
  .route("/teacher-list/:class_type")
  //retrieve all users from the database
  .get(function(req, res) {
    console.log("IN TEACHER LIST GET");
    //looks at our Users Schema
    Users.find({ teacher: true, teacherSubject: req.params.class_type },
      (err, users) => {
      if (err) res.send(err);
      //responds with a json object of our database users.
      res.json(users);
    });
  });
//Adding a route to a specific user based on the database ID
router
  .route("/verify-teacher/:user_id/:class_type")
  //The put method gives us the chance to update our user based on the ID passed to the route
  .put(function(req, res) {
    Users.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);
      //Setting the Users teacher flag to true
      user.teacher = true;
      user.teacherSubject = req.params.class_type;
      //Saving the user
      user.save(function(err) {
        if (err) res.send(err);
        res.json({ message: "Teacher has been verified" });
      });
    });
  });


// This route takes the user and of their submitted class and adds the classes
// to their User data object, then updates all the Classes data objects with the
// users id to the unverified student list
router.route("/add_class_to_user/:user_type").put((req, res)=>{
  Users.findById(req.body.user, (err, user)=>{
    if(err) res.send(err);
    user.classes = user.classes.concat(req.body.classes);
    user.save( err => {
      if(err) res.send(err);
      res.json({message: "Classes were added"})
    });
    
    if(req.params.user_type == "student"){
      let class_ids = user.classes.map(cls => { return cls.class_id});

      let classPromises = class_ids.map( cls =>{
        let x = Classes.findById(cls, (err, _class)=>{
          if(err) throw err;
          return _class;
        });
        return x;
      });
      Promise.all(classPromises).then(all_classes =>{
        all_classes.map(cls =>{
          if(!cls.unverifiedStudents.find(usr=> {return usr === user._id.toString()})
          && !cls.studentList.find(usr=> {return usr === user._id.toString()})
        ){
          cls.unverifiedStudents.push(user._id.toString());
          cls.save();
        }
      });
      });
    }}
  )});



module.exports = router;