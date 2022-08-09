const form = document.querySelector('#form')
const searchShowBtn = document.querySelector('#searchShowBtn')
const formSearch = document.querySelector('#formSearch')
const searchInput = document.querySelector('#searchInput')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const editor = document.querySelector('#editor')
const editorInput = document.querySelector('#editorInput')

let tasks = []

function renderFromLocalStorage() {
	if (localStorage.getItem('tasks')) {
		tasks = JSON.parse(localStorage.getItem('tasks'))
		tasks.forEach(task => renderTask(task))
	}
}

renderFromLocalStorage()

form.addEventListener('submit', addTask)

formSearch.addEventListener('input', search)

searchShowBtn.addEventListener('click', searchInputShow)

tasksList.addEventListener('click', inProcessTask)

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
		inProcess: false,
	}

	tasks.push(newTask)

	saveToLocalStorage()

	renderTask(newTask)

	taskInput.value = ''
	taskInput.focus()
}

function inProcessTask(e) {
	if (e.target.dataset.action !== 'inProcess') {
		return
	}

	const parentNode = e.target.closest('li')

	const id = Number(parentNode.id)
	const task = tasks.find(task => task.id === id)
	task.inProcess = !task.inProcess

	if (task.done === true) {
		task.done = false

		taskClassesSwitch(e)
	}

	saveToLocalStorage()

	const taskBtnInProcess = parentNode.querySelector('.task-btn-inProcess')
	taskBtnInProcess.classList.toggle('task-btn-inProcess__done')
}

function taskClassesSwitch(e) {
	const parentNode = e.target.closest('li')

	parentNode.classList.toggle('task__done')

	const taskBtnCheck = parentNode.querySelector('.task-btn-check')
	taskBtnCheck.classList.toggle('task-btn-check__done')

	const taskTitle = parentNode.querySelector('.task-title')
	taskTitle.classList.toggle('task-title__done')

	const taskBtnEdit = parentNode.querySelector('.task-btn-edit')
	taskBtnEdit.classList.toggle('task-btn-edit__done')
}

function doneTask(e) {
	if (e.target.dataset.action !== 'done') {
		return
	}

	const parentNode = e.target.closest('li')

	const id = Number(parentNode.id)
	const task = tasks.find(task => task.id === id)
	task.done = !task.done

	if (task.inProcess === true) {
		task.inProcess = false
		const taskBtnInProcess = parentNode.querySelector('.task-btn-inProcess')
		taskBtnInProcess.classList.toggle('task-btn-inProcess__done')
	}

	saveToLocalStorage()

	taskClassesSwitch(e)
}

function editTask(e) {
	if (e.target.dataset.action !== 'edit') {
		return
	}

	const parentNode = e.target.closest('li')
	const id = Number(parentNode.id)
	const text = parentNode.querySelector('p').innerText

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

	editor.classList.toggle('editor__show')
	editor.scrollIntoView({
		behavior: 'smooth',
		block: 'start',
	})
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

	editor.classList.toggle('editor__show')
}

function deleteTask(e) {
	if (e.target.dataset.action !== 'delete') {
		return
	}

	const parentNode = e.target.closest('li')

	const id = Number(parentNode.id)

	// Удаление задачи через фильтрацию массива

	tasks = tasks.filter(task => task.id !== id)

	if (parentNode.id === editorInput.dataset.id) {
		editorInput.setAttribute('disabled', 'true')
		editorInput.value = ''
	}

	saveToLocalStorage()

	parentNode.remove()
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function searchInputShow() {
	if (searchShowBtn.dataset.action === 'search') {
		searchShowBtn.src = './img/cross-icon.svg'
		searchShowBtn.dataset.action = 'cross'
	} else {
		searchShowBtn.src = './img/search-icon.svg'
		searchShowBtn.dataset.action = 'search'
	}

	formSearch.classList.toggle('formSearch__show')
	searchInput.focus()
	searchInput.value = ''
	search()
}

function search() {
	const searchInputValue = searchInput.value
	let search = tasks.filter(task =>
		task.text.toLowerCase().includes(searchInputValue.toLowerCase())
	)

	for (let i = 0; i < search.length; i++) {
		const itemToShow = document.getElementById(search[i].id)
		itemToShow.style.display = ''
	}

	let searchArr = tasks.filter(e => !search.includes(e))

	for (let i = 0; i < searchArr.length; i++) {
		const itemToHide = document.getElementById(searchArr[i].id)
		itemToHide.style.display = 'none'
	}
}

function renderTask(task) {
	const bgClass = task.done ? 'task task__done' : 'task'

	const btnInProcessClass = task.inProcess
		? 'task-btn-inProcess task-btn-inProcess__done'
		: 'task-btn-inProcess'

	const btnCheckClass = task.done
		? 'task-btn-check task-btn-check__done'
		: 'task-btn-check'

	const titleClass = task.done ? 'task-title task-title__done' : 'task-title'

	const btnEditClass = task.done
		? 'task-btn-edit task-btn-edit__done'
		: 'task-btn-edit'

	const taskHTML = `<li id="${task.id}" class="${bgClass}">
											<div class="task-progress-btns">
											<button
												type="button"
												data-action="inProcess"
												class="${btnInProcessClass}"
											>
											
												<div class="btn-bg-done"></div>
											</button>
											<button
												type="button"
												data-action="done"
												class="${btnCheckClass}"
											>
												<div class="btn-bg-done"></div>
											</button>
											
											</div>
											<p class="${titleClass}" title="${task.text}">${task.text}</p>
											
											<div class="task-btns-wrap">
											<button type="button" data-action="edit" class="${btnEditClass}">
											</button>
											<button type="button" data-action="delete" class="task-btn-delete"></button>
											</div>
										
										</li>`

	tasksList.insertAdjacentHTML('beforeend', taskHTML)
}
