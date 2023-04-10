const { body } = require('express-validator');
const User = require('../../models/user');

exports.validateSignup = [
  body('firstname')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a name.')
    .isAlphanumeric()
    .withMessage('Enter only alphanumeric charaters on the name')
    .escape(),
  body('lastname')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a last name.')
    .isAlphanumeric()
    .withMessage('Enter only alphanumeric caraters on the last name.')
    .escape(),
  body('username')
    .trim()
    .isLength({ min: 5 })
    .withMessage('The username must have at least 5 characters.')
    .isAlphanumeric()
    .withMessage('Enter only alphanumeric characters on the username.')
    .custom(async (value) => {
      const userCheck = await User.findOne({ username: value });
      if (userCheck !== null) {
        return Promise.reject();
      }
      return Promise.resolve();
    })
    .withMessage('Username already in use.')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('The password must have at least 6 characters.')
    .isAlphanumeric()
    .withMessage('Enter only alphanumeric characters on the password.')
    .escape(),
  body('confirm-password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a confirm password.')
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation is incorrect');
      } else {
        return true;
      }
    }),
];

exports.validateLoginPost = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a username')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a password')
    .escape(),
];

exports.validateBecomeAdminPost = [
  body('solution-1')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a solution to the first problem.')
    .custom((value) => {
      if (value === 'undefined') {
        return true;
      }
      throw new Error('The first problem is wrong.');
    })
    .escape(),
  body('solution-2')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a solution to the second problem.')
    .custom((value) => {
      if (value === 'Two') {
        return true;
      }
      throw new Error('The second problem is wrong.');
    })
    .escape(),
];

exports.validateBecomeMemberPost = [
  body('solution-1')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a solution to the first problem.')
    .custom((value) => {
      if (value === 'undefined') {
        return true;
      }
      throw new Error('The first problem is wrong.');
    })
    .escape(),
  body('solution-2')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Enter a solution to the second problem.')
    .custom((value) => {
      if (value === 'Two') {
        return true;
      }
      throw new Error('The second problem is wrong.');
    })
    .escape(),
];
