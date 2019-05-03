console.log("--- page load ---");
const LIST_TODO = "todolist.todo";
const LIST_COMPLETED = "todolist.completed";

const ACTIION_EDIT = "edit";
const ACTIION_DELETE = "delete";
const ACTIION_COMPLETE = "complete";
const ACTIION_SAVE = "save";
const ACTIION_CANCEL = "cancel";

// Checks to see if the todolist exists in localStorage and is an array currently
// If not, set a local list variable to an empty array
// Otherwise list is our current list of todos
let listToDo = JSON.parse(localStorage.getItem(LIST_TODO)) || [];
let listCompleted = JSON.parse(localStorage.getItem(LIST_COMPLETED)) || [];

let cleaner = () => {
	console.log("--- cleaner ---");

	let showClearCompleted = false;
	let showClearAll = false;

	if (listToDo && listToDo.length) {
		console.log("todo (not empty)", listToDo);
		showClearAll = true;
	}

	if (listCompleted && listCompleted.length) {
		console.log("completed (not empty)", listCompleted);
		showClearCompleted = true;
		showClearAll = true;
	}

	$("#list-completed").toggleClass("d-none", !showClearCompleted);
	$("#clearCompleted").toggleClass("d-none", !showClearCompleted);
	$("#clearAll").toggleClass("d-none", !showClearAll);
}

let render = () => {
	console.log("--- render ---");

	// Checks to see if we have any todos in localStorage
	// If we do, set the local list variable to our todos
	// Otherwise set the local list variable to an empty array
	let todolistToDo = JSON.parse(localStorage.getItem(LIST_TODO)) || [];
	let todolistCompleted = JSON.parse(localStorage.getItem(LIST_COMPLETED)) || [];

	console.log("todo", todolistToDo);
	console.log("completed", todolistCompleted);

	// Clear all elements of list from UI
	$("#todo").empty();
	$("#completed").empty();

	// render our list todos to the page
	todolistToDo.forEach((item) => {
		console.log("todo item:", item);
		$("#todo").append(`
			<div class="list-group-item list-todo-item" data-id="${item.id}">
				<div class="col-9 float-left overflow-ellipsis" id="list-todo-item-text-${item.id}">${item.name}</div>
				<div class="col-10 float-left pl-0 d-none" id="list-todo-item-input-${item.id}">
					<input type="text" class="list-todo-edit-task form-control" placeholder="${item.name}" value="${item.name}" id="list-todo-item-value-${item.id}" data-id="${item.id}" data-parent="editTask" />
				</div>
				<div class="col-3 btn-group-sm float-right pl-0" role="group" id="list-todo-item-actions-${item.id}"> 
					<button type="button" class="btn btn-light item-action item-action-edit fa fa-edit" data-id="${item.id}" data-action="${ACTIION_EDIT}" data-parent="${LIST_TODO}"></button>
					<button type="button" class="btn btn-light item-action item-action-delete fa fa-trash" data-id="${item.id}" data-action="${ACTIION_DELETE}" data-parent="${LIST_TODO}"></button>
					<button type="button" class="btn btn-light item-action item-action-complete fa fa-check-circle" data-id="${item.id}" data-action="${ACTIION_COMPLETE}" data-parent="${LIST_TODO}"></button>
				</div>
				<div class="col-2 btn-group-sm float-right pl-0 d-none" role="group" id="list-todo-item-submit-${item.id}">
					<button type="button" class="btn btn-light item-action item-action-save fa fa-check" data-id="${item.id}" data-action="${ACTIION_SAVE}" data-parent="${LIST_TODO}" id="save-${item.id}"></button>
					<button type="button" class="btn btn-light item-action item-action-cancel fa fa-times" data-id="${item.id}" data-action="${ACTIION_CANCEL}" data-parent="${LIST_TODO}"></button>
				</div>
			</div>
		`);
	});

	todolistCompleted.forEach((item) => {
		console.log("completed item:", item);
		$("#completed").append(`
			<div class="list-group-item list-completed-item" data-id="${item.id}">
				<div class="col-8 float-left">${item.name}</div>
				<div class="col-4 btn-group-sm float-right"> 
					<button type="button" class="btn btn-light item-action item-action-delete fa fa-trash" data-id="${item.id}" data-action="${ACTIION_DELETE}" data-parent="${LIST_COMPLETED}"></button>
				</div>
			</div>
		`);
	});

	cleaner();
}

