let runningTotal = "0"
let currentNumber = "0";

// NOTE: There is no need to check if the inputs are numbers because they come from button presses
// Returns the sum of a and b
function add(a, b) {
    return a + b;
}

// Returns the difference between a and b
function subract(a, b) {
    return a - b;
}

// Returns the product of a and b
function multiply(a, b) {
    return a * b;
}

// Returns the quotient of a divided by b (rounded to 5 decimal places)
function divide(a, b) {
    if (b == 0) {
        return "&infin; you can't divide by zero silly";
    }
    return Math.round((a / b) * 10000) / 10000;
}

// Calls a math function
function operate(operator, a, b) {
    let result;
    switch (operator) {
        case "add":
            result = add(a, b);
            break;

        case "subtract":
            result = subract(a, b);
            break;

        case "multiply":
            result = multiply(a, b);
            break;

        case "divide":
            result = divide(a, b);
            break;

        default:
            return "ERROR";
    }
}

// Displays current number
function updateCurrentNumber(a) {
    if (currentNumber === "0") {
        currentNumber = a;
    } else {
        currentNumber += a;
    }
    updateDisplay();
}

function updateOperator(operator) {
    operate(operator, runningTotal, currentNumber);
}

function updateDisplay() {
    const runningTotalDisplay = document.querySelector('#running-total');
    runningTotalDisplay.textContent = runningTotal;

    const currentNumberDisplay = document.querySelector('#current-number');
    currentNumberDisplay.textContent = currentNumber;
}

// Event listeners for calculator buttons
const operatorButtons = document.querySelector('.calculator-buttons')
    .querySelectorAll('button.operator-button');
operatorButtons.forEach(button => 
    button.addEventListener('click', () => updateOperator(button.id)));

const numberButtons = document.querySelector('.calculator-buttons')
    .querySelectorAll('.number-button');
numberButtons.forEach(button => 
    button.addEventListener('click', () => updateCurrentNumber(button.textContent)));
updateDisplay();