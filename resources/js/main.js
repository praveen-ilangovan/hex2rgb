
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

/**
 * Convert Decimal to Hexadecimal
 *
 * @param {int} decValue
 *
 * Returns the Hexadecimal value. Throws an error if its an invalid value.
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
 * Convert Hexadecimal to decimal
 *
 * @param {String} hexValue
 *
 * Returns the decimal value. Throws an error if its an invalid hex value.
 */
function hex2dec(hexValue) {
	let dec = 0;

	for (let i = 0; i < hexValue.length; i++){
		if (!HEX_2_DEC_MAP.hasOwnProperty(hexValue[i])) {
			throw new Error(hexValue[i] + " is not a valid Hex character.");
		}

		dec += (HEX_2_DEC_MAP[hexValue[i]] * Math.pow(16, hexValue.length-i-1));
	}

	return dec;
}

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
function setColor(brightness=1) {
	document.body.className = brightness > 0.5 ? "dark" : "light";
}



// *************************************************************************************
// 
// Color converter
// 
// *************************************************************************************

/**
 * Color converter
 *
 * Accepts RGB color: format {String} => rgb(255, 255, 255);
 * Accepts Hex code: format {String} ==> #fff, fff, #ffffff, ffffff, FFF
 *
 * Converts the RGB to Hex and Hex to RGB
 * Calculates the brightness of the color
 *
 * USAGE:
 *
 * const color = "#fff" or "rgb(255,255,255)";
 * const colObject = new ColorConverter(color);
 * colObject.convert();
 * colObject.rgb returns the color in rgb() format
 * colObject.hex returns the color as hexcode
 * colObject.brightness returns the color's brightness in 0 to 1 scale.
 */

class ColorConverter {

	static RGB_REGEX = /^rgb\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}\)$/g;
	static HEX_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}){1}$/g;
	static TYPE_RGB = "rgb";
	static TYPE_HEX = "hex";

	constructor(color) {
		this.rgb;
		this.hex;
		this.rgbArray;
		this.brightness;
		this.inputType;
		this.output;

		this.validateColor(color);	
	}

	/**
	 * Convert color mode and calculate brightness
	 */
	convert() {
		if (this.inputType === ColorConverter.TYPE_RGB)
			this.convertRGBToHex();
		else
			this.convertHexToRGB();
		this.calculateBrightness();
	}

	/**
	 * Convert RGB to Hex.
	 */
	convertRGBToHex() {
		let tempHex = "";

		for (let value of this.rgbArray) {
			tempHex += dec2hex(value).padStart(2, "0");
		}

		this.hex = "#" + tempHex;
		this.output = this.hex;
	}

	/**
	 * Convert Hex to RGB.
	 */
	convertHexToRGB() {
		let tempRGB = [];

		for (let i = 1; i < 7; i+=2) {
			tempRGB.push(hex2dec( this.hex.slice(i, i+2) ));
		}

		this.rgbArray = tempRGB;
		this.rgb = this.getRGBString();
		this.output = this.rgb;
	}

	/**
	 * Calculate the brightness of the color.
	 */
	calculateBrightness() {
		let rgbF = [];

		for (let value of this.rgbArray) {
			rgbF.push(value/255);
		}

		const cmax = Math.max(rgbF[0], rgbF[1], rgbF[2]);
		const cmin = Math.min(rgbF[0], rgbF[1], rgbF[2]);

		this.brightness = (cmax+cmin)/2;
	}

	/**
	 * Validate the color.
	 *
	 * Validates if the color is a legal rgb value or a hex code
	 */
	validateColor(color) {
		let validated;

		validated = this.validateRGBColor(color);
		if (validated) {
			this.rgbArray = validated;
			this.rgb = this.getRGBString();
			this.inputType = ColorConverter.TYPE_RGB;
			return;
		}

		validated = this.validateHexColor(color);
		if (validated) {
			this.hex = validated;
			this.inputType = ColorConverter.TYPE_HEX;
			return;
		}

		throw new Error("Please provide a valid RGB or a hex color code");
	}

	/**
	 * Validate the color.
	 *
	 * Validates if the color is a legal rgb value or a hex code
	 */
	validateRGBColor(color) {
		if (!color.match(ColorConverter.RGB_REGEX))
			return

		let rgbArray = [];

		let values = color.slice(4, color.length-1).split(",");
		for (let value of values) {
			value = parseInt(value);
			if (value < 0 || value > 255)
				throw new Error("RGB value should be between 0-255");

			rgbArray.push(value);
		}

		return rgbArray;
	}

	/**
	 * Validate the color.
	 *
	 * Validates if the color is a legal rgb value or a hex code
	 */
	validateHexColor(color) {
		if (!color.match(ColorConverter.HEX_REGEX))
			return

		let hexCode = color;
		if (hexCode.length == 3 || hexCode.length == 6)
			hexCode = "#" + hexCode;

		if (hexCode.length == 4)
			hexCode = hexCode + hexCode.slice(1,4);

		return hexCode;
	}

	/**
	 * Format RGB array as a valid RGB string
	 *
	 * Validates if the color is a legal rgb value or a hex code
	 */
	 getRGBString() {
	 	return `rgb(${this.rgbArray[0]},${this.rgbArray[1]},${this.rgbArray[2]})`;
	 }
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

	try {
		const colObject = new ColorConverter(inputField.value);
		colObject.convert();

		color = colObject.output;
		brightness = colObject.brightness;
		value = color;
	}
	catch(err) {
		color = defaultBGColor;
	}

	// Set the bg color;
	setBGColor(color);
	// Set the brightness;
	setColor(brightness);
	// Set the output field;
	outputField.value = value;
}


function inputDetected(e) {
	const outputField = e.target === inputOneField ? inputTwoField : inputOneField;
	convert(e.target, outputField);
}

function inputClicked(e) {
	try {
		const colObject = new ColorConverter(e.target.value);
		if (colObject.inputType === ColorConverter.TYPE_HEX){
			e.target.value = colObject.hex;
		}
	}
	catch(err) {
	}
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

inputOneField.addEventListener("click", inputClicked);
inputTwoField.addEventListener("click", inputClicked);

// *************************************************************************************
// 
// Initializers
// 
// *************************************************************************************

setBGColor(defaultBGColor);
setColor();