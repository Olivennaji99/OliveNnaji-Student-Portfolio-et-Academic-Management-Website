/* ==========================================================
   planner.js — Academic Planner (task management system)
   Add, complete, delete, filter and save tasks.
   Each task is an object stored in the "tasks" array.
   ========================================================== */

// Get the elements we need from the page
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const courseInput = document.getElementById("task-course");
const dateInput = document.getElementById("task-date");
const priorityInput = document.getElementById("task-priority");
const taskError = document.getElementById("task-error");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = loadTasks();
let currentFilter = "all";

/* ---------- Saving and loading ---------- */
function loadTasks() {
  const saved = localStorage.getItem("plannerTasks");

  if (saved !== null) {
    return JSON.parse(saved); // convert the saved text back into an array
  }

  // First visit: start with sample tasks so the planner isn't empty
  return [
    { id: 1, title: "Submit CSC 106 term project", course: "MIVA-CSC 106", date: "", priority: "high", completed: false },
    { id: 2, title: "Revise limits and derivatives", course: "MTH 102", date: "", priority: "medium", completed: false },
    { id: 3, title: "Read notes on magnetism", course: "PHY 102", date: "", priority: "low", completed: true }
  ];
}

function saveTasks() {
  localStorage.setItem("plannerTasks", JSON.stringify(tasks));
}

/* ---------- Task actions ---------- */
function addTask(title, course, date, priority) {
  const newTask = {
    id: Date.now(), // a unique number based on the current time
    title: title,
    course: course,
    date: date,
    priority: priority,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.completed = !task.completed; // switch between true and false
    }
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  // Keep every task except the one with this id
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });
  saveTasks();
  renderTasks();
}

/* ---------- Displaying tasks ---------- */
function getVisibleTasks() {
  if (currentFilter === "pending") {
    return tasks.filter(function (task) { return !task.completed; });
  }
  if (currentFilter === "completed") {
    return tasks.filter(function (task) { return task.completed; });
  }
  return tasks;
}

function formatDate(dateString) {
  if (dateString === "") {
    return "No due date";
  }
  const date = new Date(dateString + "T00:00:00");
  return "Due " + date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Create one <li> for a task using DOM methods
function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = "task-item priority-" + task.priority;
  if (task.completed) {
    item.classList.add("completed");
  }

  // Checkbox to mark the task complete
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", "Mark " + task.title + " as complete");
  checkbox.addEventListener("change", function () {
    toggleTask(task.id);
  });

  // Task title and details
  const content = document.createElement("div");
  content.className = "task-content";

  const title = document.createElement("p");
  title.className = "task-title";
  title.textContent = task.title; // textContent keeps user input safe

  const meta = document.createElement("p");
  meta.className = "task-meta";
  meta.textContent = task.course + " · " + formatDate(task.date) + " · " + task.priority + " priority";

  content.appendChild(title);
  content.appendChild(meta);

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.type = "button";
  deleteBtn.textContent = "×";
  deleteBtn.setAttribute("aria-label", "Delete " + task.title);
  deleteBtn.addEventListener("click", function () {
    deleteTask(task.id);
  });

  item.appendChild(checkbox);
  item.appendChild(content);
  item.appendChild(deleteBtn);
  return item;
}

function renderTasks() {
  taskList.innerHTML = ""; // clear the old list

  const visibleTasks = getVisibleTasks();
  visibleTasks.forEach(function (task) {
    taskList.appendChild(createTaskElement(task));
  });

  // Show the empty message when there's nothing to display
  emptyState.hidden = visibleTasks.length > 0;
  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(function (task) { return task.completed; }).length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-pending").textContent = pending;
  document.getElementById("stat-done").textContent = completed;
  document.getElementById("progress-fill").style.width = percent + "%";
  document.getElementById("progress-text").textContent = percent + "% complete";
}

/* ---------- Event handling ---------- */
taskForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const title = titleInput.value.trim();

  if (title === "") {
    taskError.textContent = "Please enter a task.";
    titleInput.classList.add("invalid");
    return;
  }

  taskError.textContent = "";
  titleInput.classList.remove("invalid");

  addTask(title, courseInput.value, dateInput.value, priorityInput.value);
  taskForm.reset();
  titleInput.focus();
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    renderTasks();
  });
});

document.getElementById("clear-completed").addEventListener("click", clearCompleted);

// Show the tasks when the page first loads
renderTasks();