
// *************************************************************************************
// 
// Conversion Tables
// 
// *************************************************************************************

/**
 * Valid hex values
 */
const HEX_2_DEC_MAP = {
	"0" : 0,
	"1" : 1,
	"2" : 2,
	"3" : 3,
	"4" : 4,
	"5" : 5,
	"6" : 6,
	"7" : 7,
	"8" : 8,
	"9" : 9,
	"A" : 10,
	"B" : 11,
	"C" : 12,
	"D" : 13,
	"E" : 14,
	"F" : 15,
	"a" : 10,
	"b" : 11,
	"c" : 12,
	"d" : 13,
	"e" : 14,
	"f" : 15
};

/**
 * Valid dec values
 */
const DEC_2_HEX_MAP = {
	0 : "0",
	1 : "1",
	2 : "2",
	3 : "3",
	4 : "4",
	5 : "5",
	6 : "6",
	7 : "7",
	8 : "8",
	9 : "9",
	10 : "A",
	11 : "B",
	12 : "C",
	13 : "D",
	14 : "E",
	15 : "F"
};

// *************************************************************************************
// 
// Functions
// 
// *************************************************************************************


/**
 * Set the background color of the body
 *
 * @param {String} color
 */
function setBGColor(color) {
	document.body.style.backgroundColor = color;
}


// *************************************************************************************
// 
// Hex to RGB
// 
// *************************************************************************************

/**
 * Convert Hexadecimal to decimal
 *
 * @param {String} hexValue
 *
 * Returns the decimal value.Throws an error if its an invalid hex value.
 */
function hex2dec(hexValue) {
	let dec = 0;

	for (let i = 0; i < hexValue.length; i++){
		if (!HEX_2_DEC_MAP.hasOwnProperty(hexValue[i])) {
			throw new Error("Invalid Hex character");
		}

		dec += (HEX_2_DEC_MAP[hexValue[i]] * Math.pow(16, hexValue.length-i-1));
	}

	return dec;
}

/**
 * Converts Hex code to RGB color
 * 
 * @param {String} hexValue
 *
 * Returns an array of three values
 */
function hex2rgb(hexValue) {
	// Remove the hash if its there
	const value = hexValue[0] === "#" ? hexValue.slice(1,hexValue.length) : hexValue;
	let hex = [];
	let rgb = [];

	// Check if it has the right length
	if (value.length === 3) {
		hex.push(value[0] + value[0]);
		hex.push(value[1] + value[1]);
		hex.push(value[2] + value[2]);
	}
	else if(value.length === 6) {
		hex.push(value[0] + value[1]);
		hex.push(value[2] + value[3]);
		hex.push(value[4] + value[5]);
	}
	else
		throw new Error("Invalid hex length");

	for (const i of hex)
		rgb.push(hex2dec(i));

	return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}


// *************************************************************************************
// 
// RGB to Hex
// 
// *************************************************************************************

/**
 * Convert Decimal to Hexadecimal
 *
 * @param {int} decValue
 *
 * Returns the Hexadecimal value.Throws an error if its an invalid value.
 */
function dec2hex(decValue) {
	let hex = "";
	let value = decValue;
	let quotient;

	while (true) {
		quotient = Math.floor(value / 16);
		hex = DEC_2_HEX_MAP[(value % 16).toString()] + hex;
		if (quotient === 0)
			break
		value = quotient;
	}

	return hex;
}


// *************************************************************************************
// 
// Events
// 
// *************************************************************************************

function convert(inputField, outputField) {
	let color;
	let value = "";

	try {
		color = hex2rgb(inputField.value);
		value = color;
	}
	catch(err) {
		color = defaultBGColor;
	}

	// Set the bg color;
	setBGColor(color);
	// Set the output field;
	outputField.value = value;
}


function inputDetected(e) {
	const outputField = e.target === inputOneField ? inputTwoField : inputOneField;
	convert(e.target, outputField);
}

// *************************************************************************************
// 
// Get the elements by Id and store them in variables.
// 
// *************************************************************************************

const defaultBGColor = "#ffd454";

const inputOneField = document.getElementById("inputOne");
const inputTwoField = document.getElementById("inputTwo");

// *************************************************************************************
// 
// Register Event handlers
// 
// *************************************************************************************

inputOneField.addEventListener("input", inputDetected);
inputTwoField.addEventListener("input", inputDetected);


// *************************************************************************************
// 
// Initializers
// 
// *************************************************************************************

setBGColor(defaultBGColor);

// *************************************************************************************
// 
// Test
// 
// *************************************************************************************

for (let i of [35632, 7562])
	console.log(i, dec2hex(35631));