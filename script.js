let runningTotal = "0"; // Top display of calculator
let runningTotalNumber = null; // Just the number portion of the top display
let currentNumber = "0"; // Number that user is entering into calculator
let currentOperator = null; // The operation that is queued
let evalFlag = false; // True if the last operation was an evaluate (=)
let infinFlag = false; // True if the last result was infinity

updateDisplay();

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
        infinFlag = true;
        return "\u221E You can't divide by zero silly";
    }
    return Math.round((a / b) * 10000) / 10000;
}

// Calls a math function
function operate(operator, a, b) {
    switch (operator) {
        case "add":
            return add(a, b);

        case "subtract":
            return subract(a, b);

        case "multiply":
            return multiply(a, b);

        case "divide":
            return divide(a, b);

        default:
            return "ERROR";
    }
}

// Displays current number
function updateCurrentNumber(a) {
    // If the last operation was an evaluate get the calculator ready for another operation
    if (evalFlag) {
        runningTotal = currentNumber;
        runningTotalNumber = Number(currentNumber);
        currentNumber = "0";
        evalFlag = !evalFlag;
    }

    // If the last result was infinity, reset the calculator first
    if (infinFlag) {
        runningTotal = "0";
        runningTotalNumber = null;
        currentNumber = "0";
        currentOperator = null;
        infinFlag = !infinFlag;
    }

    // Don't allow 2 decimals
    if (a === "." && currentNumber.includes(".")) return;

    // Update the current number
    if (currentNumber === "0" && a !== ".") {
        currentNumber = a;
    } else {
        currentNumber += a;
    }
    updateDisplay();
}

/* --- Updates the operator being used --- updateOperator(operator)
 * 
 * If the operator is delete it will remove the last character from currentNumber,
 * if currentNumber is zero it will do nothing
 * 
 * If the operator is clear it will reset the calculator
 * 
 * If the operator is evaluate(=) it will do one of 2 things:
 *  1: If there is no currentOperator(operator queued) it will return
 *  2: If there is a currentOperator it will append the currentNumber and " = " to the display,
 *  and will display the result of that operation in the currentNumber spot
 * 
 * If there is no currentOperator(operator queued) it will update the display in one of 3 ways:
 *  1: If there is not a number in runningTotal, it will move the currentNumber
 *  to the runningTotal and append the operator to the display.
 *  2: If there is a number in runningTotal, it will append the operator to the display
 *  3: If there is no currentNumber it will append the operator to the current number
 * 
 * If there is a currentOperator it will perform the calculation and update the display
 */
function updateOperator(operator) {
    // Delete and clear don't depend on current operator and so they are tested separate
    switch (operator) {
        case "delete":
            // Remove the last character from currentNumber
            // Ternary operator ensures that there is always something displayed
            currentNumber = currentNumber.length == 1 ? "0" : 
                currentNumber.slice(0, currentNumber.length - 1);
            updateDisplay();
            return;

        case "clear":
            // Reset the calculator
            currentNumber = "0";
            runningTotal = "0";
            runningTotalNumber = null;
            currentOperator = null;
            evalFlag = false;
            infinFlag = false;
            updateDisplay();
            return;
    }

    // If the last operation was an evaluate get the calculator ready for a new operation
    if (evalFlag) {
        runningTotal = currentNumber;
        runningTotalNumber = Number(currentNumber);
        currentNumber = "0";
        evalFlag = !evalFlag;
    }

    // Evaluate (=) is also special, so check it before other operations
    if (operator == "evaluate") {
        // Display entered equation in display and result in currentNumber
        switch (currentOperator) {
            case "multiply":
                runningTotal += currentNumber + " = ";
                currentNumber = multiply(runningTotalNumber, currentNumber);
                runningTotalNumber = Number(currentNumber);
                break;

            case "divide":
                runningTotal += currentNumber + " = ";
                currentNumber = divide(runningTotalNumber, currentNumber);
                // If user divided by zero reset the runningTotalNumber
                if (isNaN(currentNumber)) runningTotalNumber = null;
                else runningTotalNumber = Number(currentNumber);
                break;

            case "add":
                runningTotal += currentNumber + " = ";
                currentNumber = add(runningTotalNumber, currentNumber);
                runningTotalNumber = Number(currentNumber);
                break;

            case "subtract":
                runningTotal += currentNumber + " = ";
                currentNumber = subract(runningTotalNumber, currentNumber);
                runningTotalNumber = Number(currentNumber);
                break;
        }
        updateDisplay();
        if (currentOperator) {
            // Reset the operator to prevent calculations being doubled
            currentOperator = null;
            // Also set the evalFlag because an evaluate (=) was performed
            evalFlag = true;
        }
        return; // Already handled operator, return here
    }

    // Check remaining operators
    if (currentNumber == 0 && !currentOperator) { /* !currentNumber does not work because "0" = true */
        // No number entered into calculator
        currentOperator = operator;
        runningTotal += convertOperator(operator);
    } else {
        // There is a number entered
        if (currentOperator) {
            // Operation queued, perform operation and append new operation
            runningTotalNumber = operate(currentOperator, runningTotalNumber, currentNumber);
            runningTotal = runningTotalNumber + convertOperator(operator);
            currentOperator = operator;
            currentNumber = "0";
        } else if (runningTotalNumber) {
            // No operation queued and there is a running total
            // Perform operation but don't append another one
            runningTotalNumber = operate(operator, runningTotalNumber, currentNumber);
            runningTotal = runningTotalNumber;
            currentNumber = "0";
        } else {
            // No operation queued and no running total
            // Move currentNumber to upper display and append operator
            runningTotalNumber = Number(currentNumber);
            runningTotal = runningTotalNumber + convertOperator(operator);
            currentOperator = operator;
            currentNumber = "0";
        }
    }
    updateDisplay();
}

// Converts the operator to a symbol for the display
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

// Set the runningTotal and the currentNumber to their selective divs
function updateDisplay() {
    const runningTotalDisplay = document.querySelector('#running-total');
    runningTotalDisplay.textContent = runningTotal;

    const currentNumberDisplay = document.querySelector('#current-number');
    currentNumberDisplay.textContent = currentNumber;
}

// Event listeners for operator buttons
const operatorButtons = document.querySelector('.calculator-buttons')
    .querySelectorAll('button.operator-button');
operatorButtons.forEach(button => 
    button.addEventListener('click', () => updateOperator(button.id)));

// Event listeners for number buttons
const numberButtons = document.querySelector('.calculator-buttons')
    .querySelectorAll('.number-button');
numberButtons.forEach(button => 
    button.addEventListener('click', () => updateCurrentNumber(button.textContent)));

// Event listeners for keyboard inputs
document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case "-":
            updateOperator("subtract");
            break;

        case "=":
            updateOperator("evaluate");
            break;

        case "+":
            updateOperator("add");
            break;

        case "*":
            updateOperator("multiply");
            break;

        case "Backspace":
            updateOperator("delete");
            break;

        case "Enter":
            updateOperator("evaluate");
            break;

        case ".":
            updateCurrentNumber(e.key);
            break;

        case "/":
            updateOperator("divide");
            break;

        default:
            // Handle all number inputs
            if (!isNaN(e.key)) updateCurrentNumber(e.key);
            break;
    }
});