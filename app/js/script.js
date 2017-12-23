let buffer = [];
let result = 0;
let tempSum = [];

const buttons = document.querySelectorAll(".button");
const output = document.querySelector('.output');
buttons.forEach(button => button.addEventListener("click", handleButtonPress));

function toggleOperator(currentButton) {
	currentButton.classList.toggle('selected');
}
function toggleOffAllOperators() {
	buttons.forEach(button => {
		if (button.classList.contains('selected')) {
			toggleOperator(button);
		}
	});
}
function handleOperator(currentButton) {								//Solve intermediate sum
	const lastItemInTempSum = tempSum[tempSum.length-1]; 	//Check to see if two operators are present and remove the first if that's the case
	if (lastItemInTempSum === '*' || lastItemInTempSum === '+' || lastItemInTempSum === '-' || lastItemInTempSum === '/') {
		tempSum.pop();
	} else {
		tempSum.push(getResult());
	}
	tempSum.push(currentButton.dataset.value);
	clearBuffer();
}

function bufferJoined() {
	return buffer.join("");
}
function resetBuffer() {
	clearBuffer();
	buffer.push(result);
}
function clearBuffer() {
	buffer.length = 0;
}

function tooMuchData() {
	buffer = ['Err'];
	updateOutput();
}

function updateOutput(data) {
	console.log(`updateOutput(${data}) fired.  typeof data = ${typeof data}`);
	if (data) {
		if (data === 'exception') {
			data = '0';
			result = '';
		}
		output.innerHTML = data;
	} else {
		output.innerHTML = bufferJoined();
	}
}

function getResult() {
	console.log(`getResult() fired, ${tempSum.join("") + bufferJoined()}`);
	result = eval(tempSum.join("") + bufferJoined());
	result = result ? result : 'exception';									//If result undefined, reset to 0 (If user immediately presses '=' for example);
	console.log(`getResult() returns ${result}`);
	console.log('result.length: ' + result.length);
	if (String(result).replace('.', '').length > 10 || result == 'Infinity') {
		tooMuchData();
	} else {
		buffer = [result];
		return result;
	}
}

function handleButtonPress(e) {
	if (e.path[0].dataset.value === "res") {								//User presses '='
		if (buffer.length === 0) {											//If user has pressed '=' after 'C' (will return buffer + 0)
			buffer.push(0);
		}
		if (tempSum[0] === 'exception') {									//If user has pressed 'CE' and then immediately pressed operator button...
			tempSum.shift();												//...will remove 'exception' and add '0'
			tempSum.unshift('0');
		}
		toggleOffAllOperators();
		updateOutput(getResult());
		resetBuffer();
		tempSum.length = 0;
	} else if (e.path[0].dataset.value === "ce") { 							//Clear current input - remove from buffer and update output to be empty
		buffer.length = 0;
		updateOutput();
	} else if (e.path[0].dataset.value === "c") {							//Clear everything. Remove from buffer, tempSum, result and update output to zero. Remove active operator class
		buffer.length = 0;
		tempSum.length = 0;
		result = 0;
		toggleOffAllOperators();
		updateOutput('0');
	} else if (e.path[0].classList.contains('operator')) {  				//Check if operator and add class
		toggleOffAllOperators();
		toggleOperator(e.path[0]);
		handleOperator(e.path[0]);
	}
	else {
		if (buffer.length > 10 || buffer[0]==='Err' || buffer[0]=='Infinity') {
			tooMuchData();
		} else {
			buffer.push(e.path[0].dataset.value);
			updateOutput();
		}
	}
}
