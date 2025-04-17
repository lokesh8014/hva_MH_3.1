const Task = require('../models/taskModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Creating Task
exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;
        
        const newTask = new Task({ title, description, userId });
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
};

// Geting Tasks and user data for User Dashboard
exports.getUserTasks = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('name email');

        const tasks = await Task.find({ userId });

        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            },
            tasks: tasks
        });

    } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        res.status(500).json({ message: 'Error retrieving user dashboard info', error });
    }
};

// Get All Tasks for Admin Dashboard
exports.getAllTasks = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Fetching tasks 
        const tasks = await Task.find().populate('userId', 'name email');

        // Grouping tasks by user
        const groupedTasks = {};

        tasks.forEach(task => {
            const userId = task.userId._id;
            if (!groupedTasks[userId]) {
                groupedTasks[userId] = {
                    userId,
                    name: task.userId.name,
                    email: task.userId.email,
                    tasks: []
                };
            }

            groupedTasks[userId].tasks.push({
                id: task._id,
                title: task.title,
                description: task.description
            });
        });

        // Converting object to array
        const result = Object.values(groupedTasks);

        res.status(200).json({ users: result });

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks', error });
    }
};