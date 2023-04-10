const router = require('express').Router();
const messageRoutes = require('./messageRoutes');
const userRoutes = require('./userRoutes');

router.use('/', messageRoutes);
router.use('/', userRoutes);

module.exports = router;
