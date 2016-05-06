'use strict'

import styles from '../styles/styles.styl';

class RedsiftRadialChart extends HTMLElement {
  attachedCallback() {
    this.chart = this.querySelector('#chart');
    this.legend = this.querySelector('#legend');
    this._createInlineStyles();
  }

  //----------------------------------------------------------
  // Attributes:
  //----------------------------------------------------------
  get segments() {
    let a = this.getAttribute('segments');
    return a ? JSON.parse(a) : [];
  }

  set segments(val) {
    this.setAttribute('segments', JSON.stringify(val));
  }

  get data() {
    let a = this.getAttribute('data');
    return a ? JSON.parse(a) : [];
  }

  set data(val) {
    this.setAttribute('data', JSON.stringify(val));

    if (!this.segments) {
      throw Error('Please define segments first!');
    }
    this._update()
  }

  //----------------------------------------------------------
  // Internal API
  //----------------------------------------------------------
  _createInlineStyles() {
    // generate some styles
    var css = Redsift.D3.Tools.createCSSRuleSheet();
    css('.d3-rc .band circle', 'stroke: ' + this.BAND + ';', 0);
    css('.d3-rc .segment-bg', 'fill:' + this.SEGMENT_BG + ';', 0);

    // generate some patterns
    var P_A = 45;
    var P_X = 3;
    var P_Y = 4;
    var P_S = 5;

    var defs = Redsift.D3.Tools.createDefs();
    Redsift.D3.Tools.createDiagonal(defs, 'pattern-stripe', P_A, P_X, P_Y, P_S);
    Redsift.D3.Tools.createMask(defs, 'mask-stripe', 'url(#pattern-stripe)');
    Redsift.D3.Tools.createShadowFilter(defs, 'text-bg', 1.0, 'rgba(230,230,230,0.25)', 2.5);
  }

  _createLegend() {
    // create legend
    var legend = Redsift.D3.Reusable.legendChart().width(400).sample(20);
    d3.select(this.legend).datum(this.themes).call(legend);
  }

  _update() {
    // start knobs
    var SEGMENTS = this.SEGMENTS = ["#edf8b1", "#7fcdbb", "#2c7fb8"];
    var SEGMENT_BG = this.SEGMENT_BG = "#FFDE00";
    var BAND = this.BAND = "#7fcdbb";
    // end knobs
    var STRIPE_CLASS = "stripe";
    this.themes = [{
      color: SEGMENTS,
      title: 'Segments (range)'
    }, {
      color: SEGMENTS,
      title: 'Segments (range), knockback',
      classed: STRIPE_CLASS
    }, {
      color: SEGMENT_BG,
      title: 'Segment background'
    }, {
      color: BAND,
      title: 'Average Band'
    }];

    // this._createInlineStyles();
    this._createLegend();

    var fmt = d3.format(",.0f");
    var total = this.data.reduce(function(p, d) {
      return p + d.value
    }, 0);
    var avg = total / this.data.length;
    var dataBand = "£" + fmt(avg) + "/m";

    var max = d3.max(this.data.concat(this.data), function(d) {
      return d.value;
    });

    var color = d3.scale.linear()
      .domain([0, (max / 2), max])
      .range(this.SEGMENTS);

    // present the charts on the nodes
    var radialChart = Redsift.D3.Reusable.radialChart;
    var delay = 50;
    var chart1 = radialChart()
      .width(400)
      .prefix('£')
      .band(avg, this.dataBand, -3)
      .animationSegmentDelay(delay)
      .animationEnd(function() {
        d3.select('#one-label').classed('hidden', false);
      });

    d3.select(this.chart).datum(this.data).call(chart1);

    var count = 0;
    setInterval(function() {
      var dataUp = _dummyData((Math.random() * 400) + 20);
      var max = d3.max(dataUp, function(d) {
        return d.value;
      });
      count++;
      var avg = (max / 2) + (Math.random() * 20) - 10;
      chart1.band(avg, '#' + count + ', £' + fmt(avg), -3);

      d3.select(this.chart).datum(dataUp).call(chart1);
    }.bind(this), 2500);
  }
}

export default () => { document.registerElement('rs-radial-chart', RedsiftRadialChart); }
