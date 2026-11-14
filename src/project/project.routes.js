const router = require('express').Router();
const { auth } = require('../auth/middleware/authMiddleware');
const { createProject } = require('./project.controller');

router.use(auth);

router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;