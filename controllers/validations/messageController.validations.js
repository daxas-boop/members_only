const { body } = require('express-validator');

exports.validateNewMessagePost = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 35 })
    .withMessage('The title must have between 1 and 35 characters')
    .escape(),
  body('body')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('The body must have between 1 and 500 characters')
    .escape(),
];

exports.validateEditMessagePost = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 35 })
    .withMessage('The title must have between 1 and 35 characters')
    .escape(),
  body('body')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('The body must have between 1 and 500 characters')
    .escape(),
];
