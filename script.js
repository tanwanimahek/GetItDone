// ── Selectors ──────────────────────────────────────────
const taskInput  = document.getElementById("task-input");
const addBtn     = document.getElementById("add-btn");
const taskList   = document.getElementById("task-list");
const emptyMsg   = document.getElementById("empty-msg");
const filterBtns = document.querySelectorAll(".f-btn");

// ── State ──────────────────────────────────────────────
// Step 1: Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("getitdone-tasks")) || [];
let currentFilter = "all";

// ── Screen navigation ──────────────────────────────────
function goHome() {
  document.getElementById("splash-screen").classList.add("hidden");
  const home = document.getElementById("home-screen");
  home.classList.remove("hidden");
  setGreeting();
  renderAll();
}

function goSplash() {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("splash-screen").classList.remove("hidden");
}

function setGreeting() {
  const h = new Date().getHours();
  const el = document.getElementById("greeting-text");
  if      (h < 12) el.textContent = "Good morning";
  else if (h < 17) el.textContent = "Good afternoon";
  else             el.textContent = "Good evening";
}

// ── Add Task ───────────────────────────────────────────
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();

  // Step 6: Shake on empty input
  if (text === "") {
    taskInput.classList.add("shake");
    setTimeout(() => taskInput.classList.remove("shake"), 400);
    return;
  }

  tasks.unshift({ text, completed: false });
  saveTasks();
  taskInput.value = "";

  // Reset to "all" so new task is always visible
  currentFilter = "all";
  filterBtns.forEach(b => b.classList.remove("on"));
  document.querySelector('[data-filter="all"]').classList.add("on");

  renderAll();
}

// ── Filter buttons ─────────────────────────────────────
filterBtns.forEach(btn => {
  btn.addEventListener("click", function () {
    filterBtns.forEach(b => b.classList.remove("on"));
    this.classList.add("on");
    currentFilter = this.dataset.filter;
    renderAll();
  });
});

// ── Render ─────────────────────────────────────────────
function renderAll() {
  taskList.innerHTML = "";

  // Step 3: Filter tasks
  const visible = tasks.filter(t => {
    if (currentFilter === "active")    return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  // Step 5: Empty state
  emptyMsg.style.display = visible.length === 0 ? "block" : "none";

  visible.forEach(task => {
    const realIndex = tasks.indexOf(task);
    taskList.appendChild(createTaskEl(task, realIndex));
  });

  updateStats();
}

function createTaskEl(task, index) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  // Checkbox circle
  const check = document.createElement("div");
  check.className = "check-circle" + (task.completed ? " checked" : "");
  check.textContent = task.completed ? "✓" : "";
  check.setAttribute("role", "button");
  check.setAttribute("aria-label", "toggle complete");
  check.addEventListener("click", () => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderAll();
  });

  // Task info
  const info = document.createElement("div");
  info.className = "task-info";

  // Step 4: Inline edit on double-click
  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;
  span.title = "Double-click to edit";

  span.addEventListener("dblclick", () => {
    if (task.completed) return;
    span.contentEditable = "true";
    span.focus();

    const range = document.createRange();
    range.selectNodeContents(span);
    range.collapse(false);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    span.addEventListener("blur", () => {
      const newText = span.textContent.trim();
      span.contentEditable = "false";
      if (newText !== "") {
        tasks[index].text = newText;
        saveTasks();
      } else {
        span.textContent = tasks[index].text;
      }
    }, { once: true });

    span.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); span.blur(); }
    });
  });

  const tag = document.createElement("div");
  tag.className = "task-tag";
  tag.textContent = task.completed ? "Completed" : "Pending";

  info.append(span, tag);

  // Delete button
  const del = document.createElement("button");
  del.className = "del-btn";
  del.textContent = "✖";
  del.setAttribute("aria-label", "delete task");
  del.addEventListener("click", () => {
    tasks.splice(index, 1);
    saveTasks();
    renderAll();
  });

  li.append(check, info, del);
  return li;
}

// ── Step 2: Live stats ─────────────────────────────────
function updateStats() {
  const total     = tasks.length;
  const done      = tasks.filter(t => t.completed).length;
  const remaining = total - done;

  animateNum("stat-total", total);
  animateNum("stat-done",  done);
  animateNum("stat-left",  remaining);
}

function animateNum(id, target) {
  const el = document.getElementById(id);
  const current = parseInt(el.textContent) || 0;
  if (current === target) return;
  const step = target > current ? 1 : -1;
  let val = current;
  const interval = setInterval(() => {
    val += step;
    el.textContent = val;
    if (val === target) clearInterval(interval);
  }, 40);
}

// ── Step 1: Save ───────────────────────────────────────
function saveTasks() {
  localStorage.setItem("getitdone-tasks", JSON.stringify(tasks));
}

// ── Dark Mode ──────────────────────────────────────────
function toggleMode() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  document.getElementById("theme-btn").textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
  localStorage.setItem("getitdone-theme", isDark ? "dark" : "light");
}

// Load saved theme on startup
if (localStorage.getItem("getitdone-theme") === "dark") {
  document.body.classList.add("dark");
  window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-btn");
    if (btn) btn.textContent = "☀️ Light mode";
  });
}