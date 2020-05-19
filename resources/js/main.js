
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

/**
 * Set the title color
 *
 * @param {String} brghtness
 */
function setTitleColor(brightness=1) {
	pageTitle.style.color = brightness > 0.5 ? titleColor : "white";
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

	return {"color" : `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`,
			"brightness" : getBrightness(rgb)};
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

/**
 * Converts RGB string to RGB int
 * 
 * @param {String} rgbValue
 *
 * Returns an array of three ints
 */
function rgbStrToInt(rgbValue) {
	let rgbArray = [];

	if (!rgbValue.startsWith("rgb(") || !rgbValue.endsWith(")"))
		throw new Error("Invalid RGB value");

	let values = rgbValue.slice(4, rgbValue.length-1).split(",");
	if (values.length !== 3)
		throw new Error("RGB needs three values.");

	for (let value of values) {
		value = parseInt(value);
		if (value < 0 || value > 255)
			throw new Error("RGB value should be between 0-255");

		rgbArray.push(value);
	}

	return rgbArray;
}

/**
 * Converts RGB code to Hex color
 * 
 * @param {String} rgbValue
 *
 * Returns a hex color code.
 */
function rgb2hex(rgbValue) {
	let hex = "";
	let rgb = rgbStrToInt(rgbValue);

	for (let value of rgb) {
		hex += dec2hex(value).padStart(2, "0");
	}

	return {"color" : "#" + hex,
			"brightness" : getBrightness(rgb)};
}

// *************************************************************************************
// 
// Calculate the brightness of a color
// 
// *************************************************************************************

function getBrightness(rgb) {
	let rgbF = [];

	for (let value of rgb) {
		rgbF.push(value/255);
	}

	const cmax = Math.max(rgbF[0], rgbF[1], rgbF[2]);
	const cmin = Math.min(rgbF[0], rgbF[1], rgbF[2]);

	return (cmax+cmin)/2;
}


// *************************************************************************************
// 
// Events
// 
// *************************************************************************************

function convert(inputField, outputField) {
	let color;
	let brightness = 1;
	let value = "";

	// Find the right method to call.
	// If the value starts with rgb(, call rgb2hex converter
	let funcToCall = inputField.value.startsWith("rgb(") ? rgb2hex : hex2rgb

	try {
		let result = funcToCall(inputField.value);

		color = result.color;
		brightness = result.brightness;
		value = color;
	}
	catch(err) {
		color = defaultBGColor;
	}

	// Set the bg color;
	setBGColor(color);
	// Set the brightness;
	setTitleColor(brightness);
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

const titleColor = "#222222";
const defaultBGColor = "#ffd454";

const pageTitle = document.getElementById("pageTitle");
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
setTitleColor();