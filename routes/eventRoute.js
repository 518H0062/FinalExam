var express = require("express");
var mongoose = require("mongoose");
var Feed = require("../models/Feed");
var Events = require("../models/EventPost");

var eventRouter = express.Router();

eventRouter
    .route("/newEvent")
    .post((req, res)=>{
        
    })