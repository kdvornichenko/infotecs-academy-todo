const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const editor = document.querySelector('#editor')

let tasks = []

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach(task => renderTask(task))
}

form.addEventListener('submit', addTask)

tasksList.addEventListener('click', doneTask)

tasksList.addEventListener('click', editTask)

tasksList.addEventListener('click', deleteTask)

editor.addEventListener('click', setEditedTask)

function addTask(e) {
	e.preventDefault()

	const taskText = taskInput.value

	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	}

	tasks.push(newTask)

	saveToLocalStorage()

	renderTask(newTask)

	taskInput.value = ''
	taskInput.focus()
}

function doneTask(e) {
	if (e.target.dataset.action !== 'done') {
		return
	}

	const parentNode = e.target.closest('li')

	const id = Number(parentNode.id)
	const task = tasks.find(task => task.id === id)
	task.done = !task.done

	saveToLocalStorage()

	const taskBg = parentNode
	taskBg.classList.toggle('task__done')

	const taskBtnCheck = parentNode.querySelector('.task-btn-check')
	taskBtnCheck.classList.toggle('task-btn-check__done')

	const taskTitle = parentNode.querySelector('.task-title')
	taskTitle.classList.toggle('task-title__done')

	const taskBtnEdit = parentNode.querySelector('.task-btn-edit')
	taskBtnEdit.classList.toggle('task-btn-edit__done')
}

function editTask(e) {
	if (e.target.dataset.action !== 'edit') {
		return
	}

	const parentNode = e.target.closest('li')

	const id = Number(parentNode.id)

	const text = parentNode.querySelector('p').innerText

	const editorInput = document.querySelector('#editorInput')

	editorInput.removeAttribute('disabled')
	editorInput.focus()
	editorInput.value = text
	editorInput.dataset.id = id
	editorInput.placeholder = 'Введите изменения задачи'

	saveToLocalStorage()

	const editBtn = document.querySelector('[data-action="edited"]')

	const textarea = document.getElementsByTagName('textarea')
	for (let i = 0; i < textarea.length; i++) {
		textarea[i].setAttribute(
			'style',
			'height:' + textarea[i].scrollHeight + 'px;width:unset;'
		)
		textarea[i].addEventListener('input', onInput, false)
	}

	function onInput() {
		this.style.height = 'auto'
		this.style.height = this.scrollHeight + 'px'

		if (editorInput.value.length > 0) {
			editBtn.removeAttribute('disabled')
			editBtn.classList.remove('--disabled')
		} else {
			editBtn.setAttribute('disabled', 'true')
			editBtn.classList.add('--disabled')
		}
	}
}

function setEditedTask(e) {
	if (e.target.dataset.action !== 'edited') {
		return
	}

	e.preventDefault()

	const parentNode = document.querySelector('#editorInput')

	editorInput.removeAttribute('disabled')

	const id = Number(parentNode.dataset.id)

	const task = tasks.find(task => task.id === id)
	task.text = parentNode.value

	const taskEditedText = document.getElementById(id).querySelector('p')
	taskEditedText.innerText = task.text
	taskEditedText.title = task.text
	saveToLocalStorage()

	if (e.target.dataset.action === 'edited') {
		editorInput.setAttribute('disabled', 'true')
		editorInput.style.height = 'auto'
		e.target.setAttribute('disabled', 'true')
		e.target.classList.toggle('--disabled')
	}

	parentNode.value = ''
}

function deleteTask(e) {
	if (e.target.dataset.action !== 'delete') {
		return
	}

	const parentNode = e.target.closest('li')

	const id = Number(parentNode.id)

	// Удаление задачи через фильтрацию массива

	tasks = tasks.filter(task => task.id !== id)

	saveToLocalStorage()

	parentNode.remove()
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	const bgClass = task.done ? 'task task__done' : 'task'

	const btnCheckClass = task.done
		? 'task-btn-check task-btn-check__done'
		: 'task-btn-check'

	const titleClass = task.done ? 'task-title task-title__done' : 'task-title'

	const btnEditClass = task.done
		? 'task-btn-edit task-btn-edit__done'
		: 'task-btn-edit'

	const taskHTML = `<li id="${task.id}" class="${bgClass}">
											<button
												type="button"
												data-action="done"
												class="${btnCheckClass}"
											>
												<div class="btn-bg-done"></div>
											</button>
											<p class="${titleClass}" title="${task.text}">${task.text}</p>
											
											<div class="task-btns-wrap">
											<button type="button" data-action="edit" class="${btnEditClass}">
											</button>
											<button type="button" data-action="delete" class="task-btn-delete"></button>
											</div>
										
										</li>`

	tasksList.insertAdjacentHTML('beforeend', taskHTML)
}
