// Get necessary elements from the HTML
const taskInput = document.querySelector(".task-input input"), // Input field for adding new tasks
filters = document.querySelectorAll(".filters span"), // Filters for displaying all/pending/completed tasks
clearAll = document.querySelector(".clear-btn"), // Button to clear all tasks
taskBox = document.querySelector(".task-box"); // Container for displaying tasks

// Variables to handle editing tasks
let editId,
isEditTask = false,

// Retrieve previously saved tasks from local storage
todos = JSON.parse(localStorage.getItem("todo-list"));

// Add event listeners to filter buttons
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove the "active" class from the currently active filter
        document.querySelector("span.active").classList.remove("active");
        // Add the "active" class to the clicked filter
        btn.classList.add("active");
        // Display the tasks according to the selected filter
        showTodo(btn.id);
    });
});

// Function to display the tasks according to the selected filter
function showTodo(filter) {
    let liTag = "";
    // Check if there are any saved tasks
    if(todos) {
        // Loop through each task
        todos.forEach((todo, id) => {
            // Add the "checked" class to completed tasks
            let completed = todo.status == "completed" ? "checked" : "";
            // Check if the task matches the selected filter or if "all" is selected
            if(filter == todo.status || filter == "all") {
                // Add the task to the HTML
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    // Display a message if there are no tasks
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    // Hide the "clear all" button if there are no tasks
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    // Add an "overflow" class to the task container if there are too many tasks
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
// Display all tasks by default
showTodo("all");

// Function to show the menu when the user clicks the settings icon
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    // Hide the menu when the user clicks outside of it
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

// Function to update the status of a task (completed/pending)
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
});

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask) {
        if(!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});