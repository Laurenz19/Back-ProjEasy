const Task = require('../models/task');
const User = require('../models/user');
const db = require('../utils/database');

/**
 * Create a new task
 */
exports.createTask = async (req, res) => {
    try {
        const { name, description, status, Pid_person } = req.body;

        const task = await Task.create(req.body);

        const createdTask = await Task.findOne({
            where: { id: task.id },
            include: [{
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'lastname', 'email']
            }],
            attributes: {
                exclude: ['Pid_person'] 
            }
        });

        res.status(201).json(createdTask );
    } catch (error) {
        res.status(500).json(error);
    }
};

/**
 * Update an existing task
 */
exports.updateTask = async (req, res) => {
    try {
        const [updated] = await Task.update(req.body, {
            where: { id: req.params.id }
        });
        
        if (updated) {
            const updatedTask = await Task.findByPk(req.params.id, {
                include: [{
                    model: User,
                    as: 'owner', 
                    attributes: ['id', 'name', 'lastname', 'email'] 
                }],
                attributes: {
                    exclude: ['Pid_person']
                }
            });

            res.status(200).json(updatedTask);
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

/**
 * Delete a task
 */
exports.deleteTask = async (req, res) => {
    try {
        const deleted = await Task.destroy({
            where: { id: req.params.id }
        });
        
        if (deleted) {
            res.status(204).json({ message: "Task deleted" });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

/**
 * Get a single task
 */
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

/**
 * Get all tasks
 */
exports.getAllTasks = async (req, res) => {
    try {
       const tasks = await Task.findAll({
            include: [{
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'lastname', 'email']
            }],
            attributes: {
                exclude: ['Pid_person']
            }
        })
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getTasksBoardData = async(req, res) => {
    try {
       const tasksBoard = [
            { 
                "title": "To do",
                "showInput": false,
                "newTaskTitle": "", 
                "tasks": []
            },
            { 
                "title": "In progress",
                "showInput": false,
                "newTaskTitle": "", 
                "tasks": []
            },
            { 
                "title": "Done",
                "newTaskTitle": "",
                "showInput": false, 
                "tasks": []
            }
        ]

       const tasks = await Task.findAll({
            include: [{
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'lastname', 'email']
            }],
            attributes: {
                exclude: ['Pid_person']
            }
        })

       tasks.forEach(task => {
            const column = tasksBoard.find(board => board.title.toLowerCase() === task.status.toLowerCase());
            if (column) {
                column.tasks.push(task);
            }
        });

        res.status(200).json(tasksBoard);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.getUserTasksBoardData = async(req, res) => {
    try {
       const tasksBoard = [
            { 
                "title": "To do",
                "showInput": false,
                "newTaskTitle": "", 
                "tasks": []
            },
            { 
                "title": "In progress",
                "showInput": false,
                "newTaskTitle": "", 
                "tasks": []
            },
            { 
                "title": "Done",
                "newTaskTitle": "",
                "showInput": false, 
                "tasks": []
            }
        ]

       const tasks = await Task.findAll({
            where: { Pid_person: req.params.user_id },
            include: [{
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'lastname', 'email']
            }],
            attributes: {
                exclude: ['Pid_person']
            }
        })

       tasks.forEach(task => {
            const column = tasksBoard.find(board => board.title.toLowerCase() === task.status.toLowerCase());
            if (column) {
                column.tasks.push(task);
            }
        });
       
        res.status(200).json(tasksBoard);
    } catch (error) {
        res.status(500).json(error);
    }
}
