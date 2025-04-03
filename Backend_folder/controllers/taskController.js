const Task = require('../models/taskModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

// Geting Tasks for User Dashboard
exports.getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks', error });
    }
};

// Get All Tasks for Admin Dashboard
exports.getAllTasks = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const tasks = await Task.find().populate('userId', 'name email');
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks', error });
    }
};