const STORAGE_KEY = "climbing_log_v5";

const BLOCKS = window.EXERCISE_BLOCKS || {};
const EXERCISE_CATALOG = window.EXERCISE_CATALOG || {};

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
  "session_id", "date", "climb_type", "grade",  "max_grade",  "max_grade_system", 
  "duration_min", "site", "session_type",
  "session_rpe", "focus", "focus_level", "comments",
  "entry_type", "block", "exercise", "strength_intensity_range",
  "custom_strength_intensity", "explosive_strength", "active_strength", "arm_configuration",
  "grip_type", "sets", "rep", "external_load",
  "grade", "style", "length", "attempts", "mode", "done", "rpe",
  "entry_comment"
];

const MAX_BOULDER_GRADE_KEY = "climbingLog_maxBoulderGrade";
const MAX_ROUTE_GRADE_KEY = "climbingLog_maxRouteGrade";

let rows = loadRows();

function updateFingerOptionsVisibility() {
  const isFingerBlock =
    $("block").value === "Fingers";

  $("finger_options").classList.toggle(
    "hidden",
    !isFingerBlock
  );

  // Reset finger-specific values when another block is selected.
  if (!isFingerBlock) {
    $("active_strength").checked = false;
    $("arm_configuration").value = "two_arms";
    $("grip_type").value = "half_crimp";
  }
}
function updateCustomIntensityVisibility() {
  const isCustom =
    $("strength_intensity_range").value === "custom";

  $("custom_intensity_container").classList.toggle(
    "hidden",
    !isCustom
  );

  if (!isCustom) {
    $("custom_strength_intensity").value = "";
  }
}

function updateDefaultIntensityRange() {
  const exerciseName = $("exercise").value;
  const exerciseData = EXERCISE_CATALOG[exerciseName];
  const select = $("strength_intensity_range");

  const defaultRange =
    exerciseData?.default_intensity_range_percent_1rm?.trim() || "";

  // Remove the previous dynamically added default option.
  select
    .querySelectorAll('option[data-exercise-default="true"]')
    .forEach(option => option.remove());

  if (!defaultRange) {
    select.value = "";
    updateCustomIntensityVisibility();
    return;
  }

  // Check whether the exact Excel value already exists.
  const existingOption = Array.from(select.options).find(
    option => option.value === defaultRange
  );

  if (existingOption) {
    select.value = defaultRange;
  } else {
    const defaultOption = document.createElement("option");

    defaultOption.value = defaultRange;
    defaultOption.textContent = `${defaultRange} — Default`;
    defaultOption.dataset.exerciseDefault = "true";

    // Insert just before Custom.
    const customOption = Array.from(select.options).find(
      option => option.value === "custom"
    );

    select.insertBefore(defaultOption, customOption);
    select.value = defaultRange;
  }

  updateCustomIntensityVisibility();
}

function loadMaxGrades() {
  const savedBoulderGrade =
    localStorage.getItem(MAX_BOULDER_GRADE_KEY) || "";

  const savedRouteGrade =
    localStorage.getItem(MAX_ROUTE_GRADE_KEY) || "";

  $("max_boulder_grade").value = savedBoulderGrade;
  $("max_route_grade").value = savedRouteGrade;

  updateMaxGradeStatus();
}

function saveMaxGrades() {
  const maxBoulderGrade = $("max_boulder_grade").value;
  const maxRouteGrade = $("max_route_grade").value;

  localStorage.setItem(
    MAX_BOULDER_GRADE_KEY,
    maxBoulderGrade
  );

  localStorage.setItem(
    MAX_ROUTE_GRADE_KEY,
    maxRouteGrade
  );

  updateMaxGradeStatus();
}

function updateMaxGradeStatus() {
  const maxBoulderGrade =
    localStorage.getItem(MAX_BOULDER_GRADE_KEY) || "not set";

  const maxRouteGrade =
    localStorage.getItem(MAX_ROUTE_GRADE_KEY) || "not set";

  $("max_grade_status").textContent =
    `Saved: boulder ${maxBoulderGrade} · route ${maxRouteGrade}`;
}

function getClimbContext() {
  const sessionType = $("session_type").value;

  if (sessionType === "B" || sessionType === "BT") {
    return {
      climb_type: "boulder",
      max_grade: localStorage.getItem(MAX_BOULDER_GRADE_KEY) || "",
      max_grade_system: "fontainebleau"
    };
  }

  if (sessionType === "R" || sessionType === "RT") {
    return {
      climb_type: "route",
      max_grade: localStorage.getItem(MAX_ROUTE_GRADE_KEY) || "",
      max_grade_system: "french"
    };
  }

  return {
    climb_type: "",
    max_grade: "",
    max_grade_system: ""
  };
}

function validateClimbMaxGrade(climbContext) {
  if (!climbContext.climb_type) {
    alert("The session type does not identify route or boulder climbing.");
    return false;
  }

  if (!climbContext.max_grade) {
    const gradeType =
      climbContext.climb_type === "boulder"
        ? "maximum boulder grade"
        : "maximum route grade";

    alert(`Please save your ${gradeType} first.`);
    return false;
  }

  return true;
}

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
  updateDefaultIntensityRange();
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
    row.strength_intensity_range =$("strength_intensity_range").value;
    row.custom_strength_intensity =$("strength_intensity_range").value === "custom"? $("custom_strength_intensity").value: "";
    row.explosive_strength =$("explosive_strength").checked;
    row.sets = blockEl.querySelector(".block_sets").value;
    row.rep = blockEl.querySelector(".block_rep").value;
    row.external_load = blockEl.querySelector(".block_load").value;
    row.rpe = $("ex_rpe").value;
    row.entry_comment = $("entry_comment").value;
    const isFingerBlock =
      $("block").value === "Fingers";
    row.active_strength =
      isFingerBlock
        ? $("active_strength").checked
        : false;
    row.arm_configuration =
      isFingerBlock
        ? $("arm_configuration").value
        : "";
    row.grip_type =
      isFingerBlock
        ? $("grip_type").value
        : "";
    rows.push(row);
  });

  if (
  $("strength_intensity_range").value === "custom" &&
  $("custom_strength_intensity").value === ""
) {
  alert("Enter a custom intensity value.");
  return;
}
  saveRows();

  $("entry_comment").value = "";

  renderTable();
  return;
} else {
const climbContext = getClimbContext();
  if (!validateClimbMaxGrade(climbContext)) {
    return;
  }

  row.exercise =
    climbContext.climb_type === "boulder"
      ? "Bloc"
      : "Route";

  row.climb_type = climbContext.climb_type;
  row.grade = $("grade").value;

  // Snapshot stored permanently in this row
  row.max_grade = climbContext.max_grade;
  row.max_grade_system = climbContext.max_grade_system;

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
  $("add_set_block").addEventListener(
    "click",
    () => addSetBlock()
  );

  $("save_max_grades").addEventListener(
    "click",
    saveMaxGrades
  );

  $("block").addEventListener("change", () => {
    updateExerciseOptions();
    updateFingerOptionsVisibility();
  });

  $("exercise").addEventListener(
    "change",
    updateDefaultIntensityRange
  );

  $("session_type").addEventListener(
    "change",
    updateEntryVisibility
  );

  $("entry_type").addEventListener(
    "change",
    updateEntryVisibility
  );

  $("strength_intensity_range").addEventListener(
    "change",
    updateCustomIntensityVisibility
  );

  $("add_row").addEventListener(
    "click",
    addRow
  );

  $("export_csv").addEventListener(
    "click",
    exportCSV
  );

  $("clear_data").addEventListener(
    "click",
    clearData
  );

  // Initial state
  addSetBlock();

  $("date").value =
    new Date().toISOString().slice(0, 10);

  updateBlockOptions();
  updateGradeOptions();
  updateEntryVisibility();
  updateCustomIntensityVisibility();
  updateFingerOptionsVisibility();
  loadMaxGrades();
  renderTable();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(
      "service-worker.js"
    );
  }
}

init();