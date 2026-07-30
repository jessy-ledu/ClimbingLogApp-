const STORAGE_KEY = "climbing_log_rows_v1";

const BLOCKS = {
  "Warm-up": [
    "CARC",
    "Récup active",
    "Pull-up",
    "Scapular pull-up"
  ],

  "Prehab": [
    "Rotator cuff external rotation",
    "Rotator cuff internal rotation",
    "Y-T-W raise",
    "Face pull"
  ],

  "Power": [
    "Gullich (force)",
    "Force de contact / explosivité / vitesse"
  ],

  "Core": [
    "Abdos au sol",
    "Plank",
    "Side plank",
    "Hanging knee raise",
    "Hanging leg raise",
    "Ab wheel"
  ],

  "Fingers": [
    "Force doigts",
    "Force-endurance doigts",
    "Gullich (force)",
    "Gullich (force-endurance)"
  ],

  "Vertical pull": [
    "Pull-up",
    "Weighted pull-up",
    "Chin-up",
    "Lock-off",
    "One-arm lock-off assisted"
  ],

  "Horizontal pull": [
    "Row",
    "Ring row",
    "Face pull"
  ],

  "Vertical push": [
    "Dips",
    "Weighted dips",
    "Overhead press",
    "Force max triceps"
  ],

  "Horizontal push": [
    "Push-up",
    "Ring push-up",
    "Bench press"
  ],

  "Arms": [
    "Force max biceps",
    "Excentrique Biceps",
    "Pletnev biceps"
  ],

  "Hinge": [
    "Deadlift",
    "Romanian deadlift",
    "Single-leg RDL",
    "Hip thrust",
    "Nordic curl"
  ],

  "Squat / lunge": [
    "Back squat",
    "Front squat",
    "Split squat",
    "Bulgarian split squat"
  ],

  "Lower leg": [
    "Calf raise",
    "Tibialis raise"
  ],

  "Recovery": [
    "Récup active",
    "CARC"
  ]
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
  "session_rpe", "focus", "focus_level", "comments",
  "entry_type", "block", "exercise", "sets", "rep", "external_load",
  "grade", "style", "length", "attempts", "mode", "done", "rpe",
  "entry_comment"
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

function updateBlockOptions() {
  setOptions(
    $("block"),
    Object.keys(BLOCKS)
  );

  updateExerciseOptions();
}

function updateExerciseOptions() {
  const selectedBlock = $("block").value;

  setOptions(
    $("exercise"),
    BLOCKS[selectedBlock] || []
  );
}

function updateGradeOptions() {
  const type = $("session_type").value;
  const grades = (type === "B" || type === "BT") ? BOULDER_GRADES : ROUTE_GRADES;
  setOptions($("grade"), grades);
}

function updateEntryVisibility() {
  const sessionType = $("session_type").value;
  const entryTypeSelect = $("entry_type");
  const entryTypeLabel = $("entry_type_label");

  if (sessionType === "G") {
    entryTypeSelect.value = "exercise";
    entryTypeSelect.disabled = true;
    entryTypeLabel.classList.add("hidden");
  } else if (sessionType === "R" || sessionType === "B") {
    entryTypeSelect.value = "climb";
    entryTypeSelect.disabled = true;
    entryTypeLabel.classList.add("hidden");
  } else {
    entryTypeSelect.disabled = false;
    entryTypeLabel.classList.remove("hidden");
  }

  const entryType = entryTypeSelect.value;

  $("exercise_form").classList.toggle(
    "hidden",
    entryType !== "exercise"
  );

  $("climb_form").classList.toggle(
    "hidden",
    entryType !== "climb"
  );

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
    focus_level: $("focus_level").value,
    comments: $("comments").value
  };
}

function addSetBlock(sets = "", rep = "", load = "") {
  const div = document.createElement("div");
  div.className = "set-block";

  div.innerHTML = `
    <input class="block_sets" type="number" inputmode="numeric" placeholder="Sets" value="${sets}">
    <input class="block_rep" type="number" inputmode="numeric" placeholder="Rep" value="${rep}">
    <input class="block_load" type="text" placeholder="Load" value="${load}">
    <button type="button" class="remove_set_block">×</button>
  `;

  div.querySelector(".remove_set_block").addEventListener("click", () => {
    div.remove();
  });

  $("set_blocks").appendChild(div);
}

function addRow() {
  const header = getHeader();
  const entryType = $("entry_type").value;

  let row = Object.fromEntries(COLUMNS.map(c => [c, ""]));
  Object.assign(row, header);
  row.entry_type = entryType;

if (entryType === "exercise") {
  const setBlocks = document.querySelectorAll(".set-block");

  setBlocks.forEach(blockEl => {
    let row = Object.fromEntries(COLUMNS.map(c => [c, ""]));
    Object.assign(row, header);

    row.entry_type = "exercise";
    row.block = $("block").value;
    row.exercise = $("exercise").value;
    row.sets = blockEl.querySelector(".block_sets").value;
    row.rep = blockEl.querySelector(".block_rep").value;
    row.external_load = blockEl.querySelector(".block_load").value;
    row.rpe = $("ex_rpe").value;
    row.entry_comment = $("entry_comment").value;
    rows.push(row);
  });

  saveRows();

  $("entry_comment").value = "";

  renderTable();
  return;
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
    row.entry_comment = $("entry_comment").value;
  }

  rows.push(row);

  $("entry_comment").value = "";

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
  $("add_set_block").addEventListener("click", () => addSetBlock());
  addSetBlock();

  $("date").value = new Date().toISOString().slice(0, 10);

  updateBlockOptions();
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
