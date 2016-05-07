'use strict'

import RedsiftHero from './lib.js';
import tmpl from '../templates/hero.tmpl';

class RedsiftHeroWebComponent extends HTMLElement {

  //----------------------------------------------------------
  // Lifecycle:
  //----------------------------------------------------------

  createdCallback() {
    this.rsHero = new RedsiftHero();

    this.userTmpl = this.innerHTML;
    this.innerHTML = tmpl;

    // NOTE: handle sticky header before caching, as this.$header is set
    // differently depending this feature:
    if (this.stickyHeader) {
      this.rsHero.enableStickyHeader(true);
    }

    this.rsHero.cacheElements(this.stickyHeader);

    if (this.header) {
      this.rsHero.setHeader(this.header);
    }

    if (this.bgClass) {
      this.rsHero.setBgClass(this.bgClass);
    }

    if (this.scrollTarget) {
      this.rsHero.enableScrollFeature(true, this.scrollTarget);
    }

    this.rsHero.setContent(this.userTmpl);
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

  //----------------------------------------------------------
  // Attributes:
  //----------------------------------------------------------

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
  document.registerElement('rs-hero', RedsiftHeroWebComponent);
}
