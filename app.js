const STORAGE_KEY = "climbing_log_v5";

const BLOCKS = window.EXERCISE_BLOCKS || {};
const EXERCISE_CATALOG = window.EXERCISE_CATALOG || {};

const BODYWEIGHT_KEY = "climbingLog_bodyweight";

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
  "session_id", "date", "climb_type", "grade",  "max_grade", "max_strength",  "max_grade_system", 
  "duration_min", "site", "session_type",
  "session_rpe", "finger_session_rpe", "focus", "focus_level", "comments",   "bodyweight",
  "entry_type", "block", "exercise", "unilateral",
  "side", "strength_intensity_range",
  "custom_strength_intensity", "explosive_strength", "active_strength",
  "grip_type", "sets", "rep", "external_load",
  "grade", "style", "length", "attempts", "mode", "done", "rpe", "frpe",
  "entry_comment"
];

const MAX_BOULDER_GRADE_KEY = "climbingLog_maxBoulderGrade";
const MAX_ROUTE_GRADE_KEY = "climbingLog_maxRouteGrade";
const EXERCISE_MAXES_KEY = "climbingLog_exerciseMaxStrengths";

let rows = loadRows();

function addExerciseBlock() {
  const exerciseBlock = document.createElement("div");
  exerciseBlock.className = "exercise-block";

  exerciseBlock.innerHTML = `

    <div class="local_entry_type_wrap hidden">
      <label>
        Entry type
        <select class="local_entry_type">
          <option value="exercise">Exercise</option>
          <option value="route">Route</option>
          <option value="boulder">Boulder</option>
        </select>
      </label>
    </div>

  <div class="exercise_entry_content">

    <div class="exercise-block-header">

      <label>
        Block
        <select class="exercise_block_select"></select>
      </label>

      <label>
        Exercise
        <select class="exercise_select"></select>
      </label>



    </div>

<div class="exercise_max_section">

  <div class="exercise_max_display hidden">
    <span class="exercise_max_text"></span>

    <button
      type="button"
      class="change_exercise_max"
    >
      Change
    </button>
  </div>

  <div class="exercise_max_editor">

    <div class="exercise_max_bilateral_editor">
      <label>
        Maximum strength
        <input
          class="exercise_max_strength"
          type="text"
          placeholder="e.g. 40 kg, BW, BW+20"
        />
      </label>

      <button
        type="button"
        class="save_exercise_max"
      >
        Save maximum strength
      </button>
    </div>

    <div class="exercise_max_unilateral_editor hidden">

      <label>
        Maximum strength — Left
        <input
          class="exercise_max_left"
          type="text"
          placeholder="e.g. 30 kg, BW+10"
        />
      </label>

      <label>
        Maximum strength — Right
        <input
          class="exercise_max_right"
          type="text"
          placeholder="e.g. 30 kg, BW+10"
        />
      </label>

      <button
        type="button"
        class="save_exercise_max_unilateral"
      >
        Save left / right maximum
      </button>

    </div>

  </div>

</div>

    <label class="checkbox-label">
      <input
        class="exercise_unilateral"
        type="checkbox"
      />
      <span>Unilateral</span>
    </label>

    <label class="checkbox-label">
      <input
        class="exercise_explosive"
        type="checkbox"
      />
      <span>Explosive strength</span>
    </label>

    <div class="exercise_finger_options hidden">

      <label class="checkbox-label">
        <input
          class="exercise_active_strength"
          type="checkbox"
        />
        <span>Active strength</span>
      </label>

      <label>
        Grip type
        <select class="exercise_grip_type">
          <option value="half_crimp">Half crimp</option>
          <option value="open_hand">Open hand</option>
          <option value="three_finger_drag">Three-finger drag</option>
          <option value="two_finger_pocket">Two-finger pocket</option>
          <option value="mono_pocket">Mono pocket</option>
        </select>
      </label>
    </div>

    <div class="exercise_set_blocks"></div>

    <button
      type="button"
      class="add_set_block"
    >
      + Add set block
    </button>


  <label class="exercise_finger_rpe_wrap hidden">
        Finger RPE (1st set)
        <select class="exercise_finger_rpe">
          <option value="1" selected>1</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
          <option>10</option>
        </select>
    </label>
    
    <label>
      RPE (1st set, exluding ramp up sets)
      <select class="exercise_rpe">
        <option value="1" selected>1</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
        <option>10</option>
      </select>
    </label>

    <label>
      Exercise comment
      <textarea
        class="exercise_comment"
        rows="2"
        placeholder="Optional"
      ></textarea>
    </label>

    <button
      type="button"
      class="remove_exercise_block"
    >
      x Remove exercise
    </button>

  </div>

  <div class="climb_entry_content hidden">

  <div class="entry_max_grade_status"></div>

  <label>
    Grade
    <select class="entry_grade"></select>
  </label>

  <label>
    Style
    <select class="entry_style">
      <option value="S">Slab</option>
      <option value="V">Vertical</option>
      <option value="OH">Overhang</option>
    </select>
  </label>

  <label>
    Length
    <select class="entry_length">
      <option value="SH">Short</option>
      <option value="M" selected>Medium</option>
      <option value="L">Long</option>
      <option value="EL">Extra long</option>
    </select>
  </label>

  <label>
    Attempts
    <input
      class="entry_attempts"
      type="number"
      inputmode="numeric"
      placeholder="3"
    />
  </label>

  <label>
    Mode for 1st attempt
    <select class="entry_mode">
      <option value="F">Flash</option>
      <option value="O">Onsight</option>
      <option value="R">Redpoint</option>
    </select>
  </label>

  <label>
    Done
    <select class="entry_done">
      <option value="Y">Yes</option>
      <option value="N">No</option>
    </select>
  </label>

  <label>
    RPE (1st run)
    <select class="entry_climb_rpe">
      <option value="1" selected>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
      <option>8</option>
      <option>9</option>
      <option>10</option>
    </select>
  </label>

  <label>
    FRPE (finger, 1st run)
    <select class="entry_climb_frpe">
      <option value="1" selected>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
      <option>8</option>
      <option>9</option>
      <option>10</option>
    </select>
  </label>

  <label>
    Entry comment
    <textarea
      class="entry_climb_comment"
      rows="2"
      placeholder="Optional"
    ></textarea>
  </label>

  <button
    type="button"
    class="remove_exercise_block"
  >
    x Remove entry
  </button>

</div>
  `;

  

  $("exercise_blocks").appendChild(exerciseBlock);

  initializeExerciseBlock(exerciseBlock);
}

