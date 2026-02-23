const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("historyList");
const toggleHistory = document.getElementById("toggleHistory");
const historyContainer = document.getElementById("historyContainer");

let currentInput = "";

// Add click events to all buttons
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent;

        if (button.classList.contains("clear")) {
            clearScreen();
        } 
        else if (button.classList.contains("del")) {
            deleteOne();
        }
        else if (button.classList.contains("equal")) {
            calculateResult();
        } 
        else {
            appendValue(value);
        }
    });
});
function sin(x) {
    return Math.sin(x * Math.PI / 180);
}

function cos(x) {
    return Math.cos(x * Math.PI / 180);
}

function tan(x) {
    return Math.tan(x * Math.PI / 180);
}
// Append numbers/operators
function appendValue(value) {

    screen.focus();

    let start = screen.selectionStart;

    // Convert symbols
    if (value === "×") value = "*";
    if (value === "÷") value = "/";
    if (value === "−") value = "-";

    // Scientific
    if (value === "sin") value = "sin()";
    if (value === "cos") value = "cos()";
    if (value === "tan") value = "tan()";
    if (value === "log") value = "Math.log10()";
    if (value === "ln") value = "Math.log()";
    if (value === "√") value = "Math.sqrt()";
    if (value === "1/x") value = "1/()";
    if (value === "π") value = "Math.PI";
    if (value === "e") value = "Math.E";
    if (value === "x²") value = "**2";
    if (value === "xʸ") value = "**";

    // Insert at cursor
    let before = screen.value.slice(0, start);
    let after = screen.value.slice(start);

    screen.value = before + value + after;

    // Move cursor correctly
    let newPos;

    if (value.includes("()")) {
        newPos = start + value.indexOf("(") + 1;
    } else {
        newPos = start + value.length;
    }

    // Force cursor position
    setTimeout(() => {
        screen.setSelectionRange(newPos, newPos);
    }, 0);
}

// Clear screen
function clearScreen() {
    currentInput = "";
    screen.value = "";
}
function deleteOne() {
    let start = screen.selectionStart;
    let end = screen.selectionEnd;

    if (start === end && start > 0) {
        screen.value =
            screen.value.slice(0, start - 1) +
            screen.value.slice(end);
        screen.setSelectionRange(start - 1, start - 1);
    }
}
// Calculate result
function calculateResult() {
    try {

        let expression = screen.value;
        let result = eval(expression);

        result = parseFloat(result.toFixed(10));

        // Add to history
        let li = document.createElement("li");
        li.textContent = expression + " = " + result;
        historyList.prepend(li);

        screen.value = result;

    } catch {
        screen.value = "Error";
    }
}
// Add to history
function addToHistory(entry) {
    const li = document.createElement("li");
    li.textContent = entry;
    historyList.prepend(li);
}

// Keyboard support
document.addEventListener("keydown", (e) => {

    if (!isNaN(e.key) || "+-*/.%".includes(e.key)) {
        screen.value += e.key;
    }
    else if (e.key === "Enter") {
        calculateResult();
    }
    else if (e.key === "Backspace") {
        screen.value = screen.value.slice(0, -1);
    }
    else if (e.key === "Escape") {
        clearScreen();
    }

});

const toggleBtn = document.getElementById("toggleHistory");

toggleBtn.addEventListener("click", () => {
    historyContainer.classList.toggle("active");

    if (historyContainer.classList.contains("active")) {
        toggleBtn.textContent = "History ⌃";
    } else {
        toggleBtn.textContent = "History ⌄";
    }
});
const sciToggle = document.getElementById("toggleScientific");
const sciPanel = document.getElementById("scientificPanel");

sciToggle.addEventListener("click", () => {
    sciPanel.classList.toggle("active");

    if (sciPanel.classList.contains("active")) {
        sciToggle.textContent = "Scientific ⌃";
    } else {
        sciToggle.textContent = "Scientific ⌄";
    }
});
function moveCursorBack() {
    screen.focus();
    screen.setSelectionRange(screen.value.length - 1, screen.value.length - 1);
}
function insertFunction(funcText) {

    let cursorPos = currentInput.length;

    currentInput =
        currentInput.slice(0, cursorPos) +
        funcText +
        currentInput.slice(cursorPos);

    screen.value = currentInput;

    // Move cursor inside brackets
    let newPos = cursorPos + funcText.indexOf("(") + 1;
    screen.focus();
    screen.setSelectionRange(newPos, newPos);
}
