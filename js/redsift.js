
var ColorTools = require('./color/color.js');
var D3 = require('./d3/d3.js');
var Lang = require('./lang/lang.js');
var Timing = require('./timing/now.js');
var TreoWriter = require('./treo-writer/db.js');
var Widgets = require('./widgets/widgets.js');
var Scroll = require('./scroll/smooth.js');
var Xkcd = require('./xkcd/xkcd.js');

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
	ui.Widgets = Widgets;
	ui.Scroll = Scroll;
    ui.Xkcd = Xkcd;
    
	window.Redsift = ui;
}