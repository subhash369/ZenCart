var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt');
var User = require('../models/user');
router.get('/register', function (req, res) {
  res.render('register', {
    title: 'Register'
  });
});

router.post('/register', function (req, res) {
  var name = req.body.name;
  var username = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({username:"Admin"}).then(function(p)
  {
   if(p)
    p.admin=1;
  })
  User.findOne({ username: username }).then(function (existingUser) {
    if (existingUser) {
      console.log(existingUser.username);
    //   res.send("username already exists");
    } else {
      var user = new User({
        username: username,
        name: name,
        email: email,
        password: password,
        admin:0
      });

      bcrypt.genSalt(10)
        .then(function (salt) {
          return bcrypt.hash(user.password, salt);
        })
        .then(function (hash) {
          user.password = hash;
          return user.save();
        })
        .then(function () {
          res.redirect('/users/login');
        })
        .catch(function (err) {
          console.error('Error during registration:', err);
          res.send('An error occurred during registration');
        });
    }
  });
});


/*
 * GET login
 */
router.get('/login', function (req, res) {

    if (res.locals.user) res.redirect('/');
    
    res.render('login', {
        title: 'Log in'
    });

});

/*
 * POST login
 */
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    
});

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  })
module.exports = router;
