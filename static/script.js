var allTasks = []
var taskObj = {}
var task = document.getElementById('newTask')
var tasksToDo = document.getElementById('tasks')
var tasksDone = document.getElementById('doneTasks')
var openTasks = document.getElementById('openTasks')
var closedTasks = document.getElementById('closedTasks')

window.addEventListener('load', () => {
  fetch('http://localhost:3000/tasks/')
    .then(response => {
      return response.json()
    })
    .then(tasks => {
      allTasks = tasks
    })
    .then(() => {
      displayTasks()
      task.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
          if (/[\w]+/.exec(task.value) === null) {
            return
          }
          var data = {
            'descr': task.value,
            'category': 'Open'
          }
          var myInit = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }

          fetch('http://localhost:3000/tasks', myInit)
            .then(() => {
              return fetch('http://localhost:3000/tasks')
            })
            .then(response => {
              return response.json()
            })
            .then(tasks => {
              allTasks = tasks
              displayTasks()
              task.value = ''
            })
        }
      })
    })
})

function displayTasks () {
  openTasks.remove()
  openTasks = createCustomElement('div', null, 'openTasks')
  tasksToDo.appendChild(openTasks)

  closedTasks.remove()
  closedTasks = createCustomElement('div', null, 'closedTasks')
  tasksDone.appendChild(closedTasks)

  for (let i = 0; i < allTasks.length; i++) {
    let taskDiv = createNewTaskDiv(allTasks[i])
    taskDiv['className'] === 'Open'
      ? openTasks.appendChild(taskDiv)
      : closedTasks.appendChild(taskDiv)
  }
}

function createNewTaskObj (desc, category, note, dueDate, priority) {
  return {
    1: desc,
    2: category,
    3: note,
    4: dueDate,
    5: priority
  }
}

function createNewTaskDiv (task) {
  let newDiv = document.createElement('div')
  newDiv['id'] = task[0]
  newDiv['className'] = task[2]
  let taskItems = []

  var newTaskItem = createCustomElement(
    'input',
    'checkbox',
    'taskCheck',
    task[1]
  )
  taskItems.push(newTaskItem)

  newTaskItem.addEventListener('click', () => {
    newTaskItem.parentNode['className'] =
      newTaskItem.parentNode['className'] === 'Open' ? 'Closed' : 'Open'
    updateStorage(newDiv)
  })

  var newTask = createCustomElement('p', null, null, null, task[1])
  taskItems.push(newTask)

  newTask.addEventListener('click', () => {
    let x = prompt('Edit task:')
    if (x !== '' && x !== null) {
      newTask.textContent = x
      updateStorage(newDiv)
    }
  })

  var optionButton = createCustomElement(
    'button',
    'button',
    'options',
    null,
    '^'
  )
  taskItems.push(optionButton)

  var optionDiv = document.createElement('div')
  let options = []

  var noteLabel = createCustomLabel('Notes', 'note', 'notePointer')
  options.push(noteLabel)

  var taskNote = createCustomElement(
    'textarea',
    null,
    'note',
    null,
    task[3]
  )
  options.push(taskNote)
  // taskNote.addEventListener('change', updateStorage(newDiv))

  var dueDateLabel = createCustomLabel(
    'Due Date',
    'taskDueBy',
    'dueDatePointer'
  )
  options.push(dueDateLabel)

  var dueDate = createCustomElement(
    'input',
    'date',
    'taskDueBy',
    task[4]
  )
  options.push(dueDate)

  var priorityLabel = createCustomLabel(
    'Priority',
    'Priority',
    'priorityPointer'
  )
  options.push(priorityLabel)

  var prioritySelect = createCustomElement(
    'select',
    null,
    'Priority',
    task[5]
  )
  options.push(prioritySelect)

  var lowPriorOption = createCustomElement('option', null, null, null, 'Low')
  var medPriorOption = createCustomElement('option', null, null, null, 'Medium')
  var highPriorOption = createCustomElement('option', null, null, null, 'High')
  prioritySelect.appendChild(lowPriorOption)
  prioritySelect.appendChild(medPriorOption)
  prioritySelect.appendChild(highPriorOption)

  var saveButton = createCustomElement(
    'button',
    'button',
    'delete',
    null,
    'Save'
  )
  options.push(saveButton)

  saveButton.addEventListener('click', () => {
    updateStorage(newDiv)
  })

  options.forEach(i => optionDiv.appendChild(i))
  optionDiv.hidden = true
  taskItems.push(optionDiv)

  optionButton.addEventListener('click', () => {
    optionDiv.hidden = !optionDiv.hidden
    optionDiv.id = optionDiv.id === 'moreOptions' ? '' : 'moreOptions'
  })

  var deleteButton = createCustomElement(
    'button',
    'button',
    'delete',
    null,
    'X'
  )
  taskItems.push(deleteButton)

  deleteButton.addEventListener('click', () => {
    newDiv.remove()
    updateStorage(newDiv, 'delete')
  })

  taskItems.forEach(i => newDiv.appendChild(i))

  return newDiv
}

function updateStorage (taskDiv, option) {
  console.log(taskDiv)
  let taskID = taskDiv.id
  let taskElements = taskDiv.childNodes
  let optionElements = taskElements[3].childNodes
  if (option === 'delete') {
    let myInit = {
      method: 'DELETE'
    }
    fetch('http://localhost:3000/tasks/' + taskID, myInit)
      .then(() => {
        return fetch('http://localhost:3000/tasks')
      })
      .then(result => {
        return result.json()
      })
      .then(tasks => {
        allTasks = tasks
      })
  } else {
    let data = {
      'descr': taskElements[1].textContent,
      'category': taskDiv.className
    }
    if (optionElements[1].value) data['notes'] = optionElements[1].value
    if (optionElements[3].value) data['dueDate'] = optionElements[3].value
    if (optionElements[5].value) data['priority'] = optionElements[5].value
    let myInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    fetch('http://localhost:3000/tasks/' + taskID, myInit)
      .then(() => {
        return fetch('http://localhost:3000/tasks/')
      })
      .then(response => {
        return response.json()
      })
      .then(tasks => {
        allTasks = tasks
        displayTasks()
      })
  }
}

function createCustomElement (ele, type, id, value, textContent) {
  var element = document.createElement(ele)
  if (type) element.type = type
  if (value) element.value = value
  if (textContent) element.textContent = textContent
  if (id) element.id = id
  return element
}

function createCustomLabel (textContent, ele, id) {
  var label = document.createElement('label')
  label.textContent = textContent
  label.htmlFor = ele
  if (id) label.id = id
  return label
}