function getExerciseKey(exerciseBlock) {
  const exerciseName =
    exerciseBlock
      .querySelector(".exercise_select")
      .value;

  const exerciseData =
    EXERCISE_CATALOG[exerciseName];

  return (
    exerciseData?.exercise_id ||
    exerciseName
  );
}

function updateExerciseMaxDisplayForBlock(
  exerciseBlock
) {
  const exerciseKey =
    getExerciseKey(exerciseBlock);

  if (!exerciseKey) return;

  const maxes =
    loadExerciseMaxes();

  const saved =
    maxes[exerciseKey] || {
      bilateral: "",
      left: "",
      right: ""
    };

  const unilateral =
    exerciseBlock
      .querySelector(".exercise_unilateral")
      .checked;

  const display =
    exerciseBlock.querySelector(
      ".exercise_max_display"
    );

  const editor =
    exerciseBlock.querySelector(
      ".exercise_max_editor"
    );

  const bilateralEditor =
    exerciseBlock.querySelector(
      ".exercise_max_bilateral_editor"
    );

  const unilateralEditor =
    exerciseBlock.querySelector(
      ".exercise_max_unilateral_editor"
    );

  const text =
    exerciseBlock.querySelector(
      ".exercise_max_text"
    );

  if (unilateral) {
    exerciseBlock
      .querySelector(".exercise_max_left")
      .value = saved.left || "";

    exerciseBlock
      .querySelector(".exercise_max_right")
      .value = saved.right || "";

    const complete =
      saved.left !== "" &&
      saved.right !== "";

    if (complete) {
      text.textContent =
        `Left: ${saved.left} · Right: ${saved.right}`;

      display.classList.remove("hidden");
      editor.classList.add("hidden");
    } else {
      display.classList.add("hidden");
      editor.classList.remove("hidden");

      bilateralEditor.classList.add("hidden");
      unilateralEditor.classList.remove("hidden");
    }

  } else {
    exerciseBlock
      .querySelector(".exercise_max_strength")
      .value = saved.bilateral || "";

    if (saved.bilateral !== "") {
      text.textContent =
        `Max: ${saved.bilateral}`;

      display.classList.remove("hidden");
      editor.classList.add("hidden");
    } else {
      display.classList.add("hidden");
      editor.classList.remove("hidden");

      unilateralEditor.classList.add("hidden");
      bilateralEditor.classList.remove("hidden");
    }
  }
}

function saveExerciseMaxForBlock(
  exerciseBlock
) {
  const exerciseKey =
    getExerciseKey(exerciseBlock);

  if (!exerciseKey) return;

  const maxes =
    loadExerciseMaxes();

  const existing =
    maxes[exerciseKey] || {
      bilateral: "",
      left: "",
      right: ""
    };

  existing.bilateral =
    exerciseBlock
      .querySelector(".exercise_max_strength")
      .value
      .trim();

  maxes[exerciseKey] = existing;

  localStorage.setItem(
    EXERCISE_MAXES_KEY,
    JSON.stringify(maxes)
  );

  updateExerciseMaxDisplayForBlock(
    exerciseBlock
  );
}

function saveExerciseMaxUnilateralForBlock(
  exerciseBlock
) {
  const exerciseKey =
    getExerciseKey(exerciseBlock);

  if (!exerciseKey) return;

  const maxes =
    loadExerciseMaxes();

  const existing =
    maxes[exerciseKey] || {
      bilateral: "",
      left: "",
      right: ""
    };

  existing.left =
    exerciseBlock
      .querySelector(".exercise_max_left")
      .value
      .trim();

  existing.right =
    exerciseBlock
      .querySelector(".exercise_max_right")
      .value
      .trim();

  maxes[exerciseKey] = existing;

  localStorage.setItem(
    EXERCISE_MAXES_KEY,
    JSON.stringify(maxes)
  );

  updateExerciseMaxDisplayForBlock(
    exerciseBlock
  );
}

