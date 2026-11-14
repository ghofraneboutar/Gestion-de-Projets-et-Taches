const router = require('express').Router();
const { auth, isManager } = require('../auth/middleware/authMiddleware');
const task = require('./task.controller');

router.use(auth);

router.post('/project/:projectId/task', task.createTask);
router.get('/project/:projectId/task', task.getTasksByProject);
router.get('/:id', task.getTask);
router.put('/:id', task.updateTask);
router.delete('/:id', task.deleteTask);
router.post('/:id/assign', isManager, task.assignTask);
module.exports = router;