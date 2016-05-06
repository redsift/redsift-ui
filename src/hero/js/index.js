'use strict'

import tmpl from '../templates/hero.tmpl';

class RedsiftHero extends HTMLElement {
    createdCallback() {
        this.userTmpl = this.innerHTML;
        this.innerHTML = tmpl;

        // NOTE: handle sticky header before caching, as this.$header is set
        // differently depending this feature:
        if (this.stickyHeader) {
            this._enableStickyHeader(true);
        }

        this._cacheElements();

        if (this.header) {
            this._setHeader();
        }

        if (this.bgClass) {
            this._setBgClass();
        }

        if (this.scrollTarget) {
            this._enableScrollFeature(true);
        }

        this.$content.innerHTML = this.userTmpl;
    }

    attachedCallback() {
        // // Specify an anchor link to setup as smooth scroll
        // // As we have a floating header the anchor is wrong due to
        // // the height of the header, hence offset the scroll
        // // Note: this offset dance not work in the case of page load
        var stickyHeader = document.getElementsByClassName('hero-sticky-header'),
            offset = 0;

        if (stickyHeader.length) {
            // If the sticky header is overlapping with the '.content' div the class
            // '.hero-sticky-header--active' is added to the div to allow custom styling
            // when the header is active.
            // Redsift.Scroll.toggleClass('.hero-sticky-header', 'hero-sticky-header--active', '.content');

            offset = stickyHeader[0].getBoundingClientRect().height;
        }
        Redsift.Scroll.initSmooth("#smooth", -offset);
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        if (attributeName === 'scroll-target') {
            if (!newValue && this.$scrollFeature.parentNode) {
                this._enableScrollFeature(false);
            }

            if (newValue && !oldValue) {
                this._enableScrollFeature(true);
            }
        }

        if (attributeName === 'sticky-header') {
            let added = ( (newValue == '' || newValue) && !oldValue ) ? true : false;

            if (added) {
                this._enableStickyHeader(true);
            } else {
                this._enableStickyHeader(false);
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
        return this.getAttribute('scroll-target')
    }

    set scrollTarget(val) {
        return this.setAttribute('scroll-target', val);
    }

    //----------------------------------------------------------
    // Internal API:
    //----------------------------------------------------------
    _cacheElements() {
        this.$hero = document.querySelector('.hero');
        if (this.stickyHeader) {
            this.$header = document.querySelector('.hero-sticky-header');
        } else {
            this.$header = document.querySelector('.hero__header');
        }
        this.$headerContent = document.querySelector('.hero__header__content');
        this.$container = document.querySelector('.hero__container');
        this.$content = document.querySelector('.hero__content');
        this.$scrollFeature = undefined;
    }

    _setHeader() {
        this.$headerContent.innerHTML = this.header;
    }

    _setBgClass() {
        this.$hero.className += ` ${this.bgClass}`;
    }

    _createScrollFeatureElement(scrollTarget) {
        let a = document.createElement('a'),
            offset = 0;

        a.id = 'smooth';
        a.href = scrollTarget;
        a.innerHTML = '<div class="down-arrow"></div>';

        if (this.stickyHeader) {
            offset = this.$header.getBoundingClientRect().height;
        }
        // Redsift.Scroll.initSmooth('#smooth', -200);

        return a;
    }

    _enableStickyHeader(flag) {
        // NOTE: Do NOT use cached element here. For the first run these elements
        // are only cached after this feature is handled!

        if (flag) {
            let $header = document.querySelector('.hero__header'),
                $hero = document.querySelector('.hero');

            if ($header) {
                $header.classList.toggle('hero__header');
                $header.classList.toggle('hero-sticky-header');
                $hero.parentNode.parentNode.appendChild($header);
            }
        } else {
            let $header = document.querySelector('.hero-sticky-header'),
                $hero = document.querySelector('.hero');

            if ($header) {
                $header.classList.toggle('hero__header');
                $header.classList.toggle('hero-sticky-header');
                $hero.insertBefore($header, $hero.firstChild);
            }
        }
    }

    _enableScrollFeature(flag) {
        if (flag) {
            let scrollTarget = this.scrollTarget;
            this.$scrollFeature = this._createScrollFeatureElement(scrollTarget);
            this.$container.appendChild(this.$scrollFeature);
        } else if (this.$scrollFeature && this.$scrollFeature.parentNode) {
            this.$scrollFeature.parentNode.removeChild(this.$scrollFeature);
        }
    }
}

export default () => {
    document.registerElement('rs-hero', RedsiftHero);
}