function initializeExerciseBlock(exerciseBlock) {
  exerciseBlock
  .querySelector(".save_exercise_max")
  .addEventListener(
    "click",
    () => {
      saveExerciseMaxForBlock(
        exerciseBlock
      );
    }
  );

exerciseBlock
  .querySelector(
    ".save_exercise_max_unilateral"
  )
  .addEventListener(
    "click",
    () => {
      saveExerciseMaxUnilateralForBlock(
        exerciseBlock
      );
    }
  );

exerciseBlock
  .querySelector(".change_exercise_max")
  .addEventListener(
    "click",
    () => {
      const display =
        exerciseBlock.querySelector(
          ".exercise_max_display"
        );

      const editor =
        exerciseBlock.querySelector(
          ".exercise_max_editor"
        );

      display.classList.add("hidden");
      editor.classList.remove("hidden");

      const unilateral =
        exerciseBlock
          .querySelector(".exercise_unilateral")
          .checked;

      exerciseBlock
        .querySelector(
          ".exercise_max_bilateral_editor"
        )
        .classList.toggle(
          "hidden",
          unilateral
        );

      exerciseBlock
        .querySelector(
          ".exercise_max_unilateral_editor"
        )
        .classList.toggle(
          "hidden",
          !unilateral
        );
    }
  );
  const blockSelect =
    exerciseBlock.querySelector(".exercise_block_select");

  const exerciseSelect =
    exerciseBlock.querySelector(".exercise_select");

    const localEntryType =
  exerciseBlock.querySelector(
    ".local_entry_type"
  );

  localEntryType.addEventListener(
  "change",
  () => {
    updateEntryBlockType(
      exerciseBlock
    );
  }
);

  setOptions(
    blockSelect,
    Object.keys(BLOCKS)
  );

  function updateExerciseList() {
    const selectedBlock =
      blockSelect.value;

    setOptions(
      exerciseSelect,
      BLOCKS[selectedBlock] || []
    );

    updateExerciseBlockOptions(
      exerciseBlock
    );
  }

  function resetExerciseInputs(exerciseBlock) {
  exerciseBlock
    .querySelector(".exercise_unilateral")
    .checked = false;

  exerciseBlock
    .querySelector(".exercise_explosive")
    .checked = false;

  exerciseBlock
    .querySelector(".exercise_active_strength")
    .checked = false;

  exerciseBlock
    .querySelector(".exercise_grip_type")
    .value = "half_crimp";

  exerciseBlock
    .querySelector(".exercise_rpe")
    .value = "1";

  exerciseBlock
    .querySelector(".exercise_comment")
    .value = "";

  const container =
    exerciseBlock.querySelector(
      ".exercise_set_blocks"
    );

  container.innerHTML = "";

  addSetBlockToExercise(
    exerciseBlock,
    true
  );

  updateExerciseBlockOptions(
    exerciseBlock
  );

  updateEntryBlockType(
  exerciseBlock
);
}
  function resetExerciseSetBlocks(exerciseBlock) {
  const container =
    exerciseBlock.querySelector(
      ".exercise_set_blocks"
    );

  container.innerHTML = "";

  addSetBlockToExercise(
    exerciseBlock,
    true
  );
}

blockSelect.addEventListener(
  "change",
  () => {
    updateExerciseList();
    resetExerciseInputs(exerciseBlock);

    updateExerciseMaxDisplayForBlock(
      exerciseBlock
    );
  }
);

exerciseSelect.addEventListener(
  "change",
  () => {
    resetExerciseInputs(exerciseBlock);

    updateExerciseMaxDisplayForBlock(
      exerciseBlock
    );
  }
);

exerciseBlock
  .querySelectorAll(
    ".remove_exercise_block"
  )
  .forEach(button => {
    button.addEventListener(
      "click",
      () => {
        exerciseBlock.remove();
      }
    );
  });

  exerciseBlock
    .querySelector(".add_set_block")
    .addEventListener("click", () => {
      addSetBlockToExercise(
        exerciseBlock
      );
    });

exerciseBlock
  .querySelector(".exercise_unilateral")
  .addEventListener("change", () => {
    updateExerciseBlockOptions(
      exerciseBlock
    );

    updateExerciseMaxDisplayForBlock(
      exerciseBlock
    );
  });

updateExerciseList();

addSetBlockToExercise(
  exerciseBlock
);

updateEntryBlockType(
  exerciseBlock
);

updateExerciseMaxDisplayForBlock(
  exerciseBlock
);
}

