const router = require('express').Router();
const { register, login, me } = require('./auth.controller');
const {auth} = require('../auth/middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;