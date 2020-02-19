const btnNumber = [
	'7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
	'.'];
const btnNumberZero = '0';
const btnEqualsSign = '=';
const btnMathSymbols = [
	'(', ')', '%', 'C', '←', '÷', 'x²', '×', '√', '-', '+' ];
let calculator = document.getElementById('calculator');
let buttons = document.getElementById('buttons');
let num = document.getElementById('btn-number');
let mathSymbols = document.getElementById('btn-mathSymbols')

btnMathSymbols.forEach(function (sign) {
	assignmentOfButtons(sign, 'btn-mathSymbols', buttons);
});
btnNumber.forEach(function (sign) {
	assignmentOfButtons(sign, 'btn-number', num);
});
assignmentOfButtons(btnNumberZero, 'btn-number-zero', num);
assignmentOfButtons(btnEqualsSign, 'btn-equals', buttons);

function assignmentOfButtons(sign, classBtn, sectionBtn) {
	let signElement = document.createElement('button'); //добавляем тег button
	signElement.classList.add('btn', classBtn);           //добавляем классы для тега 
	signElement.textContent = sign;						//добавляем содержание тега
	sectionBtn.appendChild(signElement);					//добавляем этот тег в section
}

document.querySelectorAll('#buttons .btn').forEach(function (button) {
	button.addEventListener('click', clickButton, false);
});

let screen = document.getElementById('answer')

let k = [];
let i = 0;
let numberBrackets = -1;
let startBrackets = [];

function clickButton(e) {
	if (screen.value === '') {
		if (e.target.classList.contains('btn-number')) {
			if (e.target.textContent === '.') {
				screen.value = '0.';
				k[i] = '0.'
			} else {
				k[i] = e.target.textContent;
				screen.value = k[i];
			}
		} else {
			switch (e.target.textContent) {
				case '+':
				case '-':
				case '×':
				case '÷':
					screen.value = '0' + e.target.textContent;
					k[i] = 0;
					i++;
					k[i] = e.target.textContent;
					break;

				case '(':
					screen.value = e.target.textContent;
					k[i] = e.target.textContent;
					numberBrackets++;
					startBrackets.push(i);
					break;

				case '√':
					screen.value = e.target.textContent;
					k[i] = e.target.textContent;
					break;

				case 'x²':
					screen.value = '0²';
					k[i] = 0;
					i--;
					break;

				case '%':
					screen.value = '0' + e.target.textContent;
					k[i] = 0;
					break;

				case ')':
					break;
			}
			i++;
		}
	} else {
		if (e.target.classList.contains('btn-number')) {
			if (k[i] === undefined) {
				if (e.target.textContent === '.') {
					k[i] = 0 + e.target.textContent;
					screen.value += '0.';
				} else {
					k[i] = e.target.textContent;
					screen.value += e.target.textContent;
				}
			} else {
				k[i] += e.target.textContent;
				screen.value += e.target.textContent;
			}		
		} else {
			switch (e.target.textContent) {
				case '+':
				case '-':
				case '×':
				case '÷':
					screen.value += e.target.textContent;
					i++;
					k[i] = e.target.textContent;
					i++;
					break;
				
				case '=':
					toCount();
					break;

				case '(':
					numberBrackets++;
					startBrackets.push(i);
					screen.value += e.target.textContent;
					k[i] = e.target.textContent;
					i++;
					break;

				case ')':
					screen.value += e.target.textContent;
					i++;
					k[i] = ')';
					break;

				case '←':
					if ((k[i] === '') || (k[i] === undefined)) {
						k = k.slice(0, -1);
						screen.value = screen.value.slice(0, -1);
						i = i - 2;
					} else {
						k[i] = k[i].slice(0, -1);
						screen.value = screen.value.slice(0, -1);
					}
					break;

				case 'C':
					screen.value = '';
					k = [];
					i = 0;
					numberBrackets = -1;
					startBrackets = [];
					break;

				case '√':
					screen.value += e.target.textContent;
					k[i] = e.target.textContent;
					i++;
					break;

				case 'x²':
					screen.value += '²';
					k[i] = k[i] * k[i];
					break;

				case '%':
					screen.value += e.target.textContent;
					k[i] = k[i] * 0.01;
					i++;
					break;
			}
		}
	}
}

let example = document.getElementById('example');

function toCount() {
	let sourceExample = k;
	example.textContent = sourceExample.join(' ');
	while (numberBrackets >= 0) {
		let numberOfValues = 0;
		for (let j = startBrackets[numberBrackets]; j < k.length; j++) {
			numberOfValues++;
			if (k[j] === ')') {
				let exampleInBrackets = k.slice(startBrackets[numberBrackets] + 1, j);
				k.splice(startBrackets[numberBrackets], numberOfValues, count(exampleInBrackets));
				numberBrackets--;
			}
		}
	}
	k = count(k)
	screen.value = k;
	i = 0;
	
}

function count(ex) {
	for (let j = 0; j < ex.length; j++) {
		if (ex[j] === '√') {
			let sqR;
			sqR = Math.sqrt(ex[j+1]);
			ex.splice(j, 2, sqR);
		}
	}
	for (let j = 0; j < ex.length; j++) {
		switch (ex[j]) {
			case '×':
				if ((ex[j-1] !== '(') & (ex[j+1] !== '(') & (ex[j-1] !== ')') & (ex[j+1] !== ')')) {
					b = ex[j-1] * ex[j+1];
					ex.splice(j-1, 3, b);
					j--;
				}
				break;
				
			case '÷':
				if ((ex[j-1] !== '(') & (ex[j+1] !== '(') & (ex[j-1] !== ')') & (ex[j+1] !== ')')) {
					b = ex[j-1] / ex[j+1];
					ex.splice(j-1, 3, b);
					j--;
				}
				break;
		}
	}
	for (let j = 0; j < ex.length; j++) {
		switch (ex[j]) {				
			case '+':
				if ((ex[j-1] !== '(') & (ex[j+1] !== '(') & (ex[j-1] !== ')') & (ex[j+1] !== ')')) {
					b = ex[j-1] *1 + ex[j+1] * 1;
					ex.splice(j-1, 3, b);
					j--;
				}
				break;
				
			case '-':
				if ((ex[j-1] !== '(') & (ex[j+1] !== '(') & (ex[j-1] !== ')') & (ex[j+1] !== ')')) {
					b = ex[j-1] - ex[j+1];
					ex.splice(j-1, 3, b);
					j--;
				}
				break;
		}
	}
	return ex;
}

function loading() {
	let numberInput;
	numberInput = document.getElementById('answer');
	numberInput.focus();
}

window.addEventListener('load', loading, false);