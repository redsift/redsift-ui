
var ColorTools = require('./color/color.js');
var D3 = require('./d3/d3.js');
var Lang = require('./lang/lang.js');
var Timing = require('./timing/now.js');
var TreoWriter = require('./treo-writer/db.js');

if (window !== undefined) {
	var ui = { };
	
	if (window.Redsift !== undefined) {
		ui = window.Redsift;
	}
	
	ui.ColorTools = ColorTools;
	ui.D3 = D3;
	ui.Lang = Lang;
	ui.Timing = Timing;
	ui.TreoWriter = TreoWriter;
		
	window.Redsift = ui;
}