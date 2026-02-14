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
let numbersLocked = false;

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
        if (val === ".") decimalLocked = true;
        updateDisabledButtons();

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
            updateDisabledButtons();
        }
        updateOperationDisplay(num1, operatorSymbol, num2);
        console.log(num1);
        console.log(num2);
    });
}

let operators = document.querySelectorAll(".operator, .equals");

for (const op of operators) {
    op.addEventListener("click", (event) => {
        let notation = op.getAttribute("data-notation");
        let notationSymbol = op.innerHTML;
        numbersLocked = false;

        if (!operatorLocked && equalsLocked) {
            if (notation != "=") {
                operator = notation;
                operatorSymbol = notationSymbol;
                decimalLocked = false;
                updateDisabledButtons();
            };
            console.log(operator)
        }
        else if (!operatorLocked && !equalsLocked) {
            result = operate(operator, num1, num2);
            resultDisplay.textContent = result;
            num1 = result;

            if (notation === "=") {
                operator = "";
                operatorSymbol = "";
                decimalLocked = true;
                numbersLocked = true;
            }
            else {
                operator = notation; // Change notation
                decimalLocked = false;
            }

            num2 = "";
            equalsLocked = true;
            
            updateDisabledButtons();
        }
        operatorSymbol = notationSymbol;
        updateOperationDisplay(num1, operatorSymbol, num2);
    })
}

function updateDisabledButtons() {
    equalsButton.disabled = equalsLocked;
    decimalButton.disabled = decimalLocked;
    for (const num of numbers) {
        num.disabled = numbersLocked;
    }
}

updateDisabledButtons();


clearButton.addEventListener("click", (event) => {
    num1 = "";
    num2 = "";
    operator = "";
    operatorSymbol = "";
    operatorLocked = true;
    equalsLocked = true;
    numbersLocked = false;
    result = "";
    operationDisplay.textContent = " ";
    resultDisplay.textContent = "0";
    updateDisabledButtons();
})