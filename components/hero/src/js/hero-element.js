'use strict'

import RedsiftHero from './hero.js';

class RedsiftHeroWebComponent extends HTMLElement {

  //----------------------------------------------------------------------------
  // Lifecycle:
  //----------------------------------------------------------------------------

  createdCallback() {
    this.rsHero = new RedsiftHero(this, {
      stickyHeader: this.stickyHeader,
      header: this.header,
      bgClass: this.bgClass,
      scrollTarget: this.scrollTarget
    });
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === 'scroll-target') {
      if (!newValue) {
        this.rsHero.enableScrollFeature(false);
      }

      if (newValue && !oldValue) {
        this.rsHero.enableScrollFeature(true, this.scrollTarget);
      }
    }

    if (attributeName === 'sticky-header') {
      let added = ((newValue == '' || newValue) && !oldValue) ? true : false;

      if (added) {
        this.rsHero.enableStickyHeader(true);
      } else {
        this.rsHero.enableStickyHeader(false);
      }
    }
  }

  //----------------------------------------------------------------------------
  // Attributes:
  //----------------------------------------------------------------------------

  get header() {
    return this.getAttribute('header');
  }

  set header(val) {
    this.setAttribute('header', val);
  }

  get bgClass() {
    return this.getAttribute('bg-class');
  }

  set bgClass(val) {
    this.setAttribute('bg-class', val);
  }

  get stickyHeader() {
    let a = this.getAttribute('sticky-header');
    if (a == '' || a) {
      return true;
    }

    return false;
  }

  set stickyHeader(val) {
    return this.setAttribute('sticky-header', val);
  }

  get scrollTarget() {
    return this.getAttribute('scroll-target');
  }

  set scrollTarget(val) {
    return this.setAttribute('scroll-target', val);
  }
}

export default () => {
    try {
        document.registerElement('rs-hero', RedsiftHeroWebComponent);
    } catch (e) {
        console.log('[redsift-ui] Element already exists: ', e);
    }
}
