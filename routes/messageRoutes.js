const router = require('express').Router();
const messageController = require('../controllers/messageController');
const { isAuth, isAdmin, isMemberOrAdmin } = require('./authMiddleware');

router.get('/', messageController.index);
router.get('/new-message', isAuth, messageController.newMessageGet);
router.post('/new-message', isAuth, messageController.newMessagePost);
router.get(
  '/edit-message/:id',
  isAuth,
  isMemberOrAdmin,
  messageController.editMessageGet
);
router.post(
  '/edit-message/:id',
  isAuth,
  isMemberOrAdmin,
  messageController.editMessagePost
);
router.get(
  '/delete-message/:id',
  isAuth,
  isAdmin,
  messageController.deleteMessageGet
);
router.post(
  '/delete-message/:id',
  isAuth,
  isAdmin,
  messageController.deleteMessagePost
);

router.post('/pin-message', isAuth, isAdmin, messageController.pinMessagePost);

module.exports = router;
