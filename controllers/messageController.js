const { validationResult } = require('express-validator');
const Message = require('../models/message');
const {
  validateNewMessagePost,
  validateEditMessagePost,
} = require('./validations/messageController.validations');

exports.index = (req, res, next) => {
  Message.find()
    .lean()
    .sort({ timestamp: -1 })
    .populate('created_by', 'username first_name last_name membership_status')
    .exec((err, messages) => {
      if (err) {
        return next(err);
      }
      messages.sort((a, b) => b.pinned - a.pinned);
      res.render('index', {
        user: req.user ? req.user.toJSON() : null,
        alerts: req.flash('status'),
        messages,
      });
    });
};

exports.newMessageGet = (req, res) => {
  res.render('message_form', {
    title: 'New message',
    user: req.user.toJSON(),
  });
};

exports.newMessagePost = [
  validateNewMessagePost,
  (req, res, next) => {
    const errors = validationResult(req);

    const newMessage = new Message({
      title: req.body.title,
      body: req.body.body,
      created_by: req.user._id,
    });

    if (errors.isEmpty()) {
      newMessage.save((err) => {
        if (err) {
          return next(err);
        }
        req.flash('status', 'You added a new message.');
        res.redirect('/');
      });
    } else {
      res.render('message_form', {
        user: req.user.toJSON(),
        message: newMessage.toJSON(),
        errors: errors.array(),
      });
    }
  },
];

exports.editMessageGet = (req, res, next) => {
  Message.findById(req.params.id, (err, message) => {
    if (err) {
      return next(err);
    }
    if (req.user.id.toString() !== message.created_by.toString()) {
      res.render('not_authorized', {
        user: req.user.toJSON(),
        message: 'You can only edit your own messages',
      });
    } else {
      res.render('message_form', {
        title: 'Edit message',
        user: req.user.toJSON(),
        message: message.toJSON(),
      });
    }
  });
};

exports.editMessagePost = [
  validateEditMessagePost,
  (req, res, next) => {
    if (req.user.id.toString() !== req.body.created_by) {
      res.render('not_authorized', {
        user: req.user.toJSON(),
        message: 'You can only edit your own messages',
      });
      return;
    }

    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      body: req.body.body,
      created_by: req.body.created_by,
      _id: req.params.id,
    });

    if (errors.isEmpty()) {
      Message.findByIdAndUpdate(
        req.params.id,
        { title: req.body.title, body: req.body.body },
        {},
        (err) => {
          if (err) {
            return next(err);
          }
          req.flash(
            'status',
            `You edited a message with title: ${req.body.title}`
          );
          res.redirect('/');
        }
      );
    } else {
      res.render('message_form', {
        message: message.toJSON(),
        errors: errors.array(),
      });
    }
  },
];

exports.deleteMessageGet = (req, res, next) => {
  Message.findById(req.params.id)
    .populate('created_by', 'username first_name last_name membership_status')
    .exec((err, message) => {
      if (err) {
        return next(err);
      }
      res.render('delete_message', {
        user: req.user.toJSON(),
        message: message.toJSON(),
      });
    });
};

exports.deleteMessagePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('not_authorized', {
      user: req.user.toJSON(),
      message: 'Nobody can delete the welcome message.',
    });
  } else {
    Message.findByIdAndRemove(req.body.messageid, (err, message) => {
      if (err) {
        return next(err);
      }
      req.flash('status', `You deleted a message with title: ${message.title}`);
      res.redirect('/');
    });
  }
};

exports.pinMessagePost = (req, res, next) => {
  Message.findById(req.body.messageid, (err, message) => {
    if (err) {
      return next(err);
    }
    // eslint-disable-next-line no-param-reassign
    message.pinned = !message.pinned;
    message.save((error) => {
      if (error) {
        return next(error);
      }
      if (message.pinned) {
        req.flash(
          'status',
          `You pinned the message with title: ${message.title}`
        );
      } else {
        req.flash(
          'status',
          `You unpinned the message with title: ${message.title}`
        );
      }
      res.redirect('/');
    });
  });
};
