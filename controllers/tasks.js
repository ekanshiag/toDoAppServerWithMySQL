const mysql = require('mysql')
const connection = mysql.createConnection({
    host: "localhost",
    user: "myTasks",
    password: "tasks",
    database: "task_db"
})

connection.connect()

exports.getAllTasks = (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tasks'
    })
}

exports.postTask = (req, res, next) => {
    const task = {
        desc: req.body.desc,
        notes: '',
        dueDate: '',
        priority: ''
    }
    res.status(200).json({
        message: 'Handling POST requests to /tasks',
        createdTask: task
    })
}

exports.getOneTask = (req, res, next) => {
    const id = req.params.taskId
    res.status(200).json({
        message: "Accessing a id",
        id: id
    })
}

exports.updateTask = (req, res, next) => {
    const id = req.params.taskId
    res.status(200).json({
        message: "Updating a task",
        id: id
    })
}

exports.deleteTask = (req, res, next) => {
    const id = req.params.taskId
    res.status(200).json({
        message: "Delete a task",
        id: id
    })
}