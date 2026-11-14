const router = require('express').Router();
const { auth } = require('../auth/middleware/authMiddleware');
const { createProject } = require('./project.controller');

router.use(auth);

router.post('/', createProject);

module.exports = router;