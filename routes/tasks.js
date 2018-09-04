const express = require('express')
const router = express.Router()

const taskController = require('../controllers/tasks')

router.get('/', taskController.getAllTasks)

router.post('/', taskController.postTask)

router.patch('/:taskId', taskController.updateTask)

router.delete('/:taskId', taskController.deleteTask)

module.exports = router
