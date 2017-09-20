
(function () {

	'use strict';

	const colors = require('./colorMap.json');
	const foreground = colors.foreground;
	const background = colors.background;

	// A simple javascript solution to bring colors to the console.

	function funkyLogger() {

		this.color = function (color, text) {
			if (foreground[color]) {
				return ('\x1b[' + foreground[color] + 'm' + text + '\x1b[' + foreground.normal + 'm');
			} else {
				return (text);
			}
		}

		this.bgColor = function (color, text) {
			if (background[color]) {
				return ('\x1b[' + background[color] + 'm' + text + '\x1b[' + background.normal + 'm');
			} else {
				return (text);
			}
		}

	}

	module.exports = funkyLogger;

}());	
