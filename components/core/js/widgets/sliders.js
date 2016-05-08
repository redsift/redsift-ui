'use strict';

var style = document.createElement("style");
document.head.appendChild(style);
var sheet = style.sheet

function updateRange(input, index) {
  var min = input.min || 0;
  var max = input.max || 100;

  var v = Math.ceil(((input.value - min) / (max - min)) * 100);
  try {
    sheet.deleteRule(index);
  } 
  catch (e) { }
  sheet.addRule('input[type=range].rs-index-'+index+'::-webkit-slider-runnable-track','background-size:' + v + '% 100%', index);
}

var Sliders = {
	initAllRanges: function() {
		var r = document.querySelectorAll('input[type=range]');
		for (var i = 0; i < r.length; i++) {
			var input = r[i];

			input.className += " rs-index-" + i;
			updateRange(input, i);
			(function(idx) {
				input.addEventListener('input', function() {
					updateRange(this, idx);
				});
			})(i);
		}
  	},
	setValue: function(control, value) {
		control.value = value;
		var r = document.querySelectorAll('input[type=range]');
		for (var i = 0; i < r.length; i++) {
			if (r[i] === control) {
				updateRange(control, i);
			}
		}	
	}
};

if (typeof module !== 'undefined' && module.exports) { module.exports = Sliders; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return Sliders; }); } // AMD
