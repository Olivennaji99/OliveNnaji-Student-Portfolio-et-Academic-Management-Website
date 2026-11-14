/* ==========================================================
   academics.js — Academic Hub page
   1. Semester tabs
   2. Highlight today in the timetable
   3. GPA calculator
   4. Dashboard (pending tasks, latest GPA, deadlines)
   ========================================================== */

// Current semester courses, stored in an array of objects
const courses = [
  { code: "GST 122", title: "Communication in English Language II", units: 2 },
  { code: "MTH 102", title: "Elementary Mathematics (Calculus) II", units: 2 },
  { code: "PHY 102", title: "General Physics II", units: 2 },
  { code: "PHY 108", title: "General Physics Practical II", units: 1 },
  { code: "COS 102", title: "Introduction to Problem-Solving", units: 3 },
  { code: "MIVA-CSC 106", title: "Introduction to Web Technologies", units: 3 },
  { code: "GST 112", title: "Nigerian Peoples and Culture", units: 2 },
  { code: "MIVA-COS 111", title: "Technical Certification in Computing I", units: 1 }
];

// Grade points on the Nigerian 5-point scale
const gradePoints = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

/* ---------- 1. Semester tabs ---------- */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Deactivate every button and hide every panel
    tabButtons.forEach(function (btn) {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });
    tabPanels.forEach(function (panel) {
      panel.hidden = true;
    });

    // Activate the clicked button and show its panel
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    document.getElementById(button.dataset.target).hidden = false;
  });
});

/* ---------- 2. Highlight today in the timetable ---------- */
function highlightToday() {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = dayNames[new Date().getDay()];
  const row = document.querySelector('tr[data-day="' + today + '"]');

  if (row) {
    row.classList.add("today");
  }
}

/* ---------- 3. GPA calculator ---------- */
const gpaBody = document.getElementById("gpa-body");
const gpaResult = document.getElementById("gpa-result");

// Build one table row (with a grade dropdown) for each course
function buildGpaRows() {
  // Create the dropdown options from the gradePoints object
  let options = '<option value="">Select</option>';
  for (const grade in gradePoints) {
    options += '<option value="' + grade + '">' + grade + " (" + gradePoints[grade] + ")</option>";
  }

  courses.forEach(function (course) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" + course.code + "</td>" +
      "<td>" + course.title + "</td>" +
      '<td class="num">' + course.units + "</td>" +
      '<td><select class="grade-select" aria-label="Grade for ' + course.code + '">' + options + "</select></td>";
    gpaBody.appendChild(row);
  });
}

// Return the class of degree for a GPA
function getDegreeClass(gpa) {
  if (gpa >= 4.5) return "First Class";
  if (gpa >= 3.5) return "Second Class Upper";
  if (gpa >= 2.4) return "Second Class Lower";
  if (gpa >= 1.5) return "Third Class";
  if (gpa >= 1.0) return "Pass";
  return "Fail";
}

// GPA = total (grade point × units) ÷ total units
function calculateGpa() {
  const selects = document.querySelectorAll(".grade-select");
  let totalPoints = 0;
  let totalUnits = 0;
  let missingGrade = false;

  selects.forEach(function (select, index) {
    if (select.value === "") {
      missingGrade = true;
      return;
    }
    const units = courses[index].units;
    totalPoints += gradePoints[select.value] * units;
    totalUnits += units;
  });

  if (missingGrade) {
    gpaResult.className = "gpa-result error";
    gpaResult.textContent = "Please select a grade for every course.";
    return;
  }

  const gpa = (totalPoints / totalUnits).toFixed(2);
  gpaResult.className = "gpa-result";
  gpaResult.innerHTML = "GPA: <strong>" + gpa + "</strong> · " + getDegreeClass(gpa);

  // Save the GPA so the dashboard can show it
  localStorage.setItem("lastGpa", gpa);
  document.getElementById("dash-gpa").textContent = gpa;
}

function resetGpa() {
  document.querySelectorAll(".grade-select").forEach(function (select) {
    select.value = "";
  });
  gpaResult.textContent = "";
}

document.getElementById("calc-gpa").addEventListener("click", calculateGpa);
document.getElementById("reset-gpa").addEventListener("click", resetGpa);

/* ---------- 4. Dashboard ---------- */
function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function loadDashboard() {
  // Read the tasks saved by the planner page
  const saved = localStorage.getItem("plannerTasks");
  const tasks = saved ? JSON.parse(saved) : [];

  // Pending tasks = tasks that are not completed
  const pending = tasks.filter(function (task) {
    return !task.completed;
  });
  document.getElementById("dash-pending").textContent = pending.length;

  // Show the saved GPA, if there is one
  const savedGpa = localStorage.getItem("lastGpa");
  if (savedGpa) {
    document.getElementById("dash-gpa").textContent = savedGpa;
  }

  // Next 3 deadlines: pending tasks with a date, earliest first
  const upcoming = pending
    .filter(function (task) { return task.date !== ""; })
    .sort(function (a, b) { return a.date.localeCompare(b.date); })
    .slice(0, 3);

  const list = document.getElementById("deadline-list");
  list.innerHTML = "";

  if (upcoming.length === 0) {
    list.innerHTML = "<li>No upcoming deadlines. Add tasks in the planner.</li>";
    return;
  }

  upcoming.forEach(function (task) {
    const item = document.createElement("li");
    const title = document.createElement("span");
    const date = document.createElement("span");

    title.textContent = task.course + " · " + task.title;
    date.className = "date";
    date.textContent = formatDate(task.date);

    item.appendChild(title);
    item.appendChild(date);
    list.appendChild(item);
  });
}

// Run when the page loads
highlightToday();
buildGpaRows();
loadDashboard();