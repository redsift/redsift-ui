'use strict'

import RedsiftRadialChart from './radial-chart.js';

class RedsiftRadialChartElement extends HTMLElement {
  createdCallback() {
    this.rsRadialChart = new RedsiftRadialChart(this);
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
    this.rsRadialChart.update(val);
  }
}

export default () => {
  document.registerElement('rs-radial-chart', RedsiftRadialChartElement);
}