console.log("--- render (initial) ---");
render();

let clearTasks = (todo = false, completed = false) => {
	if (todo) {
		console.log("Active Items:", listToDo);
		listToDo = [];
		localStorage.removeItem(LIST_TODO);
	}

	if (completed) {
		console.log("Completed Items:", listCompleted);
		listCompleted = [];
		localStorage.removeItem(LIST_COMPLETED);
	}
}

let toggleToDoClasses = (id) => {
	$(`#list-todo-item-text-${id}`).toggleClass("d-none");
	$(`#list-todo-item-input-${id}`).toggleClass("d-none");
	$(`#list-todo-item-actions-${id}`).toggleClass("d-none");
	$(`#list-todo-item-submit-${id}`).toggleClass("d-none");
}

$(document).on("click", "#clearAll", (e) => {
	e.preventDefault();

	console.log("--- clear all ---");

	clearTasks(true, true)

	render();
});

$(document).on("click", "#clearCompleted", (e) => {
	e.preventDefault();

	console.log("--- clear completed ---");

	clearTasks(false, true)

	render();
});

$(document).on("click", "#addItem", (e) => {
	e.preventDefault();

	console.log("--- add item ---");

	// Setting the input value to a variable and then clearing the input
	let task = $("#newTask").val();

	// Don't add empty values
	if (task.length > 0) {
		$("#newTask").val("");

		// Adding our new todo to our local list variable and adding it to local storage
		listToDo.push({id: Date.now(), name: task});
		localStorage.setItem(LIST_TODO, JSON.stringify(listToDo));
		
		console.log("todo", listToDo);

		render();
	}
});

$(document).on("click", "button.item-action", (e) => {
	e.preventDefault();
	console.log("--- item action ---");

	let refreshData = true;
	let id = $(e.target).data("id");
	let action = $(e.target).data("action");
	let parent = $(e.target).data("parent");

	if (action == ACTIION_EDIT || action == ACTIION_CANCEL) {
		console.log(parent, "Edit Item #", id);

		toggleToDoClasses(id);

		refreshData = false;
	} else if (action == ACTIION_SAVE) {
		console.log(parent, "Save Item #", id);

		let updatedTask = listToDo.find(item => item.id == id);
		let val = $(`#list-todo-item-value-${id}`).val();

		if (val.length > 0) {
			updatedTask.name = val;

			localStorage.setItem(LIST_TODO, JSON.stringify(listToDo));

			toggleToDoClasses(id);
		}
	} else if (action == ACTIION_DELETE) {
		console.log(parent, "Delete Item #", id);

		if (parent == LIST_TODO) {
			listToDo = listToDo.filter(item => item.id !== id);
			localStorage.setItem(LIST_TODO, JSON.stringify(listToDo));
		} else if (parent == LIST_COMPLETED) {
			listCompleted = listCompleted.filter(item => item.id !== id);
			localStorage.setItem(LIST_COMPLETED, JSON.stringify(listCompleted));
		}
	} else if (action == ACTIION_COMPLETE) {
		console.log(parent, "Complete Item #", id);

		let completedTask = listToDo.find(item => item.id == id);
		
		listCompleted.push(completedTask);
		localStorage.setItem(LIST_COMPLETED, JSON.stringify(listCompleted));

		listToDo = listToDo.filter(item => item !== completedTask);
		localStorage.setItem(LIST_TODO, JSON.stringify(listToDo));
	}

	if (refreshData) {
		render();
	}
});

$(document).on("keypress", "input", (e) => {
	if (e.which == 13) {
		let source = $(e.target).data("parent");
		if (source == "newTask") {
			$("#addItem").trigger("click");
		} else if (source == "editTask") {
			let id = $(e.target).data("id");
			$(`#save-${id}`).trigger("click");
		}
	}
});