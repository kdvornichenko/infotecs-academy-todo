// Основные константы, которые использувются в большинстве функций:
// 1) Форма для добавления новой задачи
const form = document.querySelector('#form')
// 2) Поле ввода новой задачи
const taskInput = document.querySelector('#taskInput')
// 3) Кнопка для открытия формы поиска задач
const searchShowBtn = document.querySelector('#searchShowBtn')
// 4) Форма поиска задач
const formSearch = document.querySelector('#formSearch')
// 5) Поле поиска задач
const searchInput = document.querySelector('#searchInput')
// 6) Список задач
const tasksList = document.querySelector('#tasksList')
// 7) Секция изменения данных задачи
const editor = document.querySelector('#editor')
// 8) Поле для ввода измененных данных задачи
const editorInput = document.querySelector('#editorInput')
// 9) Кнопка "Изменить" в редакторе
const editBtn = document.querySelector('[data-action="edited"]')

// Массив со всеми добавленными задачами
let tasks = []
// Функция сохранения в Локальное хранилище
function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}
// Рендер задач из Локального хранилища при загрузке страницы
function renderFromLocalStorage() {
	if (localStorage.getItem('tasks')) {
		// Парсим массив с задачами из Локального хранилитща и рендерим список задач
		tasks = JSON.parse(localStorage.getItem('tasks'))
		tasks.forEach(task => renderTask(task))
	}
}
// Запускаем функцию рендрера задач из Локального хранилища
renderFromLocalStorage()

// Добавляем слушатель событий и запуск необходимых функций:
// 1) Добавление задачи
form.addEventListener('submit', addTask)
// 2) Анимация открытия и закрытия поля поиска по клике на значок поиска
searchShowBtn.addEventListener('click', searchInputShow)
// 3) Поиск задачи по введенным данным в поле поиска
formSearch.addEventListener('input', search)
// 4) Изменение статуса задачи
tasksList.addEventListener('click', taskStatus)
// 5) Включение блока редактирования задачи
tasksList.addEventListener('click', editTask)
// 6) Нажатие на кнопку "Изменить", изменение задачи, деактивирование блока редактирования
editor.addEventListener('click', setEditedTask)
// 7) Удаление задачи
tasksList.addEventListener('click', deleteTask)

// Функция добавления новой задачи
function addTask(e) {
	// Отключаем дефолтное поведение
	e.preventDefault()

	// Получаем введенные данные из инпута
	const taskText = taskInput.value

	// Создаем объект - Новую задачу
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
		inProcess: false,
	}

	// Добавляем созданную задачу в массив tasks
	tasks.push(newTask)

	// Сохраняем в Локальное хранилище
	saveToLocalStorage()

	// Рендерим задачу на странице
	renderTask(newTask)

	// Очищаем поле ввода и переводим на него фокус
	taskInput.value = ''
	taskInput.focus()
}

// Функция для открытия поля поиска
function searchInputShow() {
	// Проверяем текущее состояние кнопки поиска
	if (searchShowBtn.dataset.action === 'search') {
		// Если атрибут data-action="search", то меняем иконку с лупы на крест и меняем актрибут data-action на значение "cross"
		searchShowBtn.src = './img/cross-icon.svg'
		searchShowBtn.dataset.action = 'cross'
	} else {
		// Если атрибут data-action="cross", то меняем иконку с креста на лупу и меняем актрибут data-action на значение "search"
		searchShowBtn.src = './img/search-icon.svg'
		searchShowBtn.dataset.action = 'search'
	}

	// Переключаем класс для формы поиска, чтобы она появилась или закрылась, переводим фокус в поле поиска и очищаем поле
	formSearch.classList.toggle('formSearch__show')
	searchInput.focus()
	searchInput.value = ''
	// Вызываем фунцкию поиска, чтобы при закрытии поиска возвращались все задачи
	search()
}

