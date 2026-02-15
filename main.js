let operationDisplay = document.querySelector(".operation-display");
let resultDisplay = document.querySelector(".result-display");
let clearButton = document.querySelector(".clear");
let backButton = document.querySelector(".back");
let equalsButton = document.querySelector(".equals");
let decimalButton = document.querySelector(".decimalPoint");
let num1 = "";
let num2 = "";
let operator = "";
let operatorSymbol = "";
let operatorLocked = true; // If operator is locked it is because num1 is blank
let equalsLocked = true; // If equals is locked it is because: num1 is not selected or I selected an operator and num2 is blank
let decimalLocked = false;
let result = "";

function add(num1, num2) {
    return parseFloat(num1) + parseFloat(num2);
}

function subtract(num1, num2) {
    return parseFloat(num1) - parseFloat(num2);
}

function multiply(num1, num2) {
    return parseFloat(num1) * parseFloat(num2);
}

function divide(num1, num2) {
    return parseFloat(num1) / parseFloat(num2);
}

/***
 * Takes an operator, two numbers, and calls a math function on the numbers
 */
function operate(operator, num1, num2) {
    switch(operator) {
        case '+':
            return add(num1, num2);
        case '-':
            return subtract(num1, num2);
        case '*' || 'x': 
            return multiply(num1, num2);
        case '/' || '÷':
            return divide(num1, num2);
    }
}

function formatDisplayNumber(num) {
    // get rid of trailing zeros but maintain decimal point
    const parts = num.split('.');
    parts[0] = num === "-" ? "-" : parseFloat(parts[0]);
    return num === "" ? "" : parts.join('.');
}

function formatResultNumber(result) {
    // Round to 5 decimal places
    return Math.round(parseFloat(result) * 100000000000) / 100000000000;
}

/***
 * Displays ongoing operation
 */
function updateOperationDisplay(num1, operatorSymbol, num2) {
    
    operationDisplay.textContent = `${formatDisplayNumber(num1)} ${operatorSymbol} ${formatDisplayNumber(num2)}`;
}

let numbers = document.querySelectorAll("[data-num], .decimalPoint");

// Resolves single decimal point entry to 0.
function fixSoloDecimalPoint(num) {
    if (num === ".") {
        return "0.";
    }
    return num;
}

function appendNum(num, isKeyDown) {
    let val = isKeyDown ? num : num.getAttribute("data-num");
    result = ""; // Clear result if user presses num after calculating answer

    if (!(val === "." && decimalLocked)) {
        // Num1 should append if operator & num2 isn't yet selected, and if there is no result
        if (operatorLocked || operator === "" && result === "") {            
            num1 += val;
            num1 = fixSoloDecimalPoint(num1);
            operatorLocked = false;
        }
        // Num2 should append if an operator has been selected
        else {
            num2 += val;
            num2 = fixSoloDecimalPoint(num2);
            // Equals is unlocked when num2 is selected
            equalsLocked = false;
        }

        if (val === ".") decimalLocked = true;
    }
    updateDisabledButtons();
    updateOperationDisplay(num1, operatorSymbol, num2);
}

for (const num of numbers) {
    num.addEventListener("click", (event) => {
        appendNum(num, false);
    });
}

let operators = document.querySelectorAll(".operator, .equals");

function appendOperator(op, isKeyDown) {
    let notation = isKeyDown ? op : op.getAttribute("data-notation");
    if (notation === "Enter") notation = "=";
    if (notation === "x" || notation === "X") notation = "*";
    const opMap = new Map ([
        ['=', '='],
        ['/', '÷'],
        ['*', '×'],
        ['-', '−'],
        ['+', '+']
    ]);
    let notationSymbol = opMap.get(notation);

    // When user is using '-' on num1
    if (notation === "-" && num1 === "" && (operatorLocked || operator === "" && result === "")) {
        num1 += notation;
    }

    // When User selected num1 then an operator
    if (!operatorLocked && equalsLocked) {
        if (notation !== "=") {
            operator = notation;
            operatorSymbol = notationSymbol;
            if (result !== "") num1 = result;
        };
    }
    // If user is trying to divide by 0
    else if (parseFloat(num2) === 0 && operator === "/") {
        resultDisplay.textContent = "Nice try bucko";
    }
    // When user selected num1, operator, num2 then an operator
    else if (!operatorLocked && !equalsLocked) {
        result = operate(operator, num1, num2) + "";
        resultDisplay.textContent = formatResultNumber(result);
        num1 = result;

        if (notation === "=") {
            operator = "";
            operatorSymbol = "";
            num1 = "";
            num2 = "";
            operatorLocked = false;
        }
        else {
            operator = notation; // Change notation
            operatorSymbol = notationSymbol;
        }

        num2 = "";
        equalsLocked = true;
    }
    
    decimalLocked = false;
    updateOperationDisplay(num1, operatorSymbol, num2);
    updateDisabledButtons();
}

for (const op of operators) {
    op.addEventListener("click", (event) => {
        appendOperator(op, false);
    })
}

function backSpace() {
    // Num1
    if (operatorLocked || operator === "" && result === "") {          
        num1 = num1.slice(0, -1);
        if (num1 === "") clearAll();
    }
    // Num2
    else if (operator !== "" && num2 !== "") {
        num2 = num2.slice(0, -1);
    }
    // Clear operator if num2 is empty
    else if (operator !== "" && num2 === "") { 
        operatorLocked = false;
        equalsLocked = true;
        operator = ""; 
        operatorSymbol = "";
    };
    
    updateOperationDisplay(num1, operatorSymbol, num2);
    updateDisabledButtons();
}

backButton.addEventListener("click", (event) => {
    backSpace();
})

function updateDisabledButtons() {
    equalsButton.disabled = equalsLocked;
    decimalButton.disabled = decimalLocked;
}

updateDisabledButtons();

function clearAll() {
    num1 = "";
    num2 = "";
    operator = "";
    operatorSymbol = "";
    operatorLocked = true;
    equalsLocked = true;
    decimalLocked = false;
    result = "";
    operationDisplay.textContent = " ";
    resultDisplay.textContent = "0";
    updateDisabledButtons();
}

clearButton.addEventListener("click", (event) => {
    clearAll();
})

// Keyboard support
document.addEventListener('keydown', (event) => {
    numList = ['0','1','2','3','4','5','6','7','8','9','.'];
    opList = ['=', 'Enter', 'x', 'X', '/','*','-','+'];

    if (numList.includes(event.key)) appendNum(event.key, true);
    else if (opList.includes(event.key)) appendOperator(event.key, true);
    else if (event.key === "Backspace") backSpace();
    else if (event.key === "c" || event.key === "C") clearAll();
})