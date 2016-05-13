'use strict'

import RedsiftSchedule from './schedule.js';

class RedsiftScheduleElement extends HTMLElement {
  createdCallback() {
    this.rsSchedule = new RedsiftSchedule(this);
  }

  //----------------------------------------------------------
  // Attributes:
  //----------------------------------------------------------
  get eventHeight() {
    return this.getAttribute('eventHeight');
  }

  set eventHeight(val) {
    this.setAttribute('eventHeight',val);
  }

  get eventPadding() {
    return this.getAttribute('eventPadding');
  }

  set eventPadding(val) {
    this.setAttribute('eventPadding',val);
  }

  get width() {
    return this.getAttribute('width');
  }

  set width(val) {
    this.setAttribute('width',val);
  }

  get data() {
    let a = this.getAttribute('data');
    return a ? JSON.parse(a) : [];
  }

  set data(val) {
    this.setAttribute('data', JSON.stringify(val));

    let width = this.width || 400;
    this.rsSchedule.update(val, width);
  }
}

export default () => {
    try {
      document.registerElement('rs-schedule', RedsiftScheduleElement);
    } catch (e) {
        console.log('[redsift-ui] Element already exists: ', e);
    }
}