function updateExerciseBlockOptions(exerciseBlock) {
  const block =
    exerciseBlock
      .querySelector(".exercise_block_select")
      .value;

  const unilateral =
    exerciseBlock
      .querySelector(".exercise_unilateral")
      .checked;

  const fingerOptions =
    exerciseBlock
      .querySelector(".exercise_finger_options");

  fingerOptions.classList.toggle(
    "hidden",
    block !== "Fingers"
  );

  const fingerRpeWrap =
  exerciseBlock.querySelector(
    ".exercise_finger_rpe_wrap"
  );

fingerRpeWrap.classList.toggle(
  "hidden",
  block !== "Fingers"
);

  exerciseBlock
    .querySelectorAll(".block_side")
    .forEach(sideSelect => {
      sideSelect.classList.toggle(
        "hidden",
        !unilateral
      );
    });
}

function updateEntryBlockType(exerciseBlock) {
  const sessionType =
    $("session_type").value;

  const typeWrap =
    exerciseBlock.querySelector(
      ".local_entry_type_wrap"
    );

  const typeSelect =
    exerciseBlock.querySelector(
      ".local_entry_type"
    );

  const exerciseContent =
    exerciseBlock.querySelector(
      ".exercise_entry_content"
    );

  const climbContent =
    exerciseBlock.querySelector(
      ".climb_entry_content"
    );

  // Gym = exercise only
  if (sessionType === "G") {
    typeWrap.classList.add("hidden");
    typeSelect.value = "exercise";

    exerciseContent.classList.remove("hidden");
    climbContent.classList.add("hidden");

    return;
  }

  // Climbing = user may choose all 3
  typeWrap.classList.remove("hidden");

  const entryType =
    typeSelect.value;

  const isExercise =
    entryType === "exercise";

  exerciseContent.classList.toggle(
    "hidden",
    !isExercise
  );

  climbContent.classList.toggle(
    "hidden",
    isExercise
  );

  if (isExercise) {
    return;
  }

  const gradeSelect =
    exerciseBlock.querySelector(
      ".entry_grade"
    );

  const grades =
    entryType === "boulder"
      ? BOULDER_GRADES
      : ROUTE_GRADES;

  setOptions(
    gradeSelect,
    grades
  );

  const savedMax =
    entryType === "boulder"
      ? localStorage.getItem(
          MAX_BOULDER_GRADE_KEY
        ) || ""
      : localStorage.getItem(
          MAX_ROUTE_GRADE_KEY
        ) || "";

  const maxText =
    exerciseBlock.querySelector(
      ".entry_max_grade_status"
    );

  maxText.textContent =
    savedMax
      ? `Max: ${savedMax}`
      : "Maximum grade not set";
}

function addSetBlockToExercise(
  exerciseBlock,
  useDefaults = true
) {

  const exerciseName =
  exerciseBlock
    .querySelector(".exercise_select")
    .value;

const exerciseData =
  EXERCISE_CATALOG[exerciseName] || {};

  const defaultIntensity =
  exerciseData
    .default_intensity_range_percent_1rm
    ?.trim() || "";

const defaultSets =
  useDefaults
    ? exerciseData.sets ?? ""
    : "";

const defaultReps =
  useDefaults
    ? exerciseData.reps ?? ""
    : "";

  const div = document.createElement("div");
  div.className = "set-block";

  div.innerHTML = `
    <input
      class="block_sets"
      type="number"
      inputmode="numeric"
      placeholder="Sets"
        value="${defaultSets}"
    >

    <input
      class="block_rep"
      type="number"
      inputmode="numeric"
      placeholder="Rep"
      value="${defaultReps}"
    >

    <input
      class="block_load"
      type="text"
      placeholder="Load"
    >

<select class="block_intensity_range">
  <option value="<60">&lt;60% RM</option>
  <option value="60-70">60–70% RM</option>
  <option value="70-80">70–80% RM</option>
  <option value="80-90">80–90% RM</option>
  <option value="90-100">90–100% RM</option>
  <option value=">100">&gt;100% RM</option>
  <option value="custom">Custom</option>
</select>

    <input
      class="block_custom_intensity hidden"
      type="number"
      inputmode="decimal"
      step="0.5"
      placeholder="% max"
    >

    <select class="block_side hidden">
      <option value="left">Left</option>
      <option value="right">Right</option>
    </select>

    <button
      type="button"
      class="remove_set_block"
    >
      ×
    </button>
  `;

  exerciseBlock
    .querySelector(".exercise_set_blocks")
    .appendChild(div);

  div
    .querySelector(".remove_set_block")
    .addEventListener("click", () => {
      div.remove();
    });

  const intensitySelect =
    div.querySelector(
      ".block_intensity_range"
    );

    if (defaultIntensity) {
  const existingOption =
    [...intensitySelect.options]
      .some(option =>
        option.value === defaultIntensity
      );

  if (!existingOption) {
    const option =
      document.createElement("option");

    option.value = defaultIntensity;
    option.textContent =
      `${defaultIntensity} — Default`;

    intensitySelect.insertBefore(
      option,
      intensitySelect.querySelector(
        'option[value="custom"]'
      )
    );
  }

  intensitySelect.value =
    defaultIntensity;
}

  const customInput =
    div.querySelector(
      ".block_custom_intensity"
    );

  intensitySelect.addEventListener(
    "change",
    () => {
      customInput.classList.toggle(
        "hidden",
        intensitySelect.value !== "custom"
      );
    }
  );

  updateExerciseBlockOptions(
    exerciseBlock
  );
}

