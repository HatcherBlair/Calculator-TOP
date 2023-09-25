let runningTotal = "0";
let currentNumber = "0";
let runningTotalNumber = null;
let currentOperator = null;
let evalFlag = false;

// NOTE: There is no need to check if the inputs are numbers because they come from button presses
// Returns the sum of a and b
function add(a, b) {
    return Number(a) + Number(b);
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
        return "\u221E You can't divide by zero silly";
    }
    return Math.round((a / b) * 10000) / 10000;
}

// Calls a math function
function operate(operator, a, b) {
    switch (operator) {
        case "add":
            return add(a, b);
            break;

        case "subtract":
            return subract(a, b);
            break;

        case "multiply":
            return multiply(a, b);
            break;

        case "divide":
            return divide(a, b);
            break;

        default:
            return "ERROR";
    }
}

// Displays current number
function updateCurrentNumber(a) {
    // If the last operation was = move the answer to the top display and reset current number
    if (evalFlag) {
        runningTotal = currentNumber;
        runningTotalNumber = Number(currentNumber);
        currentNumber = "0";
        evalFlag = !evalFlag;
    }

    // Update the current number
    if (currentNumber === "0") {
        currentNumber = a;
    } else {
        currentNumber += a;
    }
    updateDisplay();
}

function updateOperator(operator) {
    // Delete and clear don't depend on current operator and so they are tested separate
    switch (operator) {
        case "delete":
            // Ternary operator ensures that there is always something displayed
            currentNumber = currentNumber.length == 1 ? "0" : 
                currentNumber.slice(0, currentNumber.length - 1);
            updateDisplay();
            return; // Return here to ensure the if statement below is not checked

        case "clear":
            currentNumber = "0";
            runningTotal = "0";
            runningTotalNumber = null;
            currentOperator = null;
            updateDisplay();
            return; // Return here to ensure the if statement below is not checked

        default:
            break;
    }

    // Evaluate (=) is also special, so check it first
    if (operator == "evaluate") {
        evalFlag = true;
        // Display entered equation in display and result in currentNumber
        switch (currentOperator) {
            case "multiply":
                runningTotal += currentNumber + " = ";
                currentNumber = multiply(runningTotalNumber, currentNumber);
                runningTotalNumber = Number(currentNumber);
                updateDisplay();
                return;
            case "divide":
                runningTotal += currentNumber + " = ";
                currentNumber = divide(runningTotalNumber, currentNumber);
                if (isNaN(currentNumber)) {
                    runningTotalNumber = null;
                } else {
                    runningTotalNumber = Number(currentNumber);
                }
                updateDisplay();
                return;

            case "add":
                runningTotal += currentNumber + " = ";
                currentNumber = add(runningTotalNumber, currentNumber);
                runningTotalNumber = Number(currentNumber);
                updateDisplay();
                return;

            case "subtract":
                runningTotal += currentNumber + " = ";
                currentNumber = subract(runningTotalNumber, currentNumber);
                runningTotalNumber = Number(currentNumber);
                updateDisplay();
                return;

            default:
                // If no operator is set do nothing
                return;
        }
    }

    // Check remaining operators
    if (currentOperator === null && currentNumber == 0) {
        // No operator and no number entered into calculator
        currentOperator = operator;
        runningTotal += convertOperator(operator);
        updateDisplay();
    } else if (currentOperator === null) {
        // No operator and there is a number entered
        runningTotalNumber = Number(currentNumber);
        runningTotal = currentNumber + convertOperator(operator);
        currentNumber = "0";
        currentOperator = operator;
        updateDisplay();
    }
}

// Converts button id to symbol
function convertOperator(operator) {
    switch (operator) {
        case "multiply":
            return " x ";

        case "divide":
            return " \u00F7 ";

        case "subtract":
            return " - ";

        case "add":
            return " + ";

        default:
            break;
    }
}

// Refreshes the calculator display
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