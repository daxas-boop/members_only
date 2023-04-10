const router = require('express').Router();
const userController = require('../controllers/userController');
const { isAuth, isViewer, isMember } = require('./authMiddleware');

router.get('/signup', userController.signupGet);
router.post('/signup', userController.signupPost);
router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);
router.get('/logout', userController.logout);
router.get('/become_member', isAuth, isViewer, userController.becomeMemberGet);
router.post(
  '/become_member',
  isAuth,
  isViewer,
  userController.becomeMemberPost
);
router.get('/become_admin', isAuth, isMember, userController.becomeAdminGet);
router.post('/become_admin', isAuth, isMember, userController.becomeAdminPost);

module.exports = router;
