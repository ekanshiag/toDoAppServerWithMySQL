const mysqlx = require('@mysql/xdevapi')

const config = {
  password: 'sql123',
  user: 'root',
  host: 'localhost',
  port: 33060
}

const connection = {}

mysqlx
  .getSession(config)
  .then(session => {
    connection.session = session
    return session.sql('CREATE DATABASE IF NOT EXISTS task_db')
      .execute()
  })
  .then(() => {
    connection.schema = connection.session.getSchema('task_db')
    return connection.session
      .sql('CREATE TABLE IF NOT EXISTS task_db.tasks (_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, descr VARCHAR(255), category ENUM("Open", "Closed"), notes VARCHAR(255), dueDate VARCHAR(255), priority ENUM("Low", "Medium", "High"))')
      .execute()
  })
  .catch(err => {
    console.log(err)
  })

exports.getAllTasks = (req, res, next) => {
  connection.session.sql('SELECT COUNT(*) FROM task_db.tasks')
    .execute(c => {
      let x = c.pop()
      if (x === 0) {
        res.status(200).json([])
      }
    })
  let table = connection.schema.getTable('tasks')
  let result = []
  return table.select('_id', 'descr', 'category', 'notes', 'dueDate', 'priority')
    .orderBy('_id')
    .execute(row => {
      result.push(row)
    })
    .then(() => {
      res.status(200).json(result)
    })
}

exports.postTask = (req, res, next) => {
  let fields = []
  let fieldValues = []
  for (let field in req.body) {
    fields.push(field)
    fieldValues.push(req.body[field])
  }
  let table = connection.schema.getTable('tasks')

  table.insert(fields)
    .values(fieldValues)
    .execute()
    .then(() => {
      res.status(200).json('Task created successfully')
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.updateTask = (req, res, next) => {
  const id = req.params.taskId
  res.status(200).json({
    message: 'Updating a task',
    id: id
  })
}

exports.deleteTask = (req, res, next) => {
  const id = req.params.taskId
  res.status(200).json({
    message: 'Delete a task',
    id: id
  })
}