// Фунцкия поиска задач по введенным данным
function search() {
	// Получаем данные из поля поиска
	const searchInputValue = searchInput.value
	// Фильтруем массив со всеми задачами, ищем совпадения по символам и записываем в новый массив = searchShow
	let searchShow = tasks.filter(task =>
		task.text.toLowerCase().includes(searchInputValue.toLowerCase())
	)

	// Фильтруем массив со всеми задачами для отделения найденных задач, записываем неподходящие задачи в массив searchHide
	let searchHide = tasks.filter(e => !searchShow.includes(e))

	// Находим все элементы, id которых соответствует id элементов из массива searchHide, скрываем их, т.к. они не соответсвуют требованиям поиска
	for (let i = 0; i < searchHide.length; i++) {
		const itemToHide = document.getElementById(searchHide[i].id)
		itemToHide.style.display = 'none'
	}
	// Находим все элементы, id которых соответствует id элементов из массива searchShow, показываем их, для восстановления отображения скрытых элементов, если они соответствуют условиям поиска
	for (let i = 0; i < searchShow.length; i++) {
		const itemToShow = document.getElementById(searchShow[i].id)
		itemToShow.style.display = ''
	}
}

// Функция изменения статуса задачи
function taskStatus(e) {
	// Получаем родителя данной кнопки
	const parentNode = e.target.closest('li')
	// Получаем id родителя
	const id = Number(parentNode.id)
	// Находим в массиве с задачами задачу с соответствующим id
	const task = tasks.find(task => task.id === id)
	const taskBtnInProcess = parentNode.querySelector('.task-btn-inProcess')
	const taskBtnDone = parentNode.querySelector('.task-btn-check')
	// Проверяем содержит ли кнопка атрибут 'inProcess'
	if (e.target.dataset.action === 'inProcess') {
		// Переключаем класс кнопки
		taskBtnInProcess.classList.toggle('task-btn-inProcess__done')
		// Меняем статус inProcess в массиве на противоположный
		task.inProcess = !task.inProcess
		// Дополнительно переключаем состояние задачи "Выполнено" на противоположное, чтобы не было возможности перевести задачу в два состояния - "В процессе" и "Выполнено" одновременно
		if (task.done === true) {
			task.done = false
			// Переключаем класс кнопки "Выполнено"
			taskBtnDone.classList.toggle('task-btn-check__done')
			// Вызываем функцию для переключения стиля задачи
			taskClassesSwitch(e)
			// Сохраняем в Локальное хранилище
			saveToLocalStorage()
		}
		// Проверяем содержит ли кнопка атрибут 'done'
	} else if (e.target.dataset.action === 'done') {
		// Переключаем класс кнопки
		taskBtnDone.classList.toggle('task-btn-check__done')
		// Меняем статус done в массиве на противоположный
		task.done = !task.done
		// Дополнительно переключаем состояние задачи "В процессе" на противоположное, чтобы не было возможности перевести задачу в два состояния - "В процессе" и "Выполнено" одновременно
		if (task.inProcess === true) {
			task.inProcess = false
			// Переключаем класс кнопки "В процеесе"
			taskBtnInProcess.classList.toggle('task-btn-inProcess__done')
		}
		// Вызываем функцию для переключения стиля задачи
		taskClassesSwitch(e)
		// Сохраняем в Локальное хранилище
		saveToLocalStorage()
	}
}

// Функция смены классов задачи для перевода из одного состояния в другое
function taskClassesSwitch(e) {
	// Получаем родителя кнопки
	const parentNode = e.target.closest('li')
	// Переключаем класс задачи "Выполнено"
	parentNode.classList.toggle('task__done')
	// // Находим зеленую кнопку "Выполнено" и переключаем ее класс
	// const taskBtnCheck = parentNode.querySelector('.task-btn-check')
	// taskBtnCheck.classList.toggle('task-btn-check__done')
	// Находим текст задачи и переключаем его класс
	const taskTitle = parentNode.querySelector('.task-title')
	taskTitle.classList.toggle('task-title__done')
	// Находим кнопку "Изменить" и переключаем ее класс
	const taskBtnEdit = parentNode.querySelector('.task-btn-edit')
	taskBtnEdit.classList.toggle('task-btn-edit__done')
}
// Функция редактирования задачи
function editTask(e) {
	// Проверяем содержит ли кнопка атрибут 'edit'
	if (e.target.dataset.action !== 'edit') {
		return
	}
	// Получаем родителя кнопки
	const parentNode = e.target.closest('li')
	// Получаем id родителя
	const id = Number(parentNode.id)
	// Получаем текст задачи
	const text = parentNode.querySelector('p').innerText

	// Убираем у редактора отрибут 'disabled'
	editorInput.removeAttribute('disabled')
	// Переводим фокус на редактор
	editorInput.focus()
	// Вставляем в поле редактора текст задачи
	editorInput.value = text
	// Присваиваем редактору id редактируемой задачи
	editorInput.dataset.id = id
	// Добавляем новыый placeholder, если в редакторе ничего не введено
	editorInput.placeholder = 'Введите изменения задачи'
	// Сохраняем в Локальное хранилище
	saveToLocalStorage()

	// Автоматическое изменение высоты редактора в зависимости от наполнения текстом:
	// Получаем поле ввода редактора
	const textarea = document.getElementsByTagName('textarea')
	// Т.к. полученная константа - это HTML коллекция, перебираем ее при помощи цикла for
	for (let i = 0; i < textarea.length; i++) {
		// Добавляем атрибут style и устанавливаем высоту в равную высоте сроллбара, дополнительно очищаем ширину для правильного отображения
		textarea[i].setAttribute(
			'style',
			'height:' + textarea[i].scrollHeight + 'px;width:unset;'
		)
		// Добавляем слушатель события на ввод в поле редактора, чтобы при вводе запускалась функция onInput
		textarea[i].addEventListener('input', onInput)
	}
	// Дополнительная функция для корректной работы поля редактора
	function onInput() {
		// Устанавливаем автоматическую высоту при уменьшении высоты скроллбара
		this.style.height = 'auto'
		// Устанавливаем высоту равную высоте сроллбара
		this.style.height = this.scrollHeight + 'px'
		// Проверка поля редактора на наличие текста:
		// Если длина текста в поле редактора больше, чем 0 символов (т.е. текст присутствует)
		if (editorInput.value.length > 0) {
			// Убираем у кнопки атрибут 'disabled'
			editBtn.removeAttribute('disabled')
			// Убираем у кнопки класс '--disabled'
			editBtn.classList.remove('--disabled')
		} else {
			// В противном случае:
			// Устанавливаем кнопке атрибут 'disabled'
			editBtn.setAttribute('disabled', 'true')
			// Устанавливаем кнопке класс '--disabled'
			editBtn.classList.add('--disabled')
		}
	}
	// Для мобильной адаптации:
	// Переключаем класс для редактора при нажатии на кнопку "Редактировать" - показываем редактор
	editor.classList.toggle('editor__show')
	// Добавляем пралвый скролл страницы к редактору
	editor.scrollIntoView({
		behavior: 'smooth',
		block: 'start',
	})
}

// Функция изменения редактируемой задачи
function setEditedTask(e) {
	// Проверяем содержит ли кнопка атрибут 'editet'
	if (e.target.dataset.action !== 'edited') {
		return
	}
	// Отключаем дефолтное поведение кнопоки
	e.preventDefault()
	// Получаем родителя кнопки
	const parentNode = document.querySelector('#editorInput')
	// Получаем id родителя, т.е. редактора
	const id = Number(parentNode.dataset.id)
	// Находим соответствие id в массиве с задачами
	const task = tasks.find(task => task.id === id)
	// Изменяем текст найденной задачи в массиве
	task.text = parentNode.value
	// Находим текст задачи на странице
	const taskEditedText = document.getElementById(id).querySelector('p')
	// Изменяем текст найденной задачи на странице на текст из редактора
	taskEditedText.innerText = task.text
	// Изменяем title на текст из редактора
	taskEditedText.title = task.text
	// Сохраняем в Локальное хранилище
	saveToLocalStorage()

	// Возвращаем редактор в исходное состояние:
	// Обратно устанавливаем атрибут 'disabled' для поля редактора, чтобы исключить возможность ввода текста без редактирования задачи
	editorInput.setAttribute('disabled', 'true')
	// Устанавливаем автоматическую высоту после редактирования
	editorInput.style.height = 'auto'
	// Устанавливаем атрибут 'disabled' для кнопки, чтобы избежать нажатия на кнопку "Измнить" без редактирования задачи
	editBtn.setAttribute('disabled', 'true')
	// Переключаем класс кнопки на '--disabled'
	editBtn.classList.toggle('--disabled')
	// Очищаем поле редактора
	parentNode.value = ''
	// Для мобильной версии:
	// Переключаем класс редактора и прячем его
	editor.classList.toggle('editor__show')
}

// Функция удаления задачи
function deleteTask(e) {
	// Проверяем содержит ли кнопка атрибут 'delete'
	if (e.target.dataset.action !== 'delete') {
		return
	}
	// Получаем родителя кнопки
	const parentNode = e.target.closest('li')
	// Получаем id родителя, т.е. редактора
	const id = Number(parentNode.id)
	// Фильтруем массив с задачами, оставляя задачи, id которых не совпадает с id удаляемой задачи:
	tasks = tasks.filter(task => task.id !== id)
	// Если id редактора совпадает с id удаляемой задачи (т.е. удаляемая задача находится на редактировании в поле редактора):
	if (parentNode.id === editorInput.dataset.id) {
		// Устанавливаем редаутору атрибут 'disabled'
		editorInput.setAttribute('disabled', 'true')
		// Очищаем поле редактора
		editorInput.value = ''
		// Устанавливаем атрибут 'disabled' для кнопки, чтобы избежать нажатия на кнопку "Измнить" без редактирования задачи
		editBtn.setAttribute('disabled', 'true')
		// Переключаем класс кнопки на '--disabled'
		editBtn.classList.toggle('--disabled')
	}
	// Сохраняем в Локальное хранилище
	saveToLocalStorage()
	// Удаляем родителя кнопки, т.е. задачу
	parentNode.remove()
	// Для мобильной версии:
	// Переключаем класс редактора и прячем его
	editor.classList.toggle('editor__show')
}

// Функция рендера задачи на странице
function renderTask(task) {
	// Записываем класс кнопки в зависимости от свойства задачи "done"
	const bgClass = task.done ? 'task task__done' : 'task'
	// Записываем класс кнопки "В процессе" в зависимости от свойства задачи "inProcess"
	const btnInProcessClass = task.inProcess
		? 'task-btn-inProcess task-btn-inProcess__done'
		: 'task-btn-inProcess'
	// Записываем класс кнопки "Вывполнено" в зависимости от свойства задачи "done"
	const btnCheckClass = task.done
		? 'task-btn-check task-btn-check__done'
		: 'task-btn-check'
	// Записываем класс кнопки "Изменить" в зависимости от свойства задачи "done"
	const titleClass = task.done ? 'task-title task-title__done' : 'task-title'
	// Записываем класс текста задачи в зависимости от свойства задачи "done"
	const btnEditClass = task.done
		? 'task-btn-edit task-btn-edit__done'
		: 'task-btn-edit'
	// Шаблон задачи для рендера, где id задачи и классы элементов подставляются в зависимости от статуса задачи
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
	// Вставляем задачу на страницу
	tasksList.insertAdjacentHTML('beforeend', taskHTML)
}
