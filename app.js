const STORAGE_KEY = "climbing_log_rows_v1";

const BLOCKS = {
  WU: ["CARC", "Récup active", "Pull-up", "Scapular pull-up"],
  PH: ["Rotator cuff external rotation", "Rotator cuff internal rotation", "Y-T-W raise", "Face pull"],
  PO: ["Gullich (force)", "Force de contact / explosivité / vitesse"],
  CO: ["Abdos au sol", "Plank", "Side plank", "Hanging knee raise", "Hanging leg raise", "Ab wheel"],
  FI: ["Force doigts", "Force-endurance doigts", "Gullich (force)", "Gullich (force-endurance)"],
  VP: ["Pull-up", "Weighted pull-up", "Chin-up", "Lock-off", "One-arm lock-off assisted"],
  HP: ["Row", "Ring row", "Face pull"],
  VPu: ["Dips", "Weighted dips", "Overhead press", "Force max triceps"],
  HPu: ["Push-up", "Ring push-up", "Bench press"],
  AR: ["Force max biceps", "Excentrique Biceps", "Pletnev biceps"],
  HI: ["Deadlift", "Romanian deadlift", "Single-leg RDL", "Hip thrust", "Nordic curl"],
  SQ: ["Back squat", "Front squat", "Split squat", "Bulgarian split squat"],
  LG: ["Calf raise", "Tibialis raise"],
  RC: ["Récup active", "CARC"]
};

const ROUTE_GRADES = [
  "3a","3b","3c","4a","4b","4c","5a","5b","5c",
  "6a","6a+","6b","6b+","6c","6c+",
  "7a","7a+","7b","7b+","7c","7c+",
  "8a","8a+","8b","8b+","8c","8c+",
  "9a","9a+","9b","9b+","9c"
];

const BOULDER_GRADES = [
  "3A","3B","3C","4A","4B","4C","5A","5B","5C",
  "6A","6A+","6B","6B+","6C","6C+",
  "7A","7A+","7B","7B+","7C","7C+",
  "8A","8A+","8B","8B+","8C","8C+","9A"
];

const COLUMNS = [
  "session_id", "date", "duration_min", "site", "session_type",
  "session_rpe", "focus", "comments",
  "entry_type", "block", "exercise", "sets", "rep", "external_load",
  "grade", "style", "length", "attempts", "mode", "done", "rpe"
];

let rows = loadRows();

function $(id) { return document.getElementById(id); }

function getSessionId() {
  const date = $("date").value || "no-date";
  const type = $("session_type").value || "NA";
  return `${date}_${type}`;
}

function loadRows() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveRows() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function setOptions(select, values) {
  select.innerHTML = "";
  values.forEach(v => {
    const option = document.createElement("option");
    option.value = v;
    option.textContent = v;
    select.appendChild(option);
  });
}

function updateExerciseOptions() {
  const block = $("block").value;
  setOptions($("exercise"), BLOCKS[block] || []);
}

function updateGradeOptions() {
  const type = $("session_type").value;
  const grades = (type === "B" || type === "BT") ? BOULDER_GRADES : ROUTE_GRADES;
  setOptions($("grade"), grades);
}

function updateEntryVisibility() {
  const sessionType = $("session_type").value;

  if (sessionType === "G") $("entry_type").value = "exercise";
  if (sessionType === "R" || sessionType === "B") $("entry_type").value = "climb";

  const finalType = $("entry_type").value;
  $("exercise_form").classList.toggle("hidden", finalType !== "exercise");
  $("climb_form").classList.toggle("hidden", finalType !== "climb");

  updateGradeOptions();
}

function getHeader() {
  return {
    session_id: getSessionId(),
    date: $("date").value,
    duration_min: $("duration_min").value,
    site: $("site").value,
    session_type: $("session_type").value,
    session_rpe: $("session_rpe").value,
    focus: $("focus").value,
    comments: $("comments").value
  };
}

function addRow() {
  const header = getHeader();
  const entryType = $("entry_type").value;

  let row = Object.fromEntries(COLUMNS.map(c => [c, ""]));
  Object.assign(row, header);
  row.entry_type = entryType;

  if (entryType === "exercise") {
    row.block = $("block").value;
    row.exercise = $("exercise").value;
    row.sets = $("sets").value;
    row.rep = $("rep").value;
    row.external_load = $("external_load").value;
    row.rpe = $("ex_rpe").value;
  } else {
    row.exercise = header.session_type === "B" || header.session_type === "BT" ? "Bloc" : "Route";
    row.grade = $("grade").value;
    row.style = $("style").value;
    row.length = $("length").value;
    row.attempts = $("attempts").value;
    row.rep = $("attempts").value;
    row.mode = $("mode").value;
    row.done = $("done").value;
    row.rpe = $("climb_rpe").value;
  }

  rows.push(row);
  saveRows();
  renderTable();
}

function escapeCSV(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replaceAll('"', '""')}"`;
  }
  return s;
}

function exportCSV() {
  const csv = [
    COLUMNS.join(","),
    ...rows.map(row => COLUMNS.map(col => escapeCSV(row[col])).join(","))
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `climbing_log_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearData() {
  if (!confirm("Delete all saved rows?")) return;
  rows = [];
  saveRows();
  renderTable();
}

function renderTable() {
  const thead = $("preview_table").querySelector("thead");
  const tbody = $("preview_table").querySelector("tbody");

  thead.innerHTML = `<tr>${COLUMNS.map(c => `<th>${c}</th>`).join("")}</tr>`;
  tbody.innerHTML = rows.map(row => {
    return `<tr>${COLUMNS.map(c => `<td>${row[c] ?? ""}</td>`).join("")}</tr>`;
  }).join("");
}

function init() {
  $("date").value = new Date().toISOString().slice(0,10);

  setOptions($("block"), Object.keys(BLOCKS));
  updateExerciseOptions();
  updateGradeOptions();
  updateEntryVisibility();

  $("block").addEventListener("change", updateExerciseOptions);
  $("session_type").addEventListener("change", updateEntryVisibility);
  $("entry_type").addEventListener("change", updateEntryVisibility);
  $("add_row").addEventListener("click", addRow);
  $("export_csv").addEventListener("click", exportCSV);
  $("clear_data").addEventListener("click", clearData);

  renderTable();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
}

init();