function updateBodyweightDisplay() {
  const savedBodyweight =
    localStorage.getItem(BODYWEIGHT_KEY) || "";

  const display = $("bodyweight_display");
  const editor = $("bodyweight_editor");
  const text = $("bodyweight_text");

  if (savedBodyweight !== "") {
    $("bodyweight").value = savedBodyweight;

    text.textContent =
      `Bodyweight: ${savedBodyweight} kg`;

    display.classList.remove("hidden");
    editor.classList.add("hidden");
  } else {
    $("bodyweight").value = "";

    display.classList.add("hidden");
    editor.classList.remove("hidden");
  }
}

function saveBodyweight() {
  const value =
    $("bodyweight").value.trim();

  if (value === "") return;

  localStorage.setItem(
    BODYWEIGHT_KEY,
    value
  );

  updateBodyweightDisplay();
}

function loadExerciseMaxes() {
  try {
    return JSON.parse(
      localStorage.getItem(EXERCISE_MAXES_KEY)
    ) || {};
  } catch {
    return {};
  }
}
function getCurrentExerciseKey() {
  const exerciseName = $("exercise").value;

  const exerciseData =
    EXERCISE_CATALOG[exerciseName];

  return (
    exerciseData?.exercise_id ||
    exerciseName
  );
}
function updateExerciseMaxDisplay() {
  const exerciseKey = getCurrentExerciseKey();
  const maxes = loadExerciseMaxes();

  const saved = maxes[exerciseKey] || {
    bilateral: "",
    left: "",
    right: ""
  };

  const isUnilateral = $("unilateral").checked;

  const bilateralEditor =
    $("exercise_max_bilateral_editor");

  const unilateralEditor =
    $("exercise_max_unilateral_editor");

  const display =
    $("exercise_max_display");

  const text =
    $("exercise_max_text");

  if (isUnilateral) {
    $("exercise_max_left").value =
      saved.left || "";

    $("exercise_max_right").value =
      saved.right || "";

    const hasBothUnilateral =
      saved.left !== "" &&
      saved.right !== "";

    if (hasBothUnilateral) {
      bilateralEditor.classList.add("hidden");
      unilateralEditor.classList.add("hidden");

      text.textContent =
        `Left: ${saved.left} · Right: ${saved.right}`;

      display.classList.remove("hidden");
    } else {
      display.classList.add("hidden");

      bilateralEditor.classList.add("hidden");
      unilateralEditor.classList.remove("hidden");
    }

  } else {

    $("exercise_max_strength").value =
      saved.bilateral || "";

    const hasBilateral =
      saved.bilateral !== "";

    if (hasBilateral) {
      bilateralEditor.classList.add("hidden");
      unilateralEditor.classList.add("hidden");

      text.textContent =
        `Max: ${saved.bilateral}`;

      display.classList.remove("hidden");
    } else {
      display.classList.add("hidden");

      unilateralEditor.classList.add("hidden");
      bilateralEditor.classList.remove("hidden");
    }
  }
}

function updateClimbMaxVisibility() {
  const entryType = $("entry_type").value;

  $("route_max_section").classList.toggle(
    "hidden",
    entryType !== "route"
  );

  $("boulder_max_section").classList.toggle(
    "hidden",
    entryType !== "boulder"
  );

  updateMaxGradeStatus();
}

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
    $("grip_type").value = "half_crimp";
  }
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
  const entryType = $("entry_type").value;

  let savedGrade = "";
  let label = "";

  if (entryType === "route") {
    savedGrade =
      localStorage.getItem(MAX_ROUTE_GRADE_KEY) || "";

    label = "Route max";
  }

  else if (entryType === "boulder") {
    savedGrade =
      localStorage.getItem(MAX_BOULDER_GRADE_KEY) || "";

    label = "Boulder max";
  }

  const display = $("climb_max_display");
  const editor = $("climb_max_editor");
  const text = $("climb_max_text");

  if (savedGrade) {
    text.textContent = `${label}: ${savedGrade}`;

    display.classList.remove("hidden");
    editor.classList.add("hidden");
  } else {
    display.classList.add("hidden");
    editor.classList.remove("hidden");
  }
}

function getClimbContext() {
  const entryType = $("entry_type").value;

  if (entryType === "boulder") {
    return {
      climb_type: "boulder",
      max_grade: localStorage.getItem(MAX_BOULDER_GRADE_KEY) || "",
      max_grade_system: "fontainebleau"
    };
  }

  if (entryType === "route") {
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
  updateExerciseMaxDisplay();
}

function updateGradeOptions() {
  const entryType = $("entry_type").value;

  if (entryType === "boulder") {
    setOptions($("grade"), BOULDER_GRADES);
  } else if (entryType === "route") {
    setOptions($("grade"), ROUTE_GRADES);
  }
}

function updateEntryVisibility() {
  const sessionType =
    $("session_type").value;

  // New card-based interface is always visible
  $("exercise_form")
    .classList.remove("hidden");

  // Old standalone climbing form stays unused
  $("climb_form")
    .classList.add("hidden");

  // Update every existing card
  document
    .querySelectorAll(".exercise-block")
    .forEach(exerciseBlock => {
      updateEntryBlockType(
        exerciseBlock
      );
    });

  // Adapt Add button label
  $("add_exercise_block").textContent =
    sessionType === "C"
      ? "+ Add entry"
      : "+ Add exercise";
}

function saveExerciseMax() {
  const exerciseKey = getCurrentExerciseKey();

  if (!exerciseKey) return;

  const maxes = loadExerciseMaxes();

  const existing = maxes[exerciseKey] || {
    bilateral: "",
    left: "",
    right: ""
  };

  existing.bilateral =
    $("exercise_max_strength").value.trim();

  maxes[exerciseKey] = existing;

  localStorage.setItem(
    EXERCISE_MAXES_KEY,
    JSON.stringify(maxes)
  );

  updateExerciseMaxDisplay();
}
function saveExerciseMaxUnilateral() {
  const exerciseKey = getCurrentExerciseKey();

  if (!exerciseKey) return;

  const maxes = loadExerciseMaxes();

  const existing = maxes[exerciseKey] || {
    bilateral: "",
    left: "",
    right: ""
  };

  existing.left =
    $("exercise_max_left").value.trim();

  existing.right =
    $("exercise_max_right").value.trim();

  maxes[exerciseKey] = existing;

  localStorage.setItem(
    EXERCISE_MAXES_KEY,
    JSON.stringify(maxes)
  );

  updateExerciseMaxDisplay();
}
function getHeader() {
  return {
    session_id: getSessionId(),
    date: $("date").value,
    duration_min: $("duration_min").value,
    site: $("site").value,
    session_type: $("session_type").value,
    bodyweight: localStorage.getItem(BODYWEIGHT_KEY) || "",
    session_rpe: $("session_rpe").value,
    finger_session_rpe: $("finger_session_rpe").value,
    focus: $("focus").value,
    focus_level: $("focus_level").value,
    comments: $("comments").value
  };
}

function updateUnilateralVisibility() {
  const isUnilateral = $("unilateral").checked;

  document
    .querySelectorAll(".block_side")
    .forEach(select => {
      select.classList.toggle(
        "hidden",
        !isUnilateral
      );

      if (!isUnilateral) {
        select.value = "left";
      }
    });
}

function addSetBlock(sets = "", rep = "", load = "") {
  const div = document.createElement("div");
  div.className = "set-block";

  div.innerHTML = `
    <input
      class="block_sets"
      type="number"
      inputmode="numeric"
      placeholder="Sets"
      value="${sets}"
    >

    <input
      class="block_rep"
      type="number"
      inputmode="numeric"
      placeholder="Rep"
      value="${rep}"
    >

    <input
      class="block_load"
      type="text"
      placeholder="Load"
      value="${load}"
    >

    <select class="block_intensity_range"></select>

    <select class="block_side hidden">
  <option value="left">Left</option>
  <option value="right">Right</option>
</select>

    <input
      class="block_custom_intensity hidden"
      type="number"
      inputmode="decimal"
      min="0"
      step="0.5"
      placeholder="% max"
    >

    <button
      type="button"
      class="remove_set_block"
    >
      ×
    </button>
  `;

  div
    .querySelector(".remove_set_block")
    .addEventListener("click", () => {
      div.remove();
    });

  $("set_blocks").appendChild(div);

  updateSetBlockIntensity(div);
  updateUnilateralVisibility();
}

function updateSetBlockIntensity(blockEl) {
  const select =
    blockEl.querySelector(".block_intensity_range");

  const customInput =
    blockEl.querySelector(".block_custom_intensity");

  const exerciseName = $("exercise").value;

  const exerciseData =
    EXERCISE_CATALOG[exerciseName];

  const defaultRange =
    exerciseData?.default_intensity_range_percent_1rm?.trim() || "";

  const standardRanges = [
    ["<60", "<60% RM"],
    ["60-70", "60–70% RM"],
    ["70-80", "70–80% RM"],
    ["80-90", "80–90% RM"],
    ["90-100", "90–100% RM"],
    [">100", ">100% RM"]
  ];

  select.innerHTML = "";

  standardRanges.forEach(([value, label]) => {
    const option = document.createElement("option");

    option.value = value;
    option.textContent = label;

    select.appendChild(option);
  });

  // Add the Excel default if it isn't already
  // one of the standard choices.
  if (
    defaultRange &&
    !standardRanges.some(([value]) => value === defaultRange)
  ) {
    const option = document.createElement("option");

    option.value = defaultRange;
    option.textContent = `${defaultRange} — Default`;

    select.appendChild(option);
  }

  const customOption =
    document.createElement("option");

  customOption.value = "custom";
  customOption.textContent = "Custom";

  select.appendChild(customOption);

  // Select Excel default automatically.
  if (defaultRange) {
    select.value = defaultRange;
  }

  function updateCustomVisibility() {
    const isCustom =
      select.value === "custom";

    customInput.classList.toggle(
      "hidden",
      !isCustom
    );

    if (!isCustom) {
      customInput.value = "";
    }
  }

  select.addEventListener(
    "change",
    updateCustomVisibility
  );

  updateCustomVisibility();
}

function updateAllSetBlockIntensities() {
  document
    .querySelectorAll(".set-block")
    .forEach(blockEl => {
      updateSetBlockIntensity(blockEl);
    });
}

function addRow() {
  const header = getHeader();

  const entryBlocks =
    document.querySelectorAll(".exercise-block");

  if (entryBlocks.length === 0) {
    alert("Add at least one entry.");
    return;
  }

  // =====================================
  // VALIDATE ALL ENTRIES BEFORE SAVING
  // =====================================

  for (const entryBlock of entryBlocks) {

    const sessionType =
      $("session_type").value;

    const entryType =
      sessionType === "G"
        ? "exercise"
        : entryBlock.querySelector(
            ".local_entry_type"
          ).value;

    // Exercise validation
    if (entryType === "exercise") {

      const setBlocks =
        entryBlock.querySelectorAll(
          ".set-block"
        );

      for (const setBlock of setBlocks) {

        const range =
          setBlock.querySelector(
            ".block_intensity_range"
          ).value;

        const custom =
          setBlock.querySelector(
            ".block_custom_intensity"
          ).value;

        if (
          range === "custom" &&
          custom === ""
        ) {
          alert(
            "Enter a custom intensity value for every Custom set block."
          );

          return;
        }
      }
    }

    // Climbing validation
    if (
      entryType === "route" ||
      entryType === "boulder"
    ) {

      const savedMax =
        entryType === "boulder"
          ? localStorage.getItem(
              MAX_BOULDER_GRADE_KEY
            ) || ""
          : localStorage.getItem(
              MAX_ROUTE_GRADE_KEY
            ) || "";

      if (!savedMax) {
        alert(
          entryType === "boulder"
            ? "Please save your maximum boulder grade first."
            : "Please save your maximum route grade first."
        );

        return;
      }
    }
  }

  // =====================================
  // CREATE ROWS
  // =====================================

  entryBlocks.forEach(entryBlock => {

    const sessionType =
      $("session_type").value;

    const entryType =
      sessionType === "G"
        ? "exercise"
        : entryBlock.querySelector(
            ".local_entry_type"
          ).value;

    // ===================================
    // EXERCISE
    // ===================================

    if (entryType === "exercise") {

      const block =
        entryBlock.querySelector(
          ".exercise_block_select"
        ).value;

      const exercise =
        entryBlock.querySelector(
          ".exercise_select"
        ).value;

      const isUnilateral =
        entryBlock.querySelector(
          ".exercise_unilateral"
        ).checked;

      const explosive =
        entryBlock.querySelector(
          ".exercise_explosive"
        ).checked;

      const rpe =
        entryBlock.querySelector(
          ".exercise_rpe"
        ).value;

      const isFingerBlock =
      block === "Fingers";

      const frpe =
      isFingerBlock
        ? entryBlock.querySelector(
            ".exercise_finger_rpe"
          ).value
        : "";
      const comment =
        entryBlock.querySelector(
          ".exercise_comment"
        ).value;

      const activeStrength =
        isFingerBlock
          ? entryBlock.querySelector(
              ".exercise_active_strength"
            ).checked
          : false;

      const gripType =
        isFingerBlock
          ? entryBlock.querySelector(
              ".exercise_grip_type"
            ).value
          : "";

      const exerciseData =
        EXERCISE_CATALOG[exercise] || {};

      const exerciseKey =
        exerciseData.exercise_id ||
        exercise;

      const exerciseMaxes =
        loadExerciseMaxes();

      const savedMaxes =
        exerciseMaxes[exerciseKey] || {};

      const setBlocks =
        entryBlock.querySelectorAll(
          ".set-block"
        );

      setBlocks.forEach(setBlock => {

        const row =
          Object.fromEntries(
            COLUMNS.map(c => [c, ""])
          );

        Object.assign(row, header);

        row.entry_type = "exercise";
        row.block = block;
        row.exercise = exercise;

        row.unilateral =
          isUnilateral;

        row.side =
          isUnilateral
            ? setBlock.querySelector(
                ".block_side"
              ).value
            : "";

        if (isUnilateral) {
          row.max_strength =
            row.side === "left"
              ? savedMaxes.left || ""
              : savedMaxes.right || "";
        } else {
          row.max_strength =
            savedMaxes.bilateral || "";
        }

        const intensityRange =
          setBlock.querySelector(
            ".block_intensity_range"
          ).value;

        const customIntensity =
          setBlock.querySelector(
            ".block_custom_intensity"
          ).value;

        row.strength_intensity_range =
          intensityRange;

        row.custom_strength_intensity =
          intensityRange === "custom"
            ? customIntensity
            : "";

        row.explosive_strength =
          explosive;

        row.sets =
          setBlock.querySelector(
            ".block_sets"
          ).value;

        row.rep =
          setBlock.querySelector(
            ".block_rep"
          ).value;

        row.external_load =
          setBlock.querySelector(
            ".block_load"
          ).value;

        row.rpe = rpe;
        row.frpe = frpe;

        row.entry_comment =
          comment;

        row.active_strength =
          activeStrength;

        row.grip_type =
          gripType;

        rows.push(row);
      });

      return;
    }

    // ===================================
    // ROUTE / BOULDER
    // ===================================

    const row =
      Object.fromEntries(
        COLUMNS.map(c => [c, ""])
      );

    Object.assign(row, header);

    row.entry_type =
      entryType;

    row.climb_type =
      entryType;

    row.exercise =
      entryType === "boulder"
        ? "Bloc"
        : "Route";

    row.grade =
      entryBlock.querySelector(
        ".entry_grade"
      ).value;

    row.max_grade =
      entryType === "boulder"
        ? localStorage.getItem(
            MAX_BOULDER_GRADE_KEY
          ) || ""
        : localStorage.getItem(
            MAX_ROUTE_GRADE_KEY
          ) || "";

    row.max_grade_system =
      entryType === "boulder"
        ? "fontainebleau"
        : "french";

    row.style =
      entryBlock.querySelector(
        ".entry_style"
      ).value;

    row.length =
      entryBlock.querySelector(
        ".entry_length"
      ).value;

    row.attempts =
      entryBlock.querySelector(
        ".entry_attempts"
      ).value;

    row.rep =
      row.attempts;

    row.mode =
      entryBlock.querySelector(
        ".entry_mode"
      ).value;

    row.done =
      entryBlock.querySelector(
        ".entry_done"
      ).value;

    row.rpe =
      entryBlock.querySelector(
        ".entry_climb_rpe"
      ).value;

    row.frpe =
      entryBlock.querySelector(
        ".entry_climb_frpe"
      ).value;

    row.entry_comment =
      entryBlock.querySelector(
        ".entry_climb_comment"
      ).value;

    rows.push(row);
  });

  // =====================================
  // SAVE EVERYTHING
  // =====================================

  saveRows();
  renderTable();

  // Fresh entry area
  const container =
    $("exercise_blocks");

  container.replaceChildren();

  addExerciseBlock();
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
  
  const sessionDate =
  $("date").value ||
  new Date().toISOString().slice(0, 10);

  a.download =
    `climbing_log_${sessionDate}.csv`;

  a.click();
  URL.revokeObjectURL(url);
}

function clearData() {
  if (!confirm("Delete all saved rows?")) return;
  rows = [];
  saveRows();
  renderTable();
}

function deleteRow(index) {
  const confirmed = confirm("Delete this row?");

  if (!confirmed) return;

  rows.splice(index, 1);

  saveRows();
  renderTable();
}

function renderTable() {
  const thead = $("preview_table").querySelector("thead");
  const tbody = $("preview_table").querySelector("tbody");

  thead.innerHTML = `
    <tr>
      ${COLUMNS.map(c => `<th>${c}</th>`).join("")}
      <th>Delete</th>
    </tr>
  `;

  tbody.innerHTML = rows.map((row, index) => {
    return `
      <tr>
        ${COLUMNS.map(c => `<td>${row[c] ?? ""}</td>`).join("")}

        <td>
          <button
            type="button"
            class="delete-row"
            data-index="${index}"
          >
            Delete
          </button>
        </td>
      </tr>
    `;
  }).join("");

  document
    .querySelectorAll(".delete-row")
    .forEach(button => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        deleteRow(index);
      });
    });
}

function init() {

  $("save_bodyweight").addEventListener(
  "click",
  saveBodyweight
);

$("change_bodyweight").addEventListener(
  "click",
  () => {
    $("bodyweight_display")
      .classList.add("hidden");

    $("bodyweight_editor")
      .classList.remove("hidden");
  }
);

  $("save_max_grades").addEventListener(
    "click",
    saveMaxGrades
  );

$("change_climb_max").addEventListener("click", () => {
  $("climb_max_display").classList.add("hidden");
  $("climb_max_editor").classList.remove("hidden");

  const entryType = $("entry_type").value;

  $("route_max_section").classList.toggle(
    "hidden",
    entryType !== "route"
  );

  $("boulder_max_section").classList.toggle(
    "hidden",
    entryType !== "boulder"
  );
});

  $("session_type").addEventListener(
    "change",
    updateEntryVisibility
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
  addExerciseBlock();

  $("add_exercise_block").addEventListener(
  "click",
  addExerciseBlock
);

  $("date").value =
    new Date().toISOString().slice(0, 10);

  updateEntryVisibility();
  updateBodyweightDisplay();
  renderTable();
  if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js", {
    updateViaCache: "none"
  });
}
}

init();