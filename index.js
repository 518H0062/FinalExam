const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const expressValidator = require('express-validator');
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
require("./models/Users");
require("./models/Posts");
require("./models/Feed");
require("./models/Comment");
require("./models/Class");
require("./models/ClassTemplate");
require("./services/passport");
require("./models/ChatHistory");
require("./models/Profile");
var posts = require("./routes/postsRoutes");
var users = require("./routes/usersRoutes");
var feed = require("./routes/feedRoutes");
var comments = require("./routes/commentsRouter");
var alerts = require("./routes/alertRoutes");
var class_template = require("./routes/classRouter");
var chatHistory = require("./routes/chatRoutes");
var profile = require("./routes/profileRoutes");
var changePassword = require("./routes/changePasswordRoute");

mongoose.connect(keys.mongoURI);


// SOCKET IO SETUP //
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

/**************Applying middleware**************/
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(expressValidator());

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/***********************************************/

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  //and remove cacheing so we get the most recent comments
  res.setHeader("Cache-Control", "no-cache");
  next();
});
/*********************************************************************************************************************/

app.use("/api", posts);
app.use("/api/", users);
app.use("/api", profile);
app.use("/api", feed);
app.use("/api", comments);
app.use("/api", alerts);
app.use('/api/', class_template);
app.use('/api/', chatHistory);
app.use('/api/', changePassword);
require("./routes/localAuthRoutes")(app);
require("./routes/authRoutes")(app);

if (process.env.NODE_ENV == "production") {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static("client/build"));

  // Express serve up the index.html file
  // if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Listening to port " + PORT)
);
require("./services/socketIO")(io);

