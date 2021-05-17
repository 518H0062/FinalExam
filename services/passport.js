const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");
const Profile = require("../models/Profile");

passport.serializeUser((user, done) => {
  console.log("Serialize user!");
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    console.log("Deserialize user!");
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        // we already have a record with the given profile ID
        done(null, existingUser);
      } else {
        //we don't have a user record with this ID, make a new record
        const user = await new User({
          googleId: profile.id,
          displayName: profile.displayName,
          name: profile.name,
          avatar: profile._json.picture,
          email: profile.emails[0].value,
          teacher: false,
          admin: false
        }).save((err, user)=>{
          let profile = new Profile();
          profile.user_id = user._id;
          profile.displayName = user.displayName;
          profile.name = user.name;
          profile.email = user.email;
          profile.avatar = user.avatar;
          profile.admin = user.admin;
          profile.teacher = user.teacher;
          profile.classes = [];
          profile.major = "";
          profile.social_media = {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedIn: "",
            gitHub: ""
          };
          profile.resume = "";
          profile.research = [];
          profile.projects = [];
          profile.phone = "";
          profile.address = "";
          profile.about_me = "";
          profile.interests = "";
          profile.skills = "";
          profile.save(err => {
            // if (err) console.log(err);
            done(null, user);
          });
        });
      }
    }
  )
);
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      let query = { email: email };
      console.log(query);
      User.findOne(query, (err, user) => {
        if (err) return done(err);
        if (!user) {
          return done(null, false, { message: "No user found" });
        }
        // Matching Password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Wrong password" });
          }
        });
      });
    }
  )
);
