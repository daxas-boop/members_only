const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/user');
const {
  validateSignup,
  validateLoginPost,
  validateBecomeAdminPost,
  validateBecomeMemberPost,
} = require('./validations/userController.validations');

exports.signupGet = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('signup');
};

exports.signupPost = [
  validateSignup,
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        const newUser = new User({
          first_name: req.body.firstname,
          last_name: req.body.lastname,
          username: req.body.username,
          password: hashedPassword,
        });

        newUser.save((error) => {
          if (error) {
            return next(error);
          }
        });

        res.redirect('/login');
      });
    } else {
      res.render('signup', {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        errors: errors.array({ onlyFirstError: true }),
      });
    }
  },
];

exports.loginGet = (req, res) => {
  res.render('login', {
    user: req.user ? req.user.toJSON() : null,
    error: req.flash('error'),
  });
};

exports.loginPost = [
  validateLoginPost,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('login', {
        username: req.body.username,
        errors: errors.array(),
      });
    }
    next();
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login',
    failureFlash: true,
  }),
];

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
  });
  res.redirect('/');
};

exports.becomeMemberGet = (req, res) => {
  res.render('member_form', {
    user: req.user.toJSON(),
  });
};

exports.becomeMemberPost = [
  validateBecomeMemberPost,
  (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      User.findByIdAndUpdate(
        req.body.userid,
        { membership_status: 'member' },
        {},
        (err) => {
          if (err) {
            return next(err);
          }
          req.flash('status', 'You are now a member !!!');
          res.redirect('/');
        }
      );
    } else {
      res.render('member_form', {
        user: req.user.toJSON(),
        solution: req.body.solution,
        errors: errors.array({ onlyFirstError: true }),
      });
    }
  },
];

exports.becomeAdminGet = (req, res) => {
  res.render('admin_form', {
    user: req.user.toJSON(),
  });
};

exports.becomeAdminPost = [
  validateBecomeAdminPost,
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      User.findByIdAndUpdate(
        req.body.userid,
        { membership_status: 'admin' },
        {},
        (err) => {
          if (err) {
            return next(err);
          }
          req.flash('status', 'You are now an admin!!!');
          res.redirect('/');
        }
      );
    } else {
      res.render('admin_form', {
        user: req.user.toJSON(),
        solution: req.body.solution,
        errors: errors.array({ onlyFirstError: true }),
      });
    }
  },
];
