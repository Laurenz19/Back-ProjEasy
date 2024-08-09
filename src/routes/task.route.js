const { Router } = require('express');
const taskController = require('../controllers/task.controller');
const { authenticateToken } = require('../middleware/authentication'); // Ensure you have this middleware for authentication
const router = Router();

router.get('/', authenticateToken, taskController.getAllTasks);
router.get('/board', authenticateToken, taskController.getTasksBoardData);
router.get('/board/:user_id', authenticateToken, taskController.getUserTasksBoardData);
router.get('/:id', authenticateToken, taskController.getTask);
router.post('/', authenticateToken, taskController.createTask);
router.patch('/:id', authenticateToken, taskController.updateTask);
router.delete('/:id', authenticateToken, taskController.deleteTask);

module.exports = router;
