const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middlewares/authenticationMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const Task = require('../models/taskModel'); 
const authorizeRole = roleMiddleware.authorizeRole;




// Task Routes
router.post('/tasks', authenticate, taskController.createTask);
router.get('/user/dashboard', authenticate, authorizeRole('user'), taskController.getUserTasks);
router.get('/admin/dashboard', authenticate, authorizeRole('admin'), taskController.getAllTasks);
router.get('/dashboard', authenticateAdmin, async (req, res) => {
    try {
      const users = await User.find().select('-password');
      const usersWithTasks = await Promise.all(users.map(async user => {
        const tasks = await Task.find({ userId: user._id });
        return { ...user.toObject(), tasks };
      }));
      res.status(200).json({ users: usersWithTasks });
    } catch (err) {
      console.error("Admin dashboard error:", err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
router.delete('/tasks/:id', authenticate, async (req, res) => { 
    const taskId = req.params.id;
    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
