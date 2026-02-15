// TODO:
// Fix overflow
// resolve . to 0. if not followed by any numbers
// infinity when dividing by 0 (add a message or something)
// Support for negative numbers when using - before a num1
// backspace
// keyboard support

let operationDisplay = document.querySelector(".operation-display");
let resultDisplay = document.querySelector(".result-display");
let clearButton = document.querySelector(".clear");
let equalsButton = document.querySelector(".equals");
let decimalButton = document.querySelector(".decimalPoint");
let num1 = "";
let num2 = "";
let operator = "";
let operatorSymbol = "";
let operatorLocked = true; // If operator is locked it is because num1 is blank
let equalsLocked = true; // If equals is locked it is because: num1 is not selected or I selected an operator and num2 is blank
let result = "";
let decimalLocked = false;

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

/***
 * Displays ongoing operation
 */
function updateOperationDisplay(num1, operatorSymbol, num2) {
    operationDisplay.textContent = `${num1} ${operatorSymbol} ${num2}`;
}

let numbers = document.querySelectorAll("[data-num], .decimalPoint");

for (const num of numbers) {
    num.addEventListener("click", (event) => {
        let val = num.getAttribute("data-num");
        result = ""; // Clear result if user presses num after calculating answer

        if (!(val === "." && decimalLocked)) {
            // Num1 should append if operator & num2 isn't yet selected, and if there is no result
            if (operatorLocked || operator === "" && result === "") {            
                num1 += val;
                operatorLocked = false;
            }
            // Num2 should append if an operator has been selected
            else {
                num2 += val;
                // Equals is unlocked when num2 is selected
                equalsLocked = false;
            }
            updateOperationDisplay(num1, operatorSymbol, num2);
            console.log("op locked", operatorLocked);
            console.log("equal locked",equalsLocked);

            if (val === ".") decimalLocked = true;
        }
        updateDisabledButtons();
    });
}

let operators = document.querySelectorAll(".operator, .equals");

for (const op of operators) {
    op.addEventListener("click", (event) => {
        let notation = op.getAttribute("data-notation");
        let notationSymbol = op.innerHTML;

        // When User selected num1 then an operator
        if (!operatorLocked && equalsLocked) {
            if (notation != "=") {
                operator = notation;
                operatorSymbol = notationSymbol;
                if (result !== "") num1 = result;
            };
            console.log(operator)
        }
        // When user selected num1, operator, num2 then an operator
        else if (!operatorLocked && !equalsLocked) {
            result = operate(operator, num1, num2) + "";
            resultDisplay.textContent = result;
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

        console.log("op locked", operatorLocked);
        console.log("equal locked",equalsLocked);
    })
}

function updateDisabledButtons() {
    equalsButton.disabled = equalsLocked;
    decimalButton.disabled = decimalLocked;
}

updateDisabledButtons();


clearButton.addEventListener("click", (event) => {
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
})

// After a result, going 5 + and then entering final num results in undefined num1