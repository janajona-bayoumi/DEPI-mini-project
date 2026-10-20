const STORAGE_KEY = "taskly_tasks";

const defaultTasks = [
  {
    id: "1",
    title: "Finish JavaScript Assignment",
    description: "Complete array methods and functions.",
    priority: "High",
    dueDate: "2026-10-15",
    status: "todo",
  },
  {
    id: "2",
    title: "Review React Components",
    description: "Review reusable components.",
    priority: "Medium",
    dueDate: "Today",
    status: "completed",
  },
];

let tasks = loadTasks();
let currentFilter = "all";
let searchQuery = "";
let editingId = null;

let taskInput = document.getElementById("task-input");
let taskPriority = document.getElementById("priority-picker");
let taskDueDate = document.getElementById("task-date");
let taskDescription = document.getElementById("Description");

// Functions 1 & 2
// Jana Ahmed Abdelfattah Bayoumi

function generateId() {
  const randomId = crypto.randomUUID();
  return randomId;
}

function addTask(event) {
  event.preventDefault();
  const title = taskInput.value.trim();
  const priority = taskPriority.value;
  const dueDate = taskDueDate.value;
  const description = taskDescription.value.trim();
  if (!title) return;

  if (editingId) {
    // NEW: edit mode -> update the existing task instead of creating a new one
    const taskToEdit = tasks.find((t) => t.id === editingId);
    if (taskToEdit) {
      taskToEdit.title = title;
      taskToEdit.priority = priority;
      taskToEdit.dueDate = dueDate;
      taskToEdit.description = description;
    }
  } else {
    const newTask = {
      id: generateId(),
      title: title,
      priority: priority,
      dueDate: dueDate,
      description: description,
      status: "todo",
    };
    tasks.push(newTask);
  }

  saveTasks();
  renderTasks();
  updateCounts();

  resetForm();
  document.getElementById("close-modal-btn").click();
}

// NEW: clears the form + leaves edit mode (back to "Add Task" mode)
function resetForm() {
  document.getElementById("task-form").reset();
  editingId = null;
  document.getElementById("submit-btn").innerHTML =
    '<i class="fa-solid fa-plus me-1"></i> Add Task';
  document.getElementById("exampleModalLabel").innerHTML =
    '<i class="fa-solid fa-plus text-primary-emphasis me-2"></i> Create New Task';
}

document.getElementById("task-form").addEventListener("submit", addTask);

// NEW: reset the form whenever the modal closes (X / Cancel / backdrop) or "Add Task" buttons are clicked
document
  .getElementById("modal-overlay")
  .addEventListener("hidden.bs.modal", resetForm);
document.getElementById("add-card-btn").addEventListener("click", resetForm);
document.getElementById("add-first-card").addEventListener("click", resetForm);

// Functions 3 & 4
// Function 3 & 4 Mostafa Hussein Mostafa Abdo

function renderTasks() {
  let taskList = document.getElementById("task-list");

  taskList.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];

    if (currentFilter == "active") {
      if (task.status == "completed") {
        continue;
      }
    } else if (currentFilter != "all" && task.status != currentFilter) {
      continue;
    }

    if (!task.title.toLowerCase().includes(searchQuery)) {
      continue;
    }

    let taskElement = createTaskItem(task);
    taskList.appendChild(taskElement);
  }
  const emptyState = document.querySelector(".empty-state");

  if (tasks.length === 0) {
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
  }
}

function createTaskItem(task) {
  let column = document.createElement("div");
  column.className = "col-md-6";

  let card = document.createElement("div");
  card.className = "card h-100 border-0 shadow-sm rounded-3";

  if (task.priority.toLowerCase() == "high") {
    card.classList.add("border-start", "border-5", "border-danger");
  } else if (task.priority.toLowerCase() == "medium") {
    card.classList.add("border-start", "border-5", "border-warning");
  } else {
    card.classList.add("border-start", "border-5", "border-success");
  }

  let header = document.createElement("div");
  header.className = "card-header bg-white border-0 p-4";

  let headerContent = document.createElement("div");
  headerContent.className = "d-flex gap-3";

  let circle = document.createElement("i");
  circle.className = "fa-regular fa-circle fs-4 mt-1 status-circle";
  circle.style.cursor = "pointer";
  circle.dataset.taskId = task.id;

  let titleBox = document.createElement("div");
  titleBox.className = "card-title";

  let title = document.createElement("h5");
  title.className = "fw-bold mb-2 task-title";
  title.textContent = task.title;

  if (task.status === "progress" || task.status === "active") {
    circle.className =
      "fa-regular fa-clock fa-spin text-warning fs-4 mt-1 status-circle";
  } else if (task.status === "completed") {
    circle.className =
      "fa-solid fa-circle-check text-success fs-4 mt-1 status-circle";
    title.classList.add("text-decoration-line-through", "text-secondary");
  }

  circle.addEventListener("click", function () {
    changeStatus(task.id);
  });

  let description = document.createElement("p");
  description.className = "task-description text-muted mb-0";
  description.textContent = task.description;

  titleBox.appendChild(title);
  titleBox.appendChild(description);

  headerContent.appendChild(circle);
  headerContent.appendChild(titleBox);
  header.appendChild(headerContent);

  let body = document.createElement("div");
  body.className = "card-body bg-white pt-0 px-4 pb-3";

  let details = document.createElement("div");
  details.className = "d-flex align-items-center gap-3";

  let priority = document.createElement("span");
  priority.className = "badge rounded-pill px-3 py-2 priority-badge";
  priority.textContent = task.priority + " Priority";

  if (task.priority.toLowerCase() == "high") {
    priority.classList.add("bg-danger-subtle", "text-danger");
  } else if (task.priority.toLowerCase() == "medium") {
    priority.classList.add("bg-warning-subtle", "text-warning");
  } else {
    priority.classList.add("bg-success-subtle", "text-success");
  }

  let date = document.createElement("span");
  date.className =
    "text-secondary badge bg-secondary-subtle rounded-pill px-3 py-2 border border-secondary task-date";

  let calendar = document.createElement("i");
  calendar.className = "fa-regular fa-calendar me-1";

  date.appendChild(calendar);
  date.appendChild(document.createTextNode(task.dueDate || ""));

  details.appendChild(priority);
  details.appendChild(date);
  body.appendChild(details);

  let footer = document.createElement("div");
  footer.className = "card-footer bg-white border-0 px-4 pb-4 pt-0";

  let buttons = document.createElement("div");
  buttons.className = "d-flex justify-content-end gap-2";

  let editButton = document.createElement("button");
  editButton.className =
    "btn rounded-2 btn-sm fw-semibold btn-outline-primary edit-btn";
  editButton.textContent = "Edit";
  editButton.id = task.id;

  let deleteButton = document.createElement("button");
  deleteButton.className =
    "btn rounded-2 btn-sm fw-semibold btn-outline-danger delete-btn";
  deleteButton.textContent = "Delete";
  deleteButton.id = task.id;

  editButton.addEventListener("click", function () {
    editTask(task.id);
  });

  deleteButton.addEventListener("click", function () {
    deleteTask(task.id);
  });

  buttons.appendChild(editButton);
  buttons.appendChild(deleteButton);
  footer.appendChild(buttons);
  card.appendChild(header);
  card.appendChild(body);
  card.appendChild(footer);
  column.appendChild(card);

  return column;
}

// Functions 5 & 6
/* By: Habiba Nashat
   Function 5: Change task status
*/

function changeStatus(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  if (task.status === "todo") {
    task.status = "active";
  } else if (task.status === "active") {
    task.status = "completed";
  } else {
    task.status = "todo";
  }

  if (typeof saveTasks === "function") saveTasks();
  if (typeof renderTasks === "function") renderTasks();
  updateCounts();
}

function updateCounts() {
  const totalCount = tasks.length;
  const activeCount = tasks.filter(
    (t) => t.status === "active" || t.status === "todo",
  ).length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const totalElement = document.getElementById("total-nums");
  const activeElement = document.getElementById("active-nums");
  const completedElement = document.getElementById("completed-nums");

  if (totalElement) totalElement.textContent = totalCount;
  if (activeElement) activeElement.textContent = activeCount;
  if (completedElement) completedElement.textContent = completedCount;

  const filterButtons = document.querySelectorAll("#filters .filter-btn");
  filterButtons.forEach((btn) => {
    const filterType = btn.getAttribute("data-filter");
    if (filterType === "all") {
      btn.textContent = `All (${totalCount})`;
    } else if (filterType === "active") {
      btn.textContent = `Active (${activeCount})`;
    } else if (filterType === "completed") {
      btn.textContent = `Completed (${completedCount})`;
    }
  });
}

// Function 7 & 8
// Tasneem Adel Bassuoni

function deleteTask(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks.splice(i, 1);
      break;
    }
  }

  saveTasks();
  renderTasks();
  updateCounts();
}

function editTask(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      editingId = id;

      taskInput.value = tasks[i].title;
      taskPriority.value = tasks[i].priority;
      taskDueDate.value = tasks[i].dueDate;
      taskDescription.value = tasks[i].description;

      // NEW: "submit-text" doesn't exist in the HTML -> use "submit-btn" + change modal title
      document.getElementById("submit-btn").innerHTML =
        '<i class="fa-solid fa-floppy-disk me-1"></i> Save Changes';
      document.getElementById("exampleModalLabel").innerHTML =
        '<i class="fa-solid fa-pen text-primary-emphasis me-2"></i> Edit Task';
      let modalElement = document.getElementById("modal-overlay");
      let modal = bootstrap.Modal.getOrCreateInstance(modalElement);

      modal.show();
      break;
    }
  }
}

// Functions 9 & 10 (localStorage)

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks:", error);
  }
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return defaultTasks;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : defaultTasks;
  } catch (error) {
    console.error("Failed to load tasks:", error);
    return defaultTasks;
  }
}

// Functions 11 & 12
// By          => Ahmed Reda Abdel Razek
// Function 11 => filters the tasks
// ================================

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

const filterTabs = document.querySelectorAll("[data-filter]");

filterTabs.forEach(function (tab) {
  tab.addEventListener("click", function (e) {
    // Update active button styling
    const clickedTab = e.currentTarget;
    filterTabs.forEach(function (t) {
      t.classList.remove("active-filter");
    });
    clickedTab.classList.add("active-filter");

    const clickedFilter = clickedTab.getAttribute("data-filter");
    setFilter(clickedFilter);
  });
});

// Function 12 => Searching for a task
// ================================

function searchTasks(query) {
  searchQuery = query.toLowerCase();
  renderTasks();
}

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function (e) {
  const typedText = e.target.value;
  searchTasks(typedText);
});

renderTasks();
updateCounts();
