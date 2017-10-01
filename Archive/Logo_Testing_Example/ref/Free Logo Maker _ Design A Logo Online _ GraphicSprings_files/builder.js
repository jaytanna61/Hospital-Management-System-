// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());;/**
 * innerHTML property for SVGElement
 * Copyright(c) 2010, Jeff Schiller
 *
 * Licensed under the Apache License, Version 2
 *
 * Works in a SVG document in Chrome 6+, Safari 5+, Firefox 4+ and IE9+.
 * Works in a HTML5 document in Chrome 7+, Firefox 4+ and IE9+.
 * Does not work in Opera since it doesn't support the SVGElement interface yet.
 *
 * I haven't decided on the best name for this property - thus the duplication.
 */

(function () {
    var serializeXML = function (node, output) {
        var nodeType = node.nodeType;
        if (nodeType == 3) { // TEXT nodes.
            // Replace special XML characters with their entities.
            output.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'));
        } else if (nodeType == 1) { // ELEMENT nodes.
            // Serialize Element nodes.
            output.push('<', node.tagName);
            if (node.hasAttributes()) {
                var attrMap = node.attributes;
                for (var i = 0, len = attrMap.length; i < len; ++i) {
                    var attrNode = attrMap.item(i);
                    output.push(' ', attrNode.name, '=\'', attrNode.value, '\'');
                }
            }
            if (node.hasChildNodes()) {
                output.push('>');
                var childNodes = node.childNodes;
                for (var i = 0, len = childNodes.length; i < len; ++i) {
                    serializeXML(childNodes.item(i), output);
                }
                output.push('</', node.tagName, '>');
            } else {
                output.push('/>');
            }
        } else if (nodeType == 8) {
            // TODO(codedread): Replace special characters with XML entities?
            output.push('<!--', node.nodeValue, '-->');
        } else {
            // TODO: Handle CDATA nodes.
            // TODO: Handle ENTITY nodes.
            // TODO: Handle DOCUMENT nodes.
            throw 'Error serializing XML. Unhandled node of type: ' + nodeType;
        }
    };

    // The innerHTML DOM property for SVGElement.
    Object.defineProperty(SVGElement.prototype, 'innerHTML', {
        get: function () {
            var output = [];
            var childNode = this.firstChild;
            while (childNode) {
                serializeXML(childNode, output);
                childNode = childNode.nextSibling;
            }
            return output.join('');
        },
        set: function (markupText) {
            // Wipe out the current contents of the element.
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }

            try {
                // Parse the markup into valid nodes.
                var dXML = new DOMParser();
                dXML.async = false;

                // Wrap the markup into a SVG node to ensure parsing works.
                var sXML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
                        + markupText
                        + '</svg>'
                    ;
                var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement;

                // Now take each node, import it and append to this element.
                var childNode = svgDocElement.firstChild;
                while (childNode) {
                    // _html = _html + this.ownerDocument.importNode(childNode, true).innerHTML;
                    this.appendChild(this.ownerDocument.importNode(childNode, true));
                    childNode = childNode.nextSibling;
                }
            } catch (e) {
                throw new Error('Error parsing XML string');
            }
        }
    });

    // The innerSVG DOM property for SVGElement.
    Object.defineProperty(SVGElement.prototype, 'innerSVG', {
        get: function () {
            return this.innerHTML;
        },
        set: function (markupText) {
            this.innerHTML = markupText;
        }
    });
}());
;/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/
!function(a,b){"object"==typeof exports&&exports?b(exports):"function"==typeof define&&define.amd?define(["exports"],b):b(a.Mustache={})}(this,function(a){function d(a){return"function"==typeof a}function e(a){return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function g(a,b){return f.call(a,b)}function i(a){return!g(h,a)}function k(a){return String(a).replace(/[&<>"'\/]/g,function(a){return j[a]})}function q(b,d){function q(){if(j&&!k)for(;h.length;)delete g[h.pop()];else h=[];j=!1,k=!1}function x(a){if("string"==typeof a&&(a=a.split(m,2)),!c(a)||2!==a.length)throw new Error("Invalid tags: "+a);u=new RegExp(e(a[0])+"\\s*"),v=new RegExp("\\s*"+e(a[1])),w=new RegExp("\\s*"+e("}"+a[1]))}if(!b)return[];var u,v,w,f=[],g=[],h=[],j=!1,k=!1;x(d||a.tags);for(var z,A,B,C,D,E,y=new t(b);!y.eos();){if(z=y.pos,B=y.scanUntil(u))for(var F=0,G=B.length;G>F;++F)C=B.charAt(F),i(C)?h.push(g.length):k=!0,g.push(["text",C,z,z+1]),z+=1,"\n"===C&&q();if(!y.scan(u))break;if(j=!0,A=y.scan(p)||"name",y.scan(l),"="===A?(B=y.scanUntil(n),y.scan(n),y.scanUntil(v)):"{"===A?(B=y.scanUntil(w),y.scan(o),y.scanUntil(v),A="&"):B=y.scanUntil(v),!y.scan(v))throw new Error("Unclosed tag at "+y.pos);if(D=[A,B,z,y.pos],g.push(D),"#"===A||"^"===A)f.push(D);else if("/"===A){if(E=f.pop(),!E)throw new Error('Unopened section "'+B+'" at '+z);if(E[1]!==B)throw new Error('Unclosed section "'+E[1]+'" at '+z)}else"name"===A||"{"===A||"&"===A?k=!0:"="===A&&x(B)}if(E=f.pop())throw new Error('Unclosed section "'+E[1]+'" at '+y.pos);return s(r(g))}function r(a){for(var c,d,b=[],e=0,f=a.length;f>e;++e)c=a[e],c&&("text"===c[0]&&d&&"text"===d[0]?(d[1]+=c[1],d[3]=c[3]):(b.push(c),d=c));return b}function s(a){for(var e,f,b=[],c=b,d=[],g=0,h=a.length;h>g;++g)switch(e=a[g],e[0]){case"#":case"^":c.push(e),d.push(e),c=e[4]=[];break;case"/":f=d.pop(),f[5]=e[2],c=d.length>0?d[d.length-1][4]:b;break;default:c.push(e)}return b}function t(a){this.string=a,this.tail=a,this.pos=0}function u(a,b){this.view=null==a?{}:a,this.cache={".":this.view},this.parent=b}function v(){this.cache={}}var b=Object.prototype.toString,c=Array.isArray||function(a){return"[object Array]"===b.call(a)},f=RegExp.prototype.test,h=/\S/,j={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},l=/\s*/,m=/\s+/,n=/\s*=/,o=/\s*\}/,p=/#|\^|\/|>|\{|&|=|!/;t.prototype.eos=function(){return""===this.tail},t.prototype.scan=function(a){var b=this.tail.match(a);if(!b||0!==b.index)return"";var c=b[0];return this.tail=this.tail.substring(c.length),this.pos+=c.length,c},t.prototype.scanUntil=function(a){var c,b=this.tail.search(a);switch(b){case-1:c=this.tail,this.tail="";break;case 0:c="";break;default:c=this.tail.substring(0,b),this.tail=this.tail.substring(b)}return this.pos+=c.length,c},u.prototype.push=function(a){return new u(a,this)},u.prototype.lookup=function(a){var c,b=this.cache;if(a in b)c=b[a];else{for(var f,g,e=this;e;){if(a.indexOf(".")>0)for(c=e.view,f=a.split("."),g=0;null!=c&&g<f.length;)c=c[f[g++]];else c=e.view[a];if(null!=c)break;e=e.parent}b[a]=c}return d(c)&&(c=c.call(this.view)),c},v.prototype.clearCache=function(){this.cache={}},v.prototype.parse=function(a,b){var c=this.cache,d=c[a];return null==d&&(d=c[a]=q(a,b)),d},v.prototype.render=function(a,b,c){var d=this.parse(a),e=b instanceof u?b:new u(b);return this.renderTokens(d,e,c,a)},v.prototype.renderTokens=function(b,e,f,g){function j(a){return i.render(a,e,f)}for(var k,l,h="",i=this,m=0,n=b.length;n>m;++m)switch(k=b[m],k[0]){case"#":if(l=e.lookup(k[1]),!l)continue;if(c(l))for(var o=0,p=l.length;p>o;++o)h+=this.renderTokens(k[4],e.push(l[o]),f,g);else if("object"==typeof l||"string"==typeof l)h+=this.renderTokens(k[4],e.push(l),f,g);else if(d(l)){if("string"!=typeof g)throw new Error("Cannot use higher-order sections without the original template");l=l.call(e.view,g.slice(k[3],k[5]),j),null!=l&&(h+=l)}else h+=this.renderTokens(k[4],e,f,g);break;case"^":l=e.lookup(k[1]),(!l||c(l)&&0===l.length)&&(h+=this.renderTokens(k[4],e,f,g));break;case">":if(!f)continue;l=d(f)?f(k[1]):f[k[1]],null!=l&&(h+=this.renderTokens(this.parse(l),e,f,l));break;case"&":l=e.lookup(k[1]),null!=l&&(h+=l);break;case"name":l=e.lookup(k[1]),null!=l&&(h+=a.escape(l));break;case"text":h+=k[1]}return h},a.name="mustache.js",a.version="0.8.1",a.tags=["{{","}}"];var w=new v;a.clearCache=function(){return w.clearCache()},a.parse=function(a,b){return w.parse(a,b)},a.render=function(a,b,c){return w.render(a,b,c)},a.to_html=function(b,c,e,f){var g=a.render(b,c,e);return d(f)?(f(g),void 0):g},a.escape=k,a.Scanner=t,a.Context=u,a.Writer=v});;/**
 * ScrollFoo, a jQuery (+ BEM-friendly) scrollbar plugin
 *
 * ==============================
 * DOM
 * ==============================
 * <div class="scrollfoo__content-wrapper">
 *      <span class="scrollfoo__scroller scrollfoo__scroller--{{custom-modifier}}"></span>
 *      {{ parent }} (class="scrollfoo__parent scrollfoo__parent--{{custom-modifier}}")
 * </div>
 *
 * ==============================
 * Initialization
 * ==============================
 * window.newScrollFooInstance = new scrollfoo({
 *     parentEl: '{{parent-element}}',
 *     scrollerEl: '.scrollfoo__scroller--{{custom-modifier}}',
 *     visibleParentHeight: 300,
 *     realParentHeight: function() {
 *         return $('.scrollfoo__parent--{{custom-modifier}}').outerHeight();
 *     }
 * });
 *
 * @author Kostas Vasileiou <hello@vsl.io>
 * @license http://opensource.org/licenses/MIT MIT
 */

'use strict';

/**
 * ScrollFoo Constructor
 */

var ScrollFoo = function (options) {
    this.options = options || {};

    this.defaults = {
        // Element where the scrolling is active
        parentEl: '',

        // Scrollbar element
        scrollerEl: '.scrollfoo__scroller',

        // Visible height of parent element
        visibleParentHeight: 0,

        // Real height of parent element
        realParentHeight: 0,

        // Storing the visible content height to
        // real container height ratio
        ratio: 0,

        // Setting ScrollFoo active/inactive
        state: false,

        // Give the parent some headroom!
        visibleParentHeightOffset: 10,

        // Added to the content wrapper element
        // when we're dragging the scrollbar
        draggingClass: 'scrollfoo--dragging',

        disabledClass: 'scrollfoo__scroller--disabled'
    };

    // Caching the body element
    this.$body = $('body');

    // Merging user options with plugin defaults
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

ScrollFoo.prototype.initialize = function () {
    this.registerEvents();
    this.doCalculate();
};

ScrollFoo.prototype.registerEvents = function () {
    var self = this;

    this.unregisterEvents();

    // Touch
    var lastTouchY;
    $(this.config.parentEl).on('touchstart', function (ev) {
        lastTouchY = ev.originalEvent.touches[0].clientY;
    });

    $(this.config.parentEl).on('touchmove', function (ev) {
        ev.preventDefault();

        var $target = $(this);
        var currentY = ev.originalEvent.touches[0].clientY;

        var diff = Math.abs(lastTouchY - currentY);

        $target.scrollTop((currentY > lastTouchY)
            ? $target.scrollTop() - diff
            : $target.scrollTop() + diff);

        lastTouchY = currentY;
    });

    // ScrollFoo scroll event
    $(this.config.parentEl).on('scroll mousewheel DOMMouseScroll MozMousePixelScroll', function (ev) {
        self.onScrollEvent($(this), ev);
    });

    // Dragging the scrollbar
    $(this.config.scrollerEl).on('mousedown', function (ev) {
        self.onMouseDownEvent($(this), ev);
    });
};

ScrollFoo.prototype.unregisterEvents = function () {
    $(this.config.parentEl).off('scroll mousewheel DOMMouseScroll MozMousePixelScroll');
    $(this.config.scrollerEl).off('mousedown');
};

/**
 * Method called when scrolling inside a ScrollFoo enabled element
 *
 * @param  {jQuery} $target ScrollFoo element
 * @param  {Object} ev      mousewheel/DOMMouseScroll/MozMousePixelScroll event object
 */
ScrollFoo.prototype.onScrollEvent = function ($target, ev) {
    var scrolledPos;

    if (ev.type === 'scroll') {
        scrolledPos = $target.scrollTop();

        if (typeof ev.originalEvent.wheelDeltaY == 'undefined') {
            if (this.config.state === true) {
                this.handleReelbarScroller(scrolledPos, false);
            }
        }

        $target.trigger(GS.Editor.Events.ScrollFoo.Scrolling, [{ distance: scrolledPos }]);
    } else {
        if (ev.type !== 'DOMMouseScroll' && ev.type !== 'MozMousePixelScroll') {
            var wheelDelta;

            // There's no wheelDeltaY on IE
            if (ev.originalEvent.wheelDeltaY) {
                wheelDelta = ev.originalEvent.wheelDeltaY;
            } else {
                wheelDelta = ev.originalEvent.wheelDelta;
            }

            if (wheelDelta > 0) {
                $target.scrollTop($target.scrollTop() - Math.abs((wheelDelta / 10)));
            } else {
                $target.scrollTop($target.scrollTop() + Math.abs((wheelDelta / 10)));
            }
        } else {
            var scrollDelta;

            if (ev.type === 'MozMousePixelScroll') {
                scrollDelta = ev.originalEvent.detail / 3;
            } else {
                scrollDelta = ev.originalEvent.detail * 3;
            }

            if (scrollDelta > 0) {
                $target.scrollTop($target.scrollTop() + Math.abs(scrollDelta));
            } else {
                $target.scrollTop($target.scrollTop() - Math.abs(scrollDelta));
            }
        }
    }

    ev.preventDefault();
};

/**
 * Method called when dragging a ScrollFoo element's scrollbar
 *
 * @param  {jQuery} $target ScrollFoo scrollbar element
 * @param  {Object} ev      Scroll event object
 */
ScrollFoo.prototype.onMouseDownEvent = function ($target, ev) {
    var initialY = ev.pageY;
    var visibleParentHeight = this.getVisibleParentHeight();
    var initialScrolledPos = parseFloat($target.css('top').replace('px', ''), 10) || 0;
    var scrollerHeight = $target.height() - (this.config.visibleParentHeightOffset / 2);

    // Adding our dragging class to the body just in
    // case we want to apply specific style overrides
    this.$body.addClass(this.config.draggingClass);

    this.$body.on('mousemove', function (e) {
        var finalScrolledPos = (e.pageY - initialY) + initialScrolledPos;

        if (finalScrolledPos <= visibleParentHeight - scrollerHeight) {
            if (finalScrolledPos < 0) {
                finalScrolledPos = 0;
            }

            $target.css('top', finalScrolledPos);
            $(this.config.parentEl).scrollTop(finalScrolledPos / this.config.ratio);
        }
    }.bind(this));

    this.$body.one('mouseup', function () {
        this.$body.off('mousemove');
        $target.off('mouseup');

        this.$body.removeClass(this.config.draggingClass);
    }.bind(this));
};

ScrollFoo.prototype.getVisibleParentHeight = function () {
    if (typeof this.config.visibleParentHeight === 'function') {
        return this.config.visibleParentHeight() + this.config.visibleParentHeightOffset;
    } else {
        return this.config.visibleParentHeight + this.config.visibleParentHeightOffset;
    }
};

ScrollFoo.prototype.getRealParentHeight = function () {
    if (typeof this.config.realParentHeight === 'function') {
        return this.config.realParentHeight();
    } else {
        return this.config.realParentHeight;
    }
};

/**
 * Calculating container height, visible content height
 * to real container height ratio, activating scrollbar if necessary
 *
 * @return {Object} ScrollFoo instance
 */
ScrollFoo.prototype.doCalculate = function () {
    var $scrollerEl = $(this.config.scrollerEl);
    var visibleParentHeight = this.getVisibleParentHeight();
    var realParentHeight = this.getRealParentHeight();

    this.config.ratio = visibleParentHeight / realParentHeight;

    if (this.config.ratio < 1) {
        var scrollbarHeight = this.config.ratio * visibleParentHeight;

        this.config.state = true;

        $scrollerEl
            .css({ height: scrollbarHeight })
            .removeClass(this.config.disabledClass);
    } else {
        this.config.state = false;

        $scrollerEl.addClass(this.config.disabledClass);
    }

    $(this.config.parentEl).css({ height: visibleParentHeight });

    return this;
};

/**
 * Set the scrollbar position
 *
 * @param  {Number} scrolledPos   Amount of pixels scrolled
 * @param  {Boolean} isMouseWheel Use of mousewheel or touchpad
 * @return {Object}               ScrollFoo instance
 */
ScrollFoo.prototype.handleReelbarScroller = function (scrolledPos, isMouseWheel) {
    var isMouseWheel = isMouseWheel || false;
    var scrollbarPos = {
        top: scrolledPos * this.config.ratio
    };

    if (isMouseWheel) {
        $(this.config.parentEl).css('top', -scrolledPos * this.config.ratio);
    }

    $(this.config.scrollerEl).css(scrollbarPos);

    return this;
};
;// TinyColor v1.0.0
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

!function(){function j(a){var b={r:0,g:0,b:0},c=1,d=!1,e=!1;return"string"==typeof a&&(a=S(a)),"object"==typeof a&&(a.hasOwnProperty("r")&&a.hasOwnProperty("g")&&a.hasOwnProperty("b")?(b=k(a.r,a.g,a.b),d=!0,e="%"===String(a.r).substr(-1)?"prgb":"rgb"):a.hasOwnProperty("h")&&a.hasOwnProperty("s")&&a.hasOwnProperty("v")?(a.s=O(a.s),a.v=O(a.v),b=o(a.h,a.s,a.v),d=!0,e="hsv"):a.hasOwnProperty("h")&&a.hasOwnProperty("s")&&a.hasOwnProperty("l")&&(a.s=O(a.s),a.l=O(a.l),b=m(a.h,a.s,a.l),d=!0,e="hsl"),a.hasOwnProperty("a")&&(c=a.a)),c=H(c),{ok:d,format:a.format||e,r:f(255,g(b.r,0)),g:f(255,g(b.g,0)),b:f(255,g(b.b,0)),a:c}}function k(a,b,c){return{r:255*I(a,255),g:255*I(b,255),b:255*I(c,255)}}function l(a,b,c){a=I(a,255),b=I(b,255),c=I(c,255);var h,i,d=g(a,b,c),e=f(a,b,c),j=(d+e)/2;if(d==e)h=i=0;else{var k=d-e;switch(i=j>.5?k/(2-d-e):k/(d+e),d){case a:h=(b-c)/k+(c>b?6:0);break;case b:h=(c-a)/k+2;break;case c:h=(a-b)/k+4}h/=6}return{h:h,s:i,l:j}}function m(a,b,c){function g(a,b,c){return 0>c&&(c+=1),c>1&&(c-=1),1/6>c?a+6*(b-a)*c:.5>c?b:2/3>c?a+6*(b-a)*(2/3-c):a}var d,e,f;if(a=I(a,360),b=I(b,100),c=I(c,100),0===b)d=e=f=c;else{var h=.5>c?c*(1+b):c+b-c*b,i=2*c-h;d=g(i,h,a+1/3),e=g(i,h,a),f=g(i,h,a-1/3)}return{r:255*d,g:255*e,b:255*f}}function n(a,b,c){a=I(a,255),b=I(b,255),c=I(c,255);var h,i,d=g(a,b,c),e=f(a,b,c),j=d,k=d-e;if(i=0===d?0:k/d,d==e)h=0;else{switch(d){case a:h=(b-c)/k+(c>b?6:0);break;case b:h=(c-a)/k+2;break;case c:h=(a-b)/k+4}h/=6}return{h:h,s:i,v:j}}function o(a,b,c){a=6*I(a,360),b=I(b,100),c=I(c,100);var e=d.floor(a),f=a-e,g=c*(1-b),h=c*(1-f*b),i=c*(1-(1-f)*b),j=e%6,k=[c,h,g,g,i,c][j],l=[i,c,c,h,g,g][j],m=[g,g,i,c,c,h][j];return{r:255*k,g:255*l,b:255*m}}function p(a,b,c,d){var f=[N(e(a).toString(16)),N(e(b).toString(16)),N(e(c).toString(16))];return d&&f[0].charAt(0)==f[0].charAt(1)&&f[1].charAt(0)==f[1].charAt(1)&&f[2].charAt(0)==f[2].charAt(1)?f[0].charAt(0)+f[1].charAt(0)+f[2].charAt(0):f.join("")}function q(a,b,c,d){var f=[N(P(d)),N(e(a).toString(16)),N(e(b).toString(16)),N(e(c).toString(16))];return f.join("")}function r(a,b){b=0===b?0:b||10;var c=i(a).toHsl();return c.s-=b/100,c.s=J(c.s),i(c)}function s(a,b){b=0===b?0:b||10;var c=i(a).toHsl();return c.s+=b/100,c.s=J(c.s),i(c)}function t(a){return i(a).desaturate(100)}function u(a,b){b=0===b?0:b||10;var c=i(a).toHsl();return c.l+=b/100,c.l=J(c.l),i(c)}function v(a,b){b=0===b?0:b||10;var c=i(a).toRgb();return c.r=g(0,f(255,c.r-e(255*-(b/100)))),c.g=g(0,f(255,c.g-e(255*-(b/100)))),c.b=g(0,f(255,c.b-e(255*-(b/100)))),i(c)}function w(a,b){b=0===b?0:b||10;var c=i(a).toHsl();return c.l-=b/100,c.l=J(c.l),i(c)}function x(a,b){var c=i(a).toHsl(),d=(e(c.h)+b)%360;return c.h=0>d?360+d:d,i(c)}function y(a){var b=i(a).toHsl();return b.h=(b.h+180)%360,i(b)}function z(a){var b=i(a).toHsl(),c=b.h;return[i(a),i({h:(c+120)%360,s:b.s,l:b.l}),i({h:(c+240)%360,s:b.s,l:b.l})]}function A(a){var b=i(a).toHsl(),c=b.h;return[i(a),i({h:(c+90)%360,s:b.s,l:b.l}),i({h:(c+180)%360,s:b.s,l:b.l}),i({h:(c+270)%360,s:b.s,l:b.l})]}function B(a){var b=i(a).toHsl(),c=b.h;return[i(a),i({h:(c+72)%360,s:b.s,l:b.l}),i({h:(c+216)%360,s:b.s,l:b.l})]}function C(a,b,c){b=b||6,c=c||30;var d=i(a).toHsl(),e=360/c,f=[i(a)];for(d.h=(d.h-(e*b>>1)+720)%360;--b;)d.h=(d.h+e)%360,f.push(i(d));return f}function D(a,b){b=b||6;for(var c=i(a).toHsv(),d=c.h,e=c.s,f=c.v,g=[],h=1/b;b--;)g.push(i({h:d,s:e,v:f})),f=(f+h)%1;return g}function G(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[a[c]]=c);return b}function H(a){return a=parseFloat(a),(isNaN(a)||0>a||a>1)&&(a=1),a}function I(a,b){L(a)&&(a="100%");var c=M(a);return a=f(b,g(0,parseFloat(a))),c&&(a=parseInt(a*b,10)/100),d.abs(a-b)<1e-6?1:a%b/parseFloat(b)}function J(a){return f(1,g(0,a))}function K(a){return parseInt(a,16)}function L(a){return"string"==typeof a&&-1!=a.indexOf(".")&&1===parseFloat(a)}function M(a){return"string"==typeof a&&-1!=a.indexOf("%")}function N(a){return 1==a.length?"0"+a:""+a}function O(a){return 1>=a&&(a=100*a+"%"),a}function P(a){return Math.round(255*parseFloat(a)).toString(16)}function Q(a){return K(a)/255}function S(c){c=c.replace(a,"").replace(b,"").toLowerCase();var d=!1;if(E[c])c=E[c],d=!0;else if("transparent"==c)return{r:0,g:0,b:0,a:0,format:"name"};var e;return(e=R.rgb.exec(c))?{r:e[1],g:e[2],b:e[3]}:(e=R.rgba.exec(c))?{r:e[1],g:e[2],b:e[3],a:e[4]}:(e=R.hsl.exec(c))?{h:e[1],s:e[2],l:e[3]}:(e=R.hsla.exec(c))?{h:e[1],s:e[2],l:e[3],a:e[4]}:(e=R.hsv.exec(c))?{h:e[1],s:e[2],v:e[3]}:(e=R.hex8.exec(c))?{a:Q(e[1]),r:K(e[2]),g:K(e[3]),b:K(e[4]),format:d?"name":"hex8"}:(e=R.hex6.exec(c))?{r:K(e[1]),g:K(e[2]),b:K(e[3]),format:d?"name":"hex"}:(e=R.hex3.exec(c))?{r:K(e[1]+""+e[1]),g:K(e[2]+""+e[2]),b:K(e[3]+""+e[3]),format:d?"name":"hex"}:!1}var a=/^[\s,#]+/,b=/\s+$/,c=0,d=Math,e=d.round,f=d.min,g=d.max,h=d.random,i=function T(a,b){if(a=a?a:"",b=b||{},a instanceof T)return a;if(!(this instanceof T))return new T(a,b);var d=j(a);this._r=d.r,this._g=d.g,this._b=d.b,this._a=d.a,this._roundA=e(100*this._a)/100,this._format=b.format||d.format,this._gradientType=b.gradientType,this._r<1&&(this._r=e(this._r)),this._g<1&&(this._g=e(this._g)),this._b<1&&(this._b=e(this._b)),this._ok=d.ok,this._tc_id=c++};i.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var a=this.toRgb();return(299*a.r+587*a.g+114*a.b)/1e3},setAlpha:function(a){return this._a=H(a),this._roundA=e(100*this._a)/100,this},toHsv:function(){var a=n(this._r,this._g,this._b);return{h:360*a.h,s:a.s,v:a.v,a:this._a}},toHsvString:function(){var a=n(this._r,this._g,this._b),b=e(360*a.h),c=e(100*a.s),d=e(100*a.v);return 1==this._a?"hsv("+b+", "+c+"%, "+d+"%)":"hsva("+b+", "+c+"%, "+d+"%, "+this._roundA+")"},toHsl:function(){var a=l(this._r,this._g,this._b);return{h:360*a.h,s:a.s,l:a.l,a:this._a}},toHslString:function(){var a=l(this._r,this._g,this._b),b=e(360*a.h),c=e(100*a.s),d=e(100*a.l);return 1==this._a?"hsl("+b+", "+c+"%, "+d+"%)":"hsla("+b+", "+c+"%, "+d+"%, "+this._roundA+")"},toHex:function(a){return p(this._r,this._g,this._b,a)},toHexString:function(a){return"#"+this.toHex(a)},toHex8:function(){return q(this._r,this._g,this._b,this._a)},toHex8String:function(){return"#"+this.toHex8()},toRgb:function(){return{r:e(this._r),g:e(this._g),b:e(this._b),a:this._a}},toRgbString:function(){return 1==this._a?"rgb("+e(this._r)+", "+e(this._g)+", "+e(this._b)+")":"rgba("+e(this._r)+", "+e(this._g)+", "+e(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:e(100*I(this._r,255))+"%",g:e(100*I(this._g,255))+"%",b:e(100*I(this._b,255))+"%",a:this._a}},toPercentageRgbString:function(){return 1==this._a?"rgb("+e(100*I(this._r,255))+"%, "+e(100*I(this._g,255))+"%, "+e(100*I(this._b,255))+"%)":"rgba("+e(100*I(this._r,255))+"%, "+e(100*I(this._g,255))+"%, "+e(100*I(this._b,255))+"%, "+this._roundA+")"},toName:function(){return 0===this._a?"transparent":this._a<1?!1:F[p(this._r,this._g,this._b,!0)]||!1},toFilter:function(a){var b="#"+q(this._r,this._g,this._b,this._a),c=b,d=this._gradientType?"GradientType = 1, ":"";if(a){var e=i(a);c=e.toHex8String()}return"progid:DXImageTransform.Microsoft.gradient("+d+"startColorstr="+b+",endColorstr="+c+")"},toString:function(a){var b=!!a;a=a||this._format;var c=!1,d=this._a<1&&this._a>=0,e=!b&&d&&("hex"===a||"hex6"===a||"hex3"===a||"name"===a);return e?"name"===a&&0===this._a?this.toName():this.toRgbString():("rgb"===a&&(c=this.toRgbString()),"prgb"===a&&(c=this.toPercentageRgbString()),("hex"===a||"hex6"===a)&&(c=this.toHexString()),"hex3"===a&&(c=this.toHexString(!0)),"hex8"===a&&(c=this.toHex8String()),"name"===a&&(c=this.toName()),"hsl"===a&&(c=this.toHslString()),"hsv"===a&&(c=this.toHsvString()),c||this.toHexString())},_applyModification:function(a,b){var c=a.apply(null,[this].concat([].slice.call(b)));return this._r=c._r,this._g=c._g,this._b=c._b,this.setAlpha(c._a),this},lighten:function(){return this._applyModification(u,arguments)},brighten:function(){return this._applyModification(v,arguments)},darken:function(){return this._applyModification(w,arguments)},desaturate:function(){return this._applyModification(r,arguments)},saturate:function(){return this._applyModification(s,arguments)},greyscale:function(){return this._applyModification(t,arguments)},spin:function(){return this._applyModification(x,arguments)},_applyCombination:function(a,b){return a.apply(null,[this].concat([].slice.call(b)))},analogous:function(){return this._applyCombination(C,arguments)},complement:function(){return this._applyCombination(y,arguments)},monochromatic:function(){return this._applyCombination(D,arguments)},splitcomplement:function(){return this._applyCombination(B,arguments)},triad:function(){return this._applyCombination(z,arguments)},tetrad:function(){return this._applyCombination(A,arguments)}},i.fromRatio=function(a,b){if("object"==typeof a){var c={};for(var d in a)a.hasOwnProperty(d)&&(c[d]="a"===d?a[d]:O(a[d]));a=c}return i(a,b)},i.equals=function(a,b){return a&&b?i(a).toRgbString()==i(b).toRgbString():!1},i.random=function(){return i.fromRatio({r:h(),g:h(),b:h()})},i.mix=function(a,b,c){c=0===c?0:c||50;var j,d=i(a).toRgb(),e=i(b).toRgb(),f=c/100,g=2*f-1,h=e.a-d.a;j=-1==g*h?g:(g+h)/(1+g*h),j=(j+1)/2;var k=1-j,l={r:e.r*j+d.r*k,g:e.g*j+d.g*k,b:e.b*j+d.b*k,a:e.a*f+d.a*(1-f)};return i(l)},i.readability=function(a,b){var c=i(a),d=i(b),e=c.toRgb(),f=d.toRgb(),g=c.getBrightness(),h=d.getBrightness(),j=Math.max(e.r,f.r)-Math.min(e.r,f.r)+Math.max(e.g,f.g)-Math.min(e.g,f.g)+Math.max(e.b,f.b)-Math.min(e.b,f.b);return{brightness:Math.abs(g-h),color:j}},i.isReadable=function(a,b){var c=i.readability(a,b);return c.brightness>125&&c.color>500},i.mostReadable=function(a,b){for(var c=null,d=0,e=!1,f=0;f<b.length;f++){var g=i.readability(a,b[f]),h=g.brightness>125&&g.color>500,j=3*(g.brightness/125)+g.color/500;(h&&!e||h&&e&&j>d||!h&&!e&&j>d)&&(e=h,d=j,c=i(b[f]))}return c};var E=i.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},F=i.hexNames=G(E),R=function(){var a="[-\\+]?\\d+%?",b="[-\\+]?\\d*\\.\\d+%?",c="(?:"+b+")|(?:"+a+")",d="[\\s|\\(]+("+c+")[,|\\s]+("+c+")[,|\\s]+("+c+")\\s*\\)?",e="[\\s|\\(]+("+c+")[,|\\s]+("+c+")[,|\\s]+("+c+")[,|\\s]+("+c+")\\s*\\)?";return{rgb:new RegExp("rgb"+d),rgba:new RegExp("rgba"+e),hsl:new RegExp("hsl"+d),hsla:new RegExp("hsla"+e),hsv:new RegExp("hsv"+d),hex3:/^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex8:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();"undefined"!=typeof module&&module.exports?module.exports=i:"function"==typeof define&&define.amd?define(function(){return i}):window.tinycolor=i}();;/**
 * ColorPicker - pure JavaScript color picker without using images, external CSS or 1px divs.
 * Copyright © 2011 David Durman, All rights reserved.
 */
(function(jQuery, window, document, undefined) {
    var type = (window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML"),
        picker, slide, hueOffset = 15, svgNS = 'http://www.w3.org/2000/svg';

    // This HTML snippet is inserted into the innerHTML property of the passed color picker element
    // when the no-hassle call to ColorPicker() is used, i.e. ColorPicker(function(hex, hsv, rgb) { ... });

    var colorpickerHTMLSnippet = [

        '<div class="picker-wrapper">',
                '<div class="picker"></div>',
                '<div class="picker-indicator"></div>',
        '</div>',
        '<div class="slide-wrapper">',
                '<div class="slide"></div>',
                '<div class="slide-indicator"></div>',
        '</div>'

    ].join('');

    /**
     * Return mouse position relative to the element el.
     */
    function mousePosition(evt) {
        // IE:
        if (window.event && window.event.contentOverflow !== undefined) {
            return { x: window.event.offsetX, y: window.event.offsetY };
        }
        // Webkit:
        if (evt.offsetX !== undefined && evt.offsetY !== undefined) {
            return { x: evt.offsetX, y: evt.offsetY };
        }
        // Firefox:
        var wrapper = evt.target.parentNode.parentNode;
        return { x: evt.layerX - wrapper.offsetLeft, y: evt.layerY - wrapper.offsetTop };
    }

    /**
     * Create SVG element.
     */
    function $(el, attrs, children) {
        el = document.createElementNS(svgNS, el);
        for (var key in attrs)
            el.setAttribute(key, attrs[key]);
        if (Object.prototype.toString.call(children) != '[object Array]') children = [children];
        var i = 0, len = (children[0] && children.length) || 0;
        for (; i < len; i++)
            el.appendChild(children[i]);
        return el;
    }

    /**
     * Create slide and picker markup depending on the supported technology.
     */
    if (type == 'SVG') {

        slide = $('svg', { xmlns: 'http://www.w3.org/2000/svg', version: '1.1', width: '100%', height: '100%' },
                  [
                      $('defs', {},
                        $('linearGradient', { id: 'gradient-hsv', x1: '0%', y1: '100%', x2: '0%', y2: '0%'},
                          [
                              $('stop', { offset: '0%', 'stop-color': '#FF0000', 'stop-opacity': '1' }),
                              $('stop', { offset: '13%', 'stop-color': '#FF00FF', 'stop-opacity': '1' }),
                              $('stop', { offset: '25%', 'stop-color': '#8000FF', 'stop-opacity': '1' }),
                              $('stop', { offset: '38%', 'stop-color': '#0040FF', 'stop-opacity': '1' }),
                              $('stop', { offset: '50%', 'stop-color': '#00FFFF', 'stop-opacity': '1' }),
                              $('stop', { offset: '63%', 'stop-color': '#00FF40', 'stop-opacity': '1' }),
                              $('stop', { offset: '75%', 'stop-color': '#0BED00', 'stop-opacity': '1' }),
                              $('stop', { offset: '88%', 'stop-color': '#FFFF00', 'stop-opacity': '1' }),
                              $('stop', { offset: '100%', 'stop-color': '#FF0000', 'stop-opacity': '1' })
                          ]
                         )
                       ),
                      $('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-hsv)'})
                  ]
                 );

        picker = $('svg', { xmlns: 'http://www.w3.org/2000/svg', version: '1.1', width: '100%', height: '100%' },
                   [
                       $('defs', {},
                         [
                             $('linearGradient', { id: 'gradient-black', x1: '0%', y1: '100%', x2: '0%', y2: '0%'},
                               [
                                   $('stop', { offset: '0%', 'stop-color': '#000000', 'stop-opacity': '1' }),
                                   $('stop', { offset: '100%', 'stop-color': '#CC9A81', 'stop-opacity': '0' })
                               ]
                              ),
                             $('linearGradient', { id: 'gradient-white', x1: '0%', y1: '100%', x2: '100%', y2: '100%'},
                               [
                                   $('stop', { offset: '0%', 'stop-color': '#FFFFFF', 'stop-opacity': '1' }),
                                   $('stop', { offset: '100%', 'stop-color': '#CC9A81', 'stop-opacity': '0' })
                               ]
                              )
                         ]
                        ),
                       $('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-white)'}),
                       $('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-black)'})
                   ]
                  );

    } else if (type == 'VML') {
        slide = [
            '<DIV style="position: relative; width: 100%; height: 100%">',
            '<v:rect style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" stroked="f" filled="t">',
            '<v:fill type="gradient" method="none" angle="0" color="red" color2="red" colors="8519f fuchsia;.25 #8000ff;24903f #0040ff;.5 aqua;41287f #00ff40;.75 #0bed00;57671f yellow"></v:fill>',
            '</v:rect>',
            '</DIV>'
        ].join('');

        picker = [
            '<DIV style="position: relative; width: 100%; height: 100%">',
            '<v:rect style="position: absolute; left: -1px; top: -1px; width: 101%; height: 101%" stroked="f" filled="t">',
            '<v:fill type="gradient" method="none" angle="270" color="#FFFFFF" opacity="100%" color2="#CC9A81" o:opacity2="0%"></v:fill>',
            '</v:rect>',
            '<v:rect style="position: absolute; left: 0px; top: 0px; width: 100%; height: 101%" stroked="f" filled="t">',
            '<v:fill type="gradient" method="none" angle="0" color="#000000" opacity="100%" color2="#CC9A81" o:opacity2="0%"></v:fill>',
            '</v:rect>',
            '</DIV>'
        ].join('');

        if (!document.namespaces['v'])
            document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
    }

    /**
     * Convert HSV representation to RGB HEX string.
     * Credits to http://www.raphaeljs.com
     */
    function hsv2rgb(hsv) {
        var R, G, B, X, C;
        var h = (hsv.h % 360) / 60;

        C = hsv.v * hsv.s;
        X = C * (1 - Math.abs(h % 2 - 1));
        R = G = B = hsv.v - C;

        h = ~~h;
        R += [C, X, 0, 0, X, C][h];
        G += [X, C, C, X, 0, 0][h];
        B += [0, 0, X, C, C, X][h];

        var r = Math.floor(R * 255);
        var g = Math.floor(G * 255);
        var b = Math.floor(B * 255);
        return { r: r, g: g, b: b, hex: "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1) };
    }

    /**
     * Convert RGB representation to HSV.
     * r, g, b can be either in <0,1> range or <0,255> range.
     * Credits to http://www.raphaeljs.com
     */
    function rgb2hsv(rgb) {

        var r = rgb.r;
        var g = rgb.g;
        var b = rgb.b;

        if (rgb.r > 1 || rgb.g > 1 || rgb.b > 1) {
            r /= 255;
            g /= 255;
            b /= 255;
        }

        var H, S, V, C;
        V = Math.max(r, g, b);
        C = V - Math.min(r, g, b);
        H = (C == 0 ? null :
             V == r ? (g - b) / C + (g < b ? 6 : 0) :
             V == g ? (b - r) / C + 2 :
                      (r - g) / C + 4);
        H = (H % 6) * 60;
        S = C == 0 ? 0 : C / V;
        return { h: H, s: S, v: V };
    }

    /**
     * Return click event handler for the slider.
     * Sets picker background color and calls ctx.callback if provided.
     */
    function slideListener(ctx, slideElement, pickerElement) {
        return function(evt) {
            evt = evt || window.event;
            var mouse = mousePosition(evt);
            ctx.h = mouse.y / slideElement.offsetHeight * 360 + hueOffset;
            var pickerColor = hsv2rgb({ h: ctx.h, s: 1, v: 1 });
            var c = hsv2rgb({ h: ctx.h, s: ctx.s, v: ctx.v });
            pickerElement.style.backgroundColor = pickerColor.hex;
            ctx.callback && ctx.callback(c.hex, { h: ctx.h - hueOffset, s: ctx.s, v: ctx.v }, { r: c.r, g: c.g, b: c.b }, undefined, mouse);
        }
    };

    /**
     * Return click event handler for the picker.
     * Calls ctx.callback if provided.
     */
    function pickerListener(ctx, pickerElement) {
        return function(evt) {
            evt = evt || window.event;
            var mouse = mousePosition(evt),
                width = pickerElement.offsetWidth,
                height = pickerElement.offsetHeight;

            ctx.s = mouse.x / width;
            ctx.v = (height - mouse.y) / height;
            var c = hsv2rgb(ctx);
            ctx.callback && ctx.callback(c.hex, { h: ctx.h - hueOffset, s: ctx.s, v: ctx.v }, { r: c.r, g: c.g, b: c.b }, mouse);
        }
    };

    var uniqID = 0;

    /**
     * ColorPicker.
     * @param {DOMElement} slideElement HSV slide element.
     * @param {DOMElement} pickerElement HSV picker element.
     * @param {Function} callback Called whenever the color is changed provided chosen color in RGB HEX format as the only argument.
     */
    function ColorPicker(slideElement, pickerElement, callback) {

        if (!(this instanceof ColorPicker)) return new ColorPicker(slideElement, pickerElement, callback);

        this.h = 0;
        this.s = 1;
        this.v = 1;

        if (!callback) {
            // call of the form ColorPicker(element, funtion(hex, hsv, rgb) { ... }), i.e. the no-hassle call.

            var element = slideElement;
            element.innerHTML = colorpickerHTMLSnippet;

            this.slideElement = element.getElementsByClassName('slide')[0];
            this.pickerElement = element.getElementsByClassName('picker')[0];
            var slideIndicator = element.getElementsByClassName('slide-indicator')[0];
            var pickerIndicator = element.getElementsByClassName('picker-indicator')[0];

            ColorPicker.fixIndicators(slideIndicator, pickerIndicator);

            this.callback = function(hex, hsv, rgb, pickerCoordinate, slideCoordinate) {

                ColorPicker.positionIndicators(slideIndicator, pickerIndicator, slideCoordinate, pickerCoordinate);

                pickerElement(hex, hsv, rgb);
            };

        } else {

            this.callback = callback;
            this.pickerElement = pickerElement;
            this.slideElement = slideElement;
        }

        if (type == 'SVG') {

            // Generate uniq IDs for linearGradients so that we don't have the same IDs within one document.
            // Then reference those gradients in the associated rectangles.

            var slideClone = slide.cloneNode(true);
            var pickerClone = picker.cloneNode(true);

            var hsvGradient = slideClone.querySelectorAll('#gradient-hsv')[0];

            var hsvRect = slideClone.getElementsByTagName('rect')[0];

            hsvGradient.id = 'gradient-hsv-' + uniqID;
            hsvRect.setAttribute('fill', 'url(#' + hsvGradient.id + ')');

            var blackAndWhiteGradients = [
                pickerClone.querySelectorAll('#gradient-black')[0],
                pickerClone.querySelectorAll('#gradient-white')[0]
            ];
            var whiteAndBlackRects = pickerClone.getElementsByTagName('rect');

            blackAndWhiteGradients[0].id = 'gradient-black-' + uniqID;
            blackAndWhiteGradients[1].id = 'gradient-white-' + uniqID;

            whiteAndBlackRects[0].setAttribute('fill', 'url(#' + blackAndWhiteGradients[1].id + ')');
            whiteAndBlackRects[1].setAttribute('fill', 'url(#' + blackAndWhiteGradients[0].id + ')');

            this.slideElement.appendChild(slideClone);
            this.pickerElement.appendChild(pickerClone);

            uniqID++;

        } else {

            this.slideElement.innerHTML = slide;
            this.pickerElement.innerHTML = picker;
        }

        addEventListener(this.slideElement, 'click', slideListener(this, this.slideElement, this.pickerElement));
        addEventListener(this.pickerElement, 'click', pickerListener(this, this.pickerElement));

        enableDragging(this, this.slideElement, slideListener(this, this.slideElement, this.pickerElement));
        enableDragging(this, this.pickerElement, pickerListener(this, this.pickerElement));
    };

    function addEventListener(element, event, listener) {

        if (element.attachEvent) {

            element.attachEvent('on' + event, listener);

        } else if (element.addEventListener) {

            element.addEventListener(event, listener, false);
        }
    }

   /**
    * Enable drag&drop color selection.
    * @param {object} ctx ColorPicker instance.
    * @param {DOMElement} element HSV slide element or HSV picker element.
    * @param {Function} listener Function that will be called whenever mouse is dragged over the element with event object as argument.
    */
    function enableDragging(ctx, element, listener) {

        var mousedown = false;

        addEventListener(element, 'mousedown', function(evt) { mousedown = true;  });
        addEventListener(element, 'mouseup',   function(evt) {
            mousedown = false;

            setTimeout(function() {
                jQuery(window.GSEditor.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: hsv2rgb(ctx).hex }]);
                jQuery(window.GSEditor.config.el.editor).trigger(GS.Editor.Events.History.Update);
            }, 20);
        });
        addEventListener(element, 'mouseout',  function(evt) { mousedown = false;  });
        addEventListener(element, 'mousemove', function(evt) {
            if (mousedown) {
                listener(evt);
            }
        });
    }


    ColorPicker.hsv2rgb = function(hsv) {
        var rgbHex = hsv2rgb(hsv);
        delete rgbHex.hex;
        return rgbHex;
    };

    ColorPicker.hsv2hex = function(hsv) {
        return hsv2rgb(hsv).hex;
    };

    ColorPicker.rgb2hsv = rgb2hsv;

    ColorPicker.rgb2hex = function(rgb) {
        return hsv2rgb(rgb2hsv(rgb)).hex;
    };

    ColorPicker.hex2hsv = function(hex) {
        return rgb2hsv(ColorPicker.hex2rgb(hex));
    };

    ColorPicker.hex2rgb = function(hex) {
        return { r: parseInt(hex.substr(1, 2), 16), g: parseInt(hex.substr(3, 2), 16), b: parseInt(hex.substr(5, 2), 16) };
    };

    /**
     * Sets color of the picker in hsv/rgb/hex format.
     * @param {object} ctx ColorPicker instance.
     * @param {object} hsv Object of the form: { h: <hue>, s: <saturation>, v: <value> }.
     * @param {object} rgb Object of the form: { r: <red>, g: <green>, b: <blue> }.
     * @param {string} hex String of the form: #RRGGBB.
     */
     function setColor(ctx, hsv, rgb, hex) {
         ctx.h = hsv.h % 360;
         ctx.s = hsv.s;
         ctx.v = hsv.v;

         var c = hsv2rgb(ctx);

         var mouseSlide = {
             y: (ctx.h * ctx.slideElement.offsetHeight) / 360,
             x: 0    // not important
         };

         var pickerHeight = ctx.pickerElement.offsetHeight;

         var mousePicker = {
             x: ctx.s * ctx.pickerElement.offsetWidth,
             y: pickerHeight - ctx.v * pickerHeight
         };

         ctx.pickerElement.style.backgroundColor = hsv2rgb({ h: ctx.h, s: 1, v: 1 }).hex;
         ctx.callback && ctx.callback(hex || c.hex, { h: ctx.h, s: ctx.s, v: ctx.v }, rgb || { r: c.r, g: c.g, b: c.b }, mousePicker, mouseSlide);

         return ctx;
    };

    /**
     * Sets color of the picker in hsv format.
     * @param {object} hsv Object of the form: { h: <hue>, s: <saturation>, v: <value> }.
     */
    ColorPicker.prototype.setHsv = function(hsv) {
        return setColor(this, hsv);
    };

    /**
     * Sets color of the picker in rgb format.
     * @param {object} rgb Object of the form: { r: <red>, g: <green>, b: <blue> }.
     */
    ColorPicker.prototype.setRgb = function(rgb) {
        return setColor(this, rgb2hsv(rgb), rgb);
    };

    /**
     * Sets color of the picker in hex format.
     * @param {string} hex Hex color format #RRGGBB.
     */
    ColorPicker.prototype.setHex = function(hex) {
        return setColor(this, ColorPicker.hex2hsv(hex), undefined, hex);
    };

    /**
     * Helper to position indicators.
     * @param {HTMLElement} slideIndicator DOM element representing the indicator of the slide area.
     * @param {HTMLElement} pickerIndicator DOM element representing the indicator of the picker area.
     * @param {object} mouseSlide Coordinates of the mouse cursor in the slide area.
     * @param {object} mousePicker Coordinates of the mouse cursor in the picker area.
     */
    ColorPicker.positionIndicators = function(slideIndicator, pickerIndicator, mouseSlide, mousePicker) {

        if (mouseSlide) {
            slideIndicator.style.top = (mouseSlide.y - slideIndicator.offsetHeight/2) + 'px';
        }
        if (mousePicker) {
            pickerIndicator.style.top = (mousePicker.y - pickerIndicator.offsetHeight/2) + 'px';
            pickerIndicator.style.left = (mousePicker.x - pickerIndicator.offsetWidth/2) + 'px';
        }
    };

    /**
     * Helper to fix indicators - this is recommended (and needed) for dragable color selection (see enabledDragging()).
     */
    ColorPicker.fixIndicators = function(slideIndicator, pickerIndicator) {

        pickerIndicator.style.pointerEvents = 'none';
        slideIndicator.style.pointerEvents = 'none';
    };

    window.ColorPicker = ColorPicker;

})(jQuery, window, window.document);
;/*!
  * Bowser - a browser detector
  * https://github.com/ded/bowser
  * MIT License | (c) Dustin Diaz 2014
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports['browser'] = definition()
  else if (typeof define == 'function') define(definition)
  else this[name] = definition()
}('bowser', function () {
  /**
    * See useragents.js for examples of navigator.userAgent
    */

  var t = true

  function detect(ua) {

    function getFirstMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[1]) || '';
    }

    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
      , likeAndroid = /like android/i.test(ua)
      , android = !likeAndroid && /android/i.test(ua)
      , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
      , tablet = /tablet/i.test(ua)
      , mobile = !tablet && /[^-]mobi/i.test(ua)
      , result

    if (/opera|opr/i.test(ua)) {
      result = {
        name: 'Opera'
      , opera: t
      , version: versionIdentifier || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/windows phone/i.test(ua)) {
      result = {
        name: 'Windows Phone'
      , windowsphone: t
      , msie: t
      , version: getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/msie|trident/i.test(ua)) {
      result = {
        name: 'Internet Explorer'
      , msie: t
      , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
      }
    }
    else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        name: 'Chrome'
      , chrome: t
      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    }
    else if (iosdevice) {
      result = {
        name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
      }
      // WTF: version is not part of user agent in web apps
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if (/sailfish/i.test(ua)) {
      result = {
        name: 'Sailfish'
      , sailfish: t
      , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/seamonkey\//i.test(ua)) {
      result = {
        name: 'SeaMonkey'
      , seamonkey: t
      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/firefox|iceweasel/i.test(ua)) {
      result = {
        name: 'Firefox'
      , firefox: t
      , version: getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
      }
      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        result.firefoxos = t
      }
    }
    else if (/silk/i.test(ua)) {
      result =  {
        name: 'Amazon Silk'
      , silk: t
      , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
      }
    }
    else if (android) {
      result = {
        name: 'Android'
      , version: versionIdentifier
      }
    }
    else if (/phantom/i.test(ua)) {
      result = {
        name: 'PhantomJS'
      , phantom: t
      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
      result = {
        name: 'BlackBerry'
      , blackberry: t
      , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/(web|hpw)os/i.test(ua)) {
      result = {
        name: 'WebOS'
      , webos: t
      , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
      };
      /touchpad\//i.test(ua) && (result.touchpad = t)
    }
    else if (/bada/i.test(ua)) {
      result = {
        name: 'Bada'
      , bada: t
      , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
      };
    }
    else if (/tizen/i.test(ua)) {
      result = {
        name: 'Tizen'
      , tizen: t
      , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/safari/i.test(ua)) {
      result = {
        name: 'Safari'
      , safari: t
      , version: versionIdentifier
      }
    }
    else result = {}

    // set webkit or gecko flag for browsers based on these engines
    if (/(apple)?webkit/i.test(ua)) {
      result.name = result.name || "Webkit"
      result.webkit = t
      if (!result.version && versionIdentifier) {
        result.version = versionIdentifier
      }
    } else if (!result.opera && /gecko\//i.test(ua)) {
      result.name = result.name || "Gecko"
      result.gecko = t
      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
    }

    // set OS flags for platforms that have multiple browsers
    if (android || result.silk) {
      result.android = t
    } else if (iosdevice) {
      result[iosdevice] = t
      result.ios = t
    }

    // OS version extraction
    var osVersion = '';
    if (iosdevice) {
      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
    } else if (result.windowsphone) {
      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (result.webos) {
      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (result.blackberry) {
      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (result.bada) {
      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
    } else if (result.tizen) {
      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
      result.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = osVersion.split('.')[0];
    if (tablet || iosdevice == 'ipad' || (android && (osMajorVersion == 3 || (osMajorVersion == 4 && !mobile))) || result.silk) {
      result.tablet = t
    } else if (mobile || iosdevice == 'iphone' || iosdevice == 'ipod' || android || result.blackberry || result.webos || result.bada) {
      result.mobile = t
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if ((result.msie && result.version >= 10) ||
        (result.chrome && result.version >= 20) ||
        (result.firefox && result.version >= 20.0) ||
        (result.safari && result.version >= 6) ||
        (result.opera && result.version >= 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] >= 6)
        ) {
      result.a = t;
    }
    else if ((result.msie && result.version < 10) ||
        (result.chrome && result.version < 20) ||
        (result.firefox && result.version < 20.0) ||
        (result.safari && result.version < 6) ||
        (result.opera && result.version < 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
        ) {
      result.c = t
    } else result.x = t

    return result
  }

  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent : '')


  /*
   * Set our detect method to the main bowser object so we can
   * reuse it to test other user agents.
   * This is needed to implement future tests.
   */
  bowser._detect = detect;

  return bowser
});
;'use strict';

// Graphic Springs namespace
var GS = GS || {
    VERSION: '1.0-rc1'
};

// Caching body element
var $body = $('body');
;/* -----------------------------------------
 Logo Editor module

 @author Konstantinos Vasileiou <kostas@neverbland.com>
 @copyrights Neverbland 2014
 ----------------------------------------- */

GS.Editor = function (options) {
    this.options = options || {};

    this.defaults = {
        el: {
            editor: '.editor',
            canvas: '.canvas',
            logoItem: '.logo__item',
            logoItemPart: '.logo__item [fill]',
            logoItemActive: '.logo__item--active',
            logoItemInner: '.logo__item__inner', // not used yet ?
            symbol: '#logo__item--symbol',
            overlay: '.overlay',
            editorBuyButton: '.editor__button--buy',
            editorDownloadButton: '.editor__button--download',
            warning: {
                main: '.warning',
                button: '.warning__button'
            }
        },
        coreClasses: {
            warningDisabled: 'warning--disabled',
            logoItem: 'logo__item',
            logoItemActive: 'logo__item--active',
            logoItemPartActive: 'logo__item-part--active',
            logoPartActive: 'logo__part--active',
            logoPurchased: 'logo-is-purchased',
            overlayLoading: 'overlay--loading',
            overlayWorking: 'overlay--working',
            editorDragging: 'editor--dragging'
        },
        attributes: {
            logoItemData: 'logo-item',
            logoItemType: 'item-type',
            logoItem: 'item'
        },
        settings: {
            leftOffset: 70
        }
    };

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    // Storing the id of the most recently saved logo here
    this.currentLogoId = false;

    // Storing the history index the last time we saved the current logo
    this.savedHistoryPosition = 1;

    // Generic helpers instance
    this.helpers = new GS.Editor.Helpers(this.config);

    /* Initializing the rest of the editor modules *******/
    // Api instance
    this.core = new GS.Editor.Core({
        el: {
            editor: this.config.el.editor
        }
    }, this.helpers);

    this.templates = new GS.Editor.Templates(this.config, this.helpers, this.core);

    // History instance
    this.history = new GS.Editor.History({
        el: {
            editor: this.config.el.editor
        }
    }, this.helpers, this.templates, this.core);

    // Tooltip instance
    this.tooltip = new GS.Editor.Tooltip({
        el: {
            editor: this.config.el.editor
        }
    }, this.helpers);

    // Sidebar instance
    this.sidebar = new GS.Editor.Sidebar(this.config, this.helpers, this.templates, this.core);

    // Login instance
    this.login = new GS.Editor.Login(this.sidebar.config, this.helpers, this.templates, this.core);

    // Importer instance
    this.importer = new GS.Editor.Importer(this.sidebar.config, this.helpers, this.templates, this.core);

    // Toolbars instance
    this.toolbars = new GS.Editor.Toolbars(this.config, this.helpers, this.templates, this.resizer);

    // Transformations instance (module that applies the transforms - rotate/transform)
    this.transform = new GS.Editor.Transformation(this.config, this.helpers);

    // Logo item resizer instance
    this.resizer = new GS.Editor.Resizer(this.config, this.helpers, this.transform);

    // Buy Logo instance
    this.payment = new GS.Editor.Payment(this.sidebar.config, this.helpers, this.templates, this.core);

    // Preview Logo instance
    this.preview = new GS.Editor.Preview(this.sidebar.config, this.helpers, this.templates, this.core);

    // Onboarding instance
    this.onboarding = new GS.Editor.Onboarding(this.sidebar.config, this.helpers, this.sidebar, this.core);

    console.log('%c                                                   \r\n                                                 .7\r\n                                      \\       , \/\/ \r\n                                      |\\.--._\/|\/\/  \r\n                                     \/\\ ) ) ).\'\/   \r\n                                    \/(  \\  \/\/ \/    \r\n                                   \/(   J`((_\/ \\   \r\n                                  \/ ) | _\\     \/   \r\n                                 \/|)  \\  eJ    L   \r\n                                |  \\ L \\   L   L   \r\n                               \/  \\  J  `. J   L   \r\n                               |  )   L   \\\/   \\   \r\n                              \/  \\    J   (\\   \/   \r\n            _....___         |  \\      \\   \\```    \r\n     ,.._.-\'        \'\'\'--...-||\\     -. \\   \\      \r\n   .\'.=.\'                    `         `.\\ [ Y     \r\n  \/   \/                                  \\]  J     \r\n Y \/ Y                                    Y   L    \r\n | | |          \\                         |   L    \r\n | | |           Y                        A  J     \r\n |   I           |                       \/I\\ \/     \r\n |    \\          I             \\        ( |]\/|     \r\n J     \\         \/._           \/        -tI\/ |     \r\n  L     )       \/   \/\'-------\'J           `\'-:.    \r\n  J   .\'      ,\'  ,\' ,     \\   `\'-.__          \\   \r\n   \\ T      ,\'  ,\'   )\\    \/|        \';\'---7   \/   \r\n    \\|    ,\'L  Y...-\' \/ _.\' \/         \\   \/   \/    \r\n     J   Y  |  J    .\'-\'   \/         ,--.(   \/     \r\n      L  |  J   L -\'     .\'         \/  |    \/\\     \r\n      |  J.  L  J     .-;.-\/       |    \\ .\' \/     \r\n      J   L`-J   L____,.-\'`        |  _.-\'   |     \r\n       L  J   L  J                  ``  J    |     \r\n       J   L  |   L                     J    |     \r\n        L  J  L    \\                    L    \\     \r\n        |   L  ) _.\'\\                    ) _.\'\\    \r\n        L    \\(\'`    \\                  (\'`    \\   \r\n         ) _.\'\\`-....\'                   `-....\'   \r\n        (\'`    \\                                   \r\n         `-.___\/                                   \r\n                                                   ', 'background-color: #555; color: pink');
    console.log('%c Made by these 2 awesome dudes:           ', 'background-color: #555; color: pink');
    console.log('%c Kostas Vasileiou <hello@vsl.io>        ', 'background-color: #555; color: pink');
    console.log('%c Paul Werelds     <paul@neverbland.com> ', 'background-color: #555; color: pink');

    this.initialize();
};

GS.Editor.prototype.initialize = function () {
    console.log('> Initialized editor');

    this.initialised = false;

    this.helpers.submitGaEvent(GS.Editor.Events.GA.Loaded);

    this.registerEvents();
    this.prepareBrowserSupportClasses();
    this.prepareLogoItems();

    this.initialised = true;
};

GS.Editor.prototype.registerEvents = function () {
    var self = this;
    var discount = {
        done: false,
        code: '',
        html: [
            '<h3>Wait! Save {discount} if you purchase your logo right now.</h3>',
            '​​<p>This is a one time offer and the code expires in {expires}.</p>',
            '<p>Your code: {code}</p>'
        ].join(''),
        text: [
            'Wait! Save {discount} if you purchase your logo right now.\n',
            '\n',
            '​​This is a one time offer and the code expires in {expires}.\n',
            '\n',
            'Your code: {code}'
        ].join('')
    };

    // Prevent losing unsaved information
    $(window).on('beforeunload', function (event) {
        if (this.initialised === false) {
            return;
        }

        if (!$('.payment').hasClass('payment--active') && !$('.preview').hasClass('preview--active')) {
            discount.done = true;
        }

        if (this.helpers.checkIfUnsavedChanges()) {
            if (!discount.done) {
                console.log('[[ Starting synchronous AJAX request ]]');
                $.ajax({
                    url: '/builder/incentive',
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    success: function (response) {
                        console.log('[[ Handling synchronous AJAX request ]]');
                        discount.code = response.data.code || discount.code;

                        $.each(response.data, function (key, value) {
                            discount.html = discount.html.replace('{' + key + '}', value || '');
                            discount.text = discount.text.replace('{' + key + '}', value || '');
                        });

                        if (discount.code === false) {
                            discount.done = true;

                            return;
                        }

                        console.log('[[ Handled synchronous AJAX request ]]');
                    }
                });
            }

            var message = {
                text: 'Wait! Don\'t lose your logo.\n'
                + '\n'
                + 'Purchase now to secure your logo. You can make edits FREE of charge at any time.\n',
                html: '<h3>Wait! Don\'t lose your logo.</h3>'
                + '<p>Purchase now to secure your logo. You can make edits FREE of charge at any time.</p>'
            };

            var doDiscount = !(discount.done || discount.code == '' || discount.code == false);
            if (doDiscount) {
                message.text = discount.text;
                message.html = discount.html;
            }

            // Only IE11 still supports the custom messages above.
            var $dialog = $('<div>', {
                class: 'logo-warning logo-warning--active'
            });

            $dialog.html(message.html + '<button class="logo-warning__button">ALRIGHT!</button>');

            $dialog.appendTo('body');

            $('.logo-warning__button').one('click', function () {
                $dialog.removeClass('logo-warning--active');

                setTimeout(function () {
                    $dialog.remove();
                }, 400);
            });

            console.log('[[ Returning from beforeunload ]]');
            event.returnValue = message.text;

            if (doDiscount) {
                discount.done = true;
            }

            return message.text;
        }
    }.bind(this));

    // Warning clicky
    $body.on('click', this.config.el.warning.button, function () {
        $(this.config.el.warning.main).addClass(this.config.coreClasses.warningDisabled);
    }.bind(this));

    $(this.config.el.editor).on('mousedown', function (ev) {
        $(this.config.el.editor).trigger(GS.Editor.Events.Item.Deselected);
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Item.Deselected, function () {
        this.deselectItems();
        this.deselectItemParts();
    }.bind(this));

    $(this.config.el.editor).on('mousedown', this.config.el.logoItemPart, function (e) {
        e.stopPropagation();

        var $this = $(this);
        var $item = $this.closest(self.config.el.logoItem);

        // In case you're wondering, storeItemDimensions returns the dimensions anyway. Why not store them too...?
        self.mouseDownEvent($item, $this, e, self.helpers.getItemTranslate($item), self.helpers.getAndStoreItemDimensions($item));
    });

    // Buy button on canvas
    $(this.config.el.editor).on('click', this.config.el.editorBuyButton, function (ev) {
        ev.stopPropagation();

        $(this.payment.config.el.sidebarActions.buy).trigger('click');
    }.bind(this));

    // Download button on canvas
    $(this.config.el.editor).on('click', this.config.el.editorDownloadButton, function (ev) {
        ev.stopPropagation();

        $(this.payment.config.el.sidebarActions.download).trigger('click');
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Core.Loaded.Logo, function (ev, data) {
        self.currentLogoId = data.id;

        console.log(' >> Logo loaded: ' + self.currentLogoId);
    });

    $(this.config.el.editor).on(GS.Editor.Events.Core.Draw.SavedLogo, function (ev) {
        setTimeout(function () {
            self.helpers.doFixTextPositioning();
        }, 100);
    });
};

/**
 * Reveal the editor to the user
 */
GS.Editor.prototype.flipTheSwitch = function () {
    if (window.location.hash === '') {
        this.sidebar.handleMenuWhenItemIsNotPurchased();
        this.sidebar.doCalculate();

        setTimeout(function () {
            this.onboarding.initialize();
        }.bind(this), 500);
    } else {
        this.onboarding.doHide();
        this.loadSavedLogo();
    }
};

GS.Editor.prototype.mouseDownEvent = function ($item, $itemPart, initialEvent, itemPosition, itemDimensions) {
    var isMoving = false;
    var itemType = $item.data(this.config.attributes.logoItemType);
    var itemAlreadyActive = this.helpers.isItemActive($item);
    var itemHasActivePart = this.helpers.hasItemPartActive($item);
    var currentItemPartIsActive = ($itemPart[0] === this.helpers.getItemActivePart($item)[0]);

    $(this.config.el.editor).on('mousemove', $item, function (ev) {
        var distance = this.helpers.getMousemoveDistance(initialEvent, ev);
        isMoving = true;

        // this.helpers.doStartGlitchFix();

        $(this.config.el.editor).trigger(GS.Editor.Events.Transformations.Update, [
            {
                item: $item,
                transforms: {
                    dimensions: {
                        width: itemDimensions.width,
                        height: itemDimensions.height
                    },
                    translate: {
                        x: itemPosition.x + distance.x,
                        y: itemPosition.y + distance.y
                    },
                    scale: false,
                    rotate: false
                }
            }
        ]);
    }.bind(this));

    $(this.config.el.editor).on('mouseup', function () {
        if (isMoving === false) {
            this.selectItem($item);
            $(this.config.el.editor).trigger(GS.Editor.Events.Item.Selected, [
                {
                    item: $item,
                    part: false,
                    type: itemType,
                    alreadyActive: itemAlreadyActive
                }
            ]);

            // If the item part is already selected, we now select the parent item instead
            if (itemType !== 'text') {
                if (itemHasActivePart && currentItemPartIsActive) {
                    this.deselectItemParts();
                } else {
                    // We don't want to select specific parts of a 'text' logo item
                    // for the simple reason that there only one part: <text>.
                    this.selectItemPart($item, $itemPart);

                    $(this.config.el.editor).trigger(GS.Editor.Events.Item.Part.Selected, [
                        {
                            item: $item,
                            part: $itemPart,
                            type: itemType,
                            alreadyActive: itemAlreadyActive
                        }
                    ]);
                }
            }
        }

        if (isMoving === true) {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }

        $(this.config.el.editor).off('mousemove mouseup');
        // this.helpers.doStopGlitchFix();
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Core.Saved.Logo, function (ev, data) {
        self.currentLogoId = data.id;
    });
};

/**
 * Add the appropriate class to the body
 * depending on the browser/engine.
 *
 * @return {Object} Editor instance
 */
GS.Editor.prototype.prepareBrowserSupportClasses = function () {
    this.helpers.isIE();
    this.helpers.isWebkit();
    this.helpers.isFirefox();
    this.helpers.getBrowserInfo();
    this.helpers.checkIfBrowserUnsupported();

    return this;
};

/**
 * Iterate through the logo items, store default data
 * and position them to the starting position
 *
 * @return {Object} Editor instance
 */
GS.Editor.prototype.prepareLogoItems = function () {
    this.helpers.doFixTextPositioning();

    $(this.config.el.logoItem).each(function (index, el) {
        var $el = $(el);

        this.helpers.createItemDataStructure($el);
        this.helpers.getAndStoreItemDimensions($el);
    }.bind(this));

    this.resetElementsPosition();

    return this;
};

/**
 * Load a user's saved logo on the editor
 */
GS.Editor.prototype.loadSavedLogo = function () {
    var hashValue = window.location.hash.replace('#', '');

    this.initialised = false;

    if (!this.helpers.isLoggedIn()) {
        var redirect_uri = encodeURI(window.location);
        redirect_uri = redirect_uri.replace(/#/g, '%23');

        window.location = '/login?redirect_uri=' + redirect_uri;

        return;
    }

    this.initialised = true;

    var _getSavedLogo = function (logoId, _cb) {
        _cb = _cb || {};

        console.log('getsaved', logoId);
        $.get(this.core.config.api.get.logos.userLogo + logoId, function (data) {
            var svgUrl = '/filestorage/logos/' + logoId + '/' + data.data.filename + '.svg';
            svgUrl = '/builder/load/' + logoId;

            console.log('>> Fetched logo #' + logoId);

            if (data.data['purchased_at'] !== null) {
                $body.addClass(this.config.coreClasses.logoPurchased);
                window.GSEditor.sidebar.handleMenuWhenItemIsPurchased();
            } else {
                window.GSEditor.sidebar.handleMenuWhenItemIsNotPurchased();
            }

            this.sidebar.doCalculate();

            setTimeout(function () {
                this.sidebar.revealSidebar();
                this.core.getSvgCode(svgUrl, GS.Editor.Events.Core.Draw.SavedLogo);

                $(this.config.el.editor).trigger(GS.Editor.Events.Core.Loaded.Logo, [
                    { id: logoId }
                ]);

                if (typeof _cb === 'function') {
                    _cb();
                }
            }.bind(this), 100);
        }.bind(this));
    }.bind(this);

    if (isNaN(hashValue)) {
        var parts;

        if (hashValue.substr(0, 4) === 'buy/') {
            parts = hashValue.split('/');

            if (parts.length === 2) {
                $(this.config.el.editor).one(GS.Editor.Events.Importer.Finished, function (ev) {
                    $(this.sidebar.config.el.sidebarActions.buy).trigger('click');
                }.bind(this));

                hashValue = parts[1];
            }
        } else if (hashValue.substr(0, 6) === 'debug/') {
            parts = hashValue.split('/');

            if (parts.length === 3) {
                this.sidebar.doCalculate();

                setTimeout(function () {
                    this.sidebar.revealSidebar();
                    this.core.getSvgCode(
                        '/filestorage/logos/' + parts[1] + '/' + parts[2] + '.svg',
                        GS.Editor.Events.Core.Draw.SavedLogo
                    );
                }.bind(this), 100);
            } else if (parts.length === 2) {
                this.sidebar.doCalculate();

                setTimeout(function () {
                    this.sidebar.revealSidebar();
                    this.core.getSvgCode(
                        '/issues/originals/' + parts[1] + '/logo.svg',
                        GS.Editor.Events.Core.Draw.SavedLogo
                    );
                }.bind(this), 100);
            }
        } else if (hashValue.indexOf('.') >= 0) {
            _getSavedLogo(hashValue);
        }
    }

    if (!isNaN(hashValue)) {
        _getSavedLogo(hashValue);
    }
};

/**
 * Select target logo item
 *
 * @param  {jQuery} $item Logo item
 * @return {Object}       Editor instance
 */
GS.Editor.prototype.selectItem = function ($item) {
    this.deselectItems();

    $item.attr({ class: this.config.coreClasses.logoItem + ' ' + this.config.coreClasses.logoItemActive });

    return this;
};

/**
 * Deselects all logo items
 *
 * @return {Object} Editor instance
 */
GS.Editor.prototype.deselectItems = function () {
    $(this.config.el.logoItem).attr({ class: this.config.coreClasses.logoItem });

    this.deselectItemParts();

    return this;
};

/**
 * Select the item part of the target logo item
 *
 * @param  {jQuery} $item Logo item
 * @param  {jQuery} $part Logo item part
 */
GS.Editor.prototype.selectItemPart = function ($item, $part) {
    this.deselectItemParts($item);

    $item.attr({ class: this.config.coreClasses.logoItem + ' ' + this.config.coreClasses.logoItemActive + ' ' + this.config.coreClasses.logoItemPartActive });
    $part.attr({ class: this.config.coreClasses.logoPartActive });
};

/**
 * Deselect all item parts of a specific
 * or all logo items in the canvas
 *
 * @param  {jQuery} $item (Optional) Logo item
 */
GS.Editor.prototype.deselectItemParts = function ($item) {
    var $item = $item || $(this.config.el.logoItemPart).parent();

    $item.find('[fill]').removeAttr('class');
};

/**
 * Neatly position the logo items when initializing the editor.
 * @todo Properly position the elements - it's half-assed right now :<
 * @return {Object} Editor instance
 */
GS.Editor.prototype.resetElementsPosition = function ($item) {
    var $item = $item || $(this.config.el.logoItem);
    var canvasDimensions = this.helpers.getCanvasDimensions();

    $item.each(function (index, el) {
        var $item = $(el);
        var position = {};
        var itemDimensions = this.helpers.getAndStoreItemDimensions($item);

        if ($item.attr('id') === this.helpers.getRawName(this.config.el.symbol)) {
            position.x = (canvasDimensions.width / 2) - (itemDimensions.width / 2);
            position.y = (canvasDimensions.height / 2) - (itemDimensions.height / 2);
        } else {
            position.x = (canvasDimensions.width / 2) - (itemDimensions.width / 2);
            position.y = (canvasDimensions.height / 2) - (itemDimensions.height / 2);
        }

        $(this.config.el.editor).trigger(GS.Editor.Events.Transformations.Update, [
            {
                item: $item,
                transforms: {
                    dimensions: {
                        width: 0,
                        height: 0
                    },
                    translate: {
                        x: position.x,
                        y: position.y
                    },
                    scale: false,
                    rotate: false
                }
            }
        ]);
    }.bind(this));

    return this;
};

(function ($) {
    'use strict';

    $(window).load(function () {
        window.GSEditor = new GS.Editor();
        window.GSEditor.flipTheSwitch();
    });
}(window.jQuery));
;/* -----------------------------------------
 Logo Editor Core module (API stuff)

 @author Konstantinos Vasileiou <kostas@neverbland.com>
 @copyrights Neverbland 2014
 ----------------------------------------- */

/**
 * Editor Core constructor

 * @param {Object} options Sidebar initialization options
 * @param {Object} helpers Editor helpers
 */
GS.Editor.Core = function (options, helpers) {
    this.options = options || {};

    this.defaults = {
        api: {
            get: {
                // Returns all logo categories
                categories: '/ajax/categories',
                logos: {
                    // Returns the saved logos of a user
                    user: '/ajax/mylogos',

                    // Returns the url of the saved logo
                    // Accepts the logo ID
                    userLogo: '/account/logo/',

                    // Returns all logos
                    // Accepts category ID and page number
                    normal: '/ajax/fetch/normal/',

                    // Returns random logos
                    // Accepts category ID and page number
                    // (page can be 1 as it randomizes on every call)
                    random: '/ajax/fetch/random/',

                    // Returns logos based on popularity
                    // Accepts category ID and page number
                    popular: '/ajax/fetch/popular/',

                    // Returns new logos
                    // Accepts category ID and page number
                    newLogos: '/ajax/fetch/new/',

                    // Returns logos matching a tag
                    // Accepts tag keyword and page number
                    search: '/ajax/search/'
                }
            },
            post: {
                // Increases a logo's usage counter
                // Accepts logo ID
                increaseLogoCounter: '/ajax/ping/',

                // Saves a new log [post with `data` parameter (svg data)]
                // Accepts logo ID (optional)
                // Returns ID & URL of SVG
                saveLogo: '/builder/save/'
            }
        }
    };

    this.helpers = helpers || {};

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Core.prototype.initialize = function () {
    console.log('> Initialized core');

    this.registerEvents();
};

GS.Editor.Core.prototype.registerEvents = function () {
    var self = this;

    $(this.config.el.editor).on(GS.Editor.Events.Core.Fetch.Categories, function () {
        self.getImageCategories();
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Core.Fetch.Logos.Keyword, function (ev, data) {
        self.getLogosByQuery(data.query, data.page);
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Core.Fetch.Logos.Default, function (ev, data) {
        self.getLogosByCategory(data.id, data.page, data.filter);
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Core.Save.Logo, function (ev, data) {
        if (this.helpers.isLoggedIn()) {
            self.saveLogo(data);
        } else {
            $(this.config.el.editor)
                .trigger(GS.Editor.Events.Login.LoginOrRegister)
                .one(GS.Editor.Events.Login.LoggedIn, function () {
                    self.saveLogo(data);
                });
        }
    }.bind(this));
};

GS.Editor.Core.prototype.getImageCategories = function () {
    $.get(this.config.api.get.categories).done(function (data) {
        $(this.config.el.editor).trigger(GS.Editor.Events.Core.Fetched.Categories, [
            { categories: data.data }
        ]);
    }.bind(this));
};

GS.Editor.Core.prototype.getLogosByQuery = function (queryKeyword, queryPage) {
    $.get(this.config.api.get.logos.search + queryKeyword + '/' + queryPage).done(function (data) {
        var data = {
            keyword: queryKeyword,
            logos: data.data,
            pagination: {
                current: data.data.page,
                total: data.data.max,
                firstPage: data.data.first_page,
                lastPage: data.data.last_page,
                perPage: data.data.per_page
            }
        };

        $(this.config.el.editor).trigger(GS.Editor.Events.Core.Fetched.Logos.Keyword, [data]);
    }.bind(this));
};

GS.Editor.Core.prototype.getLogosByCategory = function (queryId, queryPage, queryFilter) {
    var perPage = this.helpers.isDevice('phone') ? 15 : 20;

    var url = this.config.api.get.logos[queryFilter];
    url += queryId;
    url += '/' + queryPage;
    url += '?perPage=' + perPage;

    $.get(url).done(function (data) {
        data = data.data;

        var pagination = {
            current: data.page,
            total: data.max,
            firstPage: data.first_page,
            lastPage: data.last_page,
            perPage: data.per_page
        };

        var category = data.category || {
                id: 0,
                name: 'All'
            };

        $(this.config.el.editor).trigger(GS.Editor.Events.Core.Fetched.Logos.Default, [{
            logos: data,
            category: category,
            filter: queryFilter,
            pagination: pagination
        }]);
    }.bind(this));
};

/**
 * Get the actual code of the SVG element
 * [WIP]
 *
 * @param  {String} url  The URL of the target SVG
 * @param  {String} ev   The event to trigger after fetching (depending on if it's shape or logo)
 */
GS.Editor.Core.prototype.getSvgCode = function (url, ev) {
    var $div = $('<div />');

    function cleanString(input) {
        input = input.replace(/NaN/gm, '0');
        input = input.replace(/-?Infinity/gm, '0');
        input = input.replace(/\&[^\s;]+?;/gm, function (m) {
            $div.html(m);

            return $div[0].innerText;
        });

        // Can safely replace ALL ampersands now, because we decoded them above
        input = input.replace(/\&/gm, '&amp;');

        return input.trim();
    }

    $.ajax({
        url: url,
        cache: false,
        data: {},
        dataType: 'text',
        success: function (str) {
            // We don't care about the XML declaration, DOCTYPE declaration or about Illustrator's comments
            str = str.substr(str.indexOf('<svg'));

            // Take the defs (fonts/styles) out first, since they slow shit down
            var defsStart = str.indexOf('<defs>');
            if (defsStart >= 0) {
                var defsLength = str.indexOf('</defs>') - defsStart + '</defs>'.length;
                str = str.substr(0, defsStart) + str.substr(defsStart + defsLength);
            }

            // Clean the XML up a bit before we parse it.
            str = str.replace(/(\S+?)="(.+?)"/gm, function (m, attr, val) {
                return attr + '="' + cleanString(val) + '"'
            });
            str = cleanString(str);
            str = str.replace(/xml:space=".+?"/g, '');
            str = str.replace(/xmlns:xml=".+?"/g, '');

            var xmlDoc = (new DOMParser()).parseFromString(str, 'text/xml');

            var xmlSerializer = new XMLSerializer();
            var $editor = $(this.config.el.editor);

            var svg = xmlDoc.firstChild;
            var viewBox = svg.getAttribute('viewBox').split(' ') || [0, 0, 0, 0];

            viewBox = {
                x: parseFloat(viewBox[0]),
                y: parseFloat(viewBox[1]),
                w: parseFloat(viewBox[2]),
                h: parseFloat(viewBox[3])
            };

            // Don't allow negative values
            if (viewBox.x < 0) {
                viewBox.w += Math.abs(viewBox.x);
                viewBox.x = 0;
            }

            if (viewBox.y < 0) {
                viewBox.h += Math.abs(viewBox.y);
                viewBox.y = 0;
            }

            if (viewBox.w <= 0) {
                viewBox.w = $editor.width();
            }

            if (viewBox.h <= 0) {
                viewBox.h = $editor.height();
            }

            // Will be reusing these a few times.
            var i, transformedNodes, node, transform, offset;

            try {
                transformedNodes = svg.querySelectorAll('[transform]');

                for (i = 0; i < transformedNodes.length; ++i) {
                    node = transformedNodes[i];
                    transform = this.helpers.parseTransform(node.getAttribute('transform'));

                    // If any nodes have negative transforms, make sure the viewbox is big enough.
                    if (transform.translate.x < 0 && viewBox.x > transform.translate.x) {
                        offset = Math.abs(transform.translate.x);
                        viewBox.x -= offset;
                        viewBox.w += offset;
                    }

                    if (transform.translate.y < 0 && viewBox.y > transform.translate.y) {
                        offset = Math.abs(transform.translate.y);
                        viewBox.y -= offset;
                        viewBox.h += offset;
                    }
                }
            } catch (e) {
            }

            // So now, if the viewbox extends beyond the visible area, we need to make some adjustments again.
            if (viewBox.w > $editor.width() || viewBox.h > $editor.height()) {
                // Take whichever has the biggest discrepancy and scale on both axis' equally
                var ratio = Math.max(
                    viewBox.w / $editor.width(),
                    viewBox.h / $editor.height()
                );

                try {
                    transformedNodes = svg.querySelectorAll('[transform]');

                    for (i = 0; i < transformedNodes.length; ++i) {
                        node = transformedNodes[i];
                        transform = this.helpers.parseTransform(node.getAttribute('transform'));

                        if (transform.scale.y) {
                            transform.scale.y = transform.scale.y / ratio;
                        }

                        if (transform.scale.x) {
                            transform.scale.x = transform.scale.x / ratio;
                        }

                        node.setAttribute('transform', this.helpers.buildTransform(transform));
                    }
                } catch (e) {
                }
            }

            try {
                var tspans = svg.querySelectorAll('tspan');

                for (i = 0; i < tspans.length; ++i) {
                    var tspan = tspans[i];

                    this.helpers.setText(tspan.parentNode, tspan.textContent);
                }
            } catch (e){}

            var fullCode = '';
            for (i = 0; i < svg.childNodes.length; ++i) {
                fullCode += xmlSerializer.serializeToString(svg.childNodes[i]);
            }

            // Not sure why, but some ampersands are not re-encoded when fetching innerHTML ¯\_(ツ)_/¯
            fullCode = fullCode.replace(/\&(\s)/gm, '&amp;$1');

            // Also get rid of extra xmlns attributes
            fullCode = fullCode.replace(/xmlns=".+?"/g, '');

            $editor.trigger(ev, [{
                svg: fullCode,
                viewBox: viewBox
            }]);
        }.bind(this)
    });
};

GS.Editor.Core.prototype.saveLogo = function (data) {
    var self = this;

    data = data || {};

    // Enforce this.
    data.id = self.helpers.getCurrentLogoId();

    if (data.silent === false) {
        this.helpers.toggleWorkingOverlay('Saving...');
    }

    $.post(this.config.api.post.saveLogo, data)
        .done(function (resp) {
            if (data.silent === false) {
                this.helpers.toggleWorkingOverlay('Logo saved.');

                setTimeout(function () {
                    self.helpers.toggleWorkingOverlay();
                }, 1000);
            }

            window.GSEditor.currentLogoId = resp.data.id;
            window.GSEditor.savedHistoryPosition = window.GSEditor.history.historyArray.length;

            $(this.config.el.editor).trigger(GS.Editor.Events.Core.Saved.Logo, [
                { id: resp.data.id }
            ]);

            if (typeof data.cb === "function") {
                data.cb();
            }
        }.bind(this))
        .fail(function (jqXHR) {
            if (jqXHR.status == 401) {
                // Session has expired or something..need to deal with logins so much better
                $('body').addClass('not-logged-in');

                $(this.config.el.editor).trigger(GS.Editor.Events.Core.Save.Logo);
            }
        }.bind(this));
};
;/* -----------------------------------------
 Logo Editor sidebar module

 @author Konstantinos Vasileiou <kostas@neverbland.com>
 @copyrights Neverbland 2014
 ----------------------------------------- */

/**
 * Sidebar constructor
 *
 * @param {Object} options   Sidebar initialization options
 * @param {Object} helpers   Editor helpers
 * @param {Object} templates Editor templates
 * @param {Object} core      Editor core
 */
GS.Editor.Sidebar = function (options, helpers, templates, core) {
    this.options = options || {};

    this.defaults = {
        el: {
            sidebar: '.sidebar',
            sidebarClose: '.sidebar__close',
            editorItemsSidebar: '.sidebar__sub--editor-items',
            editorActionsSidebar: '.sidebar__sub--editor-actions',
            sidebarTriggerExpand: '[data-sidebar-trigger]',
            sidebarMenus: {
                // All items sub-sidebar menus
                allItems: '.sidebar__sub--editor-items .menu',

                // All items sub-sidebar menu text+graphic
                allItemsTitles: '.sidebar__sub--editor-items .menu-item__title',

                // All actions sub-sidebar menus
                allActions: '.sidebar__sub--editor-actions .menu-item',

                // Specific menus from items sub-sidebar
                logo: '.menu--logo',
                identity: '.menu--identity',
                images: '.menu--images',
                shapes: '.menu--shapes'
            },
            sidebarMenuIdentityFieldset: '.menu--identity__fieldset',
            sidebarApplyIdentityButton: '.menu--identity__button--apply',
            sidebarAddTaglineButton: '.menu--identity__button--add-new-tagline',
            sidebarRemoveTaglineButton: '.menu--identity__button--remove-tagline',
            sidebarActions: {
                save: '.menu--save',
                buy: '.menu--buy',
                download: '.menu--download',
                preview: '.menu--preview',
                editor: '.menu--editor'
            },
            sidebarImageSearchInput: '.menu--images__search-input',
            sidebarActionTriggerExpand: '[data-sidebar-action-trigger]',
            menuContent: '.menu__content',
            menuContentInner: '.menu__content__inner',
            category: '.categories__category',
            categoriesMobile: 'select.categories'
        },
        coreClasses: {
            sidebarExpanded: 'sidebar--expanded',
            sidebarHidden: 'sidebar--hidden',
            sidebarSubHidden: 'sidebar__sub--hidden',
            sidebarExpandedMenu: 'menu--expanded',
            categoryActive: 'categories__category--active',
            sidebarActionActive: 'menu--active'
        },
        attributes: {
            sidebarMenuHeight: 'sidebar-menu-height',
            categoryId: 'category-id',
            shapeCategory: 'shape-category',
            pagination: {
                categoryId: 'logo-category-id',
                page: 'logo-page',
                filter: 'logo-filter',
                keyword: 'logo-keyword'
            }
        }
    };

    this.windowHeight = window.innerHeight;

    // Sidebar height caching
    this.editorItemsSidebarHeight = 0;
    this.editorActionsSidebarHeight = 0;

    // Menu Header height caching
    this.itemsSidebarMenuHeadersHeight = 0;

    this.imageSearchTimeout = 0;
    this.resizeWindowTimeout = 0;

    this.helpers = helpers;
    this.templates = templates;
    this.core = core;

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Sidebar.prototype.initialize = function () {
    console.log('> Initialized sidebar');

    this.registerEvents();
};

GS.Editor.Sidebar.prototype.registerEvents = function () {
    var self = this;

    $(this.config.el.sidebar).on('click', this.config.el.sidebarTriggerExpand, function (ev) {
        if ($(this).hasClass(self.config.coreClasses.sidebarExpandedMenu)) {
            return;
        }

        var $menu = $(this);
        var templateName = $menu.data(self.templates.config.attributes.template);

        self.expandMenu($menu);

        // Load the right mustache templates if present (only images/shapes)
        if (typeof templateName != 'undefined') {
            self.templates.loadSidebarTemplate(templateName);
        }

        // Expand the sidebar if collapsed
        if (!$(self.config.el.sidebar).hasClass(self.config.coreClasses.sidebarExpanded)) {
            self.expandSidebar();
        }

        if ($menu.hasClass(self.helpers.getRawName(self.config.el.sidebarMenus.identity))) {
            self.helpers.submitGaEvent(GS.Editor.Events.GA.Identity);
        }
        if ($menu.hasClass(self.helpers.getRawName(self.config.el.sidebarMenus.images))) {
            self.helpers.submitGaEvent(GS.Editor.Events.GA.Images);
        }
        if ($menu.hasClass(self.helpers.getRawName(self.config.el.sidebarMenus.shapes))) {
            self.helpers.submitGaEvent(GS.Editor.Events.GA.Shapes);
        }

        $(self.config.el.sidebar).trigger(GS.Editor.Events.Sidebar.Navigated);
    });

    $(this.config.el.sidebar).on('click', this.config.el.sidebarActionTriggerExpand, function (ev) {
        var $this = $(this);

        // Is it the editor?
        if ($(this).hasClass(self.helpers.getRawName(self.config.el.sidebarActions.editor))) {
            self.helpers.refreshSVG();
            self.collapseActionsSidebar();
            window.GSEditor.preview.resetPreviewTemplate();
            window.GSEditor.payment.resetPaymentTemplate();
            // Or not?
        } else {
            self.expandActionsSidebar();

            if ($(this).hasClass(self.helpers.getRawName(self.config.el.sidebarActions.buy))) {
                window.GSEditor.preview.resetPreviewTemplate();
            }

            if ($(this).hasClass(self.helpers.getRawName(self.config.el.sidebarActions.preview))) {
                window.GSEditor.payment.resetPaymentTemplate();
            }
        }

        $(self.config.el.sidebarActionTriggerExpand).removeClass(self.config.coreClasses.sidebarActionActive);

        $(this).addClass(self.config.coreClasses.sidebarActionActive);
        $(self.config.el.sidebar).trigger(GS.Editor.Events.Sidebar.Navigated);
    });

    $body.on('click', this.config.el.overlay, function (ev) {
        self.collapseSidebar();
    });

    $body.on('click', this.config.el.sidebarClose, function (ev) {
        self.collapseSidebar();
    });

    $body.on('click', this.config.el.category, function (ev) {
        var $this = $(this);
        var isShape = !!$this.data(self.config.attributes.shapeCategory);

        if ($this.hasClass(self.config.coreClasses.categoryActive)) {
            return;
        }

        if (isShape) {
            var shapeCategory = $this.data(self.config.attributes.shapeCategory);

            self.templates.fetchAndRenderShapesByCategoryTemplate(shapeCategory);
        } else {
            $(self.config.el.editor).trigger(GS.Editor.Events.Core.Fetch.Logos.Default, [{
                id: $this.data(self.config.attributes.categoryId),
                page: 0,
                filter: 'normal'
            }]);
        }

        $(self.config.el.category).removeClass(self.config.coreClasses.categoryActive);
        $this.addClass(self.config.coreClasses.categoryActive);
    });

    $body.on('change', this.config.el.categoriesMobile, function (ev) {
        var $this = $(this);
        var $selected = $this.find('option:selected');

        $(self.config.el.editor).trigger(GS.Editor.Events.Core.Fetch.Logos.Default, [{
            id: $selected.data(self.config.attributes.categoryId),
            page: 0,
            filter: 'normal'
        }]);
    });

    $(this.config.el.sidebar).on('click', this.config.el.sidebarAddTaglineButton, function () {
        self.addNewTagline();
    });

    $(this.config.el.sidebar).on('click', this.config.el.sidebarApplyIdentityButton, function () {
        var $tagline = $(this).closest(self.config.el.sidebarMenuIdentityFieldset);
        var $input = $tagline.find('.menu--identity__input');

        $input.trigger($.Event('keydown', { which: 13, keyCode: 13 }));
    });

    $(this.config.el.sidebar).on('click', this.config.el.sidebarRemoveTaglineButton, function () {
        var $tagline = $(this).closest(self.config.el.sidebarMenuIdentityFieldset);
        var targetTagline = $tagline.find('.menu--identity__input--tagline').attr('data-target-tagline');
        var $svgTagline = $('#' + targetTagline);

        $(self.config.el.editor).trigger(GS.Editor.Events.Importer.Deleted.Tagline, [{ item: $svgTagline }]);
    });

    $(this.config.el.editor).on(GS.Editor.Events.Importer.Deleted.Tagline, function (ev, data) {
        var taglineId = data.item.attr('id');
        var $tagline = $('[data-target-tagline="' + taglineId + '"]').closest(self.config.el.sidebarMenuIdentityFieldset);

        self.removeTagline($tagline);
    });

    $body.on('click', '[data-logo-pagination]', function (ev) {
        var $this = $(this);

        // Clicking on filter sets it as active immediately;
        // no need to wait for the template to be repopulated
        var isPhone = self.helpers.isDevice('phone');
        var classPrefix = isPhone ? 'logo-listing--mobile' : 'logo-listing';

        if ($this.hasClass(classPrefix + '__filter')) {
            $('.' + classPrefix + '__filter').removeClass(classPrefix + '__filter--active');
            $(this).addClass(classPrefix + '__filter--active');
        }

        $(self.config.el.editor).trigger(GS.Editor.Events.Core.Fetch.Logos.Default, [{
            id: $this.data(self.config.attributes.pagination.categoryId),
            page: $this.data(self.config.attributes.pagination.page),
            filter: $this.data(self.config.attributes.pagination.filter)
        }]);
    });

    $body.on('click', '[data-logo-search]', function (ev) {
        var $this = $(this);

        $(self.config.el.editor).trigger(GS.Editor.Events.Core.Fetch.Logos.Keyword, [{
            page: $this.data(self.config.attributes.pagination.page),
            query: $this.data(self.config.attributes.pagination.keyword)
        }]);
    });

    $body.on('keydown', this.config.el.sidebarImageSearchInput, function (ev) {
        var $this = $(this);

        clearTimeout(self.imageSearchTimeout);
        self.imageSearchTimeout = setTimeout(function () {
            $(self.config.el.editor).trigger(GS.Editor.Events.Core.Fetch.Logos.Keyword, [{
                query: $this.val(),
                page: 1
            }]);
        }, 500);
    });

    // Load the image categories template
    // Fired when category logos are
    // fetched successfully
    $(this.config.el.editor).on(GS.Editor.Events.Core.Fetched.Logos.Default, function (ev, data) {
        self.templates.fetchAndRenderLogosTemplate(data);
    });

    // Load the image categories template
    // Fired when category logos are
    // fetched successfully
    $(this.config.el.editor).on(GS.Editor.Events.Core.Fetched.Logos.Keyword, function (ev, data) {
        self.templates.fetchAndRenderLogosByKeywordTemplate(data);
    });

    $(this.config.el.sidebar).on('click', this.config.el.sidebarActions.save, function () {
        var cb = function () {
            $(self.config.el.sidebarActions.buy).trigger('click');
        };

        self.helpers.saveLogo(cb);
    });

    $(this.config.el.sidebar).on('click', this.config.el.sidebarActions.download, function () {
        var cb = function () {
            setTimeout(function () {
                window.location.href = '/your-logo-files'
            }, 500);
        };

        self.helpers.saveLogo(cb);
    });

    // Re-calculate the sidebar on window resize
    if (this.helpers.isDevice('phone')) {
        var initial = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        $(window).on('orientationchange', function () {
            clearTimeout(self.resizeWindowTimeout);
            self.resizeWindowTimeout = setTimeout(function () {
                self.doCalculate();
            }, 150);
        });

        $(window).on('resize', function () {
            if (window.innerWidth == initial.width && window.innerHeight < initial.height) {
                $body.addClass('soft-keyboard');
            } else {
                $body.removeClass('soft-keyboard');
            }
        });
    } else {
        $(window).on('resize', function () {
            clearTimeout(self.resizeWindowTimeout);
            self.resizeWindowTimeout = setTimeout(function () {
                self.doCalculate();
            }, 150);
        });
    }

    $body.on(GS.Editor.Events.Sidebar.Calculate, function () {
        self.doCalculateActionsSidebar();
    });
};

/**
 * Calculate the sub-sidebars
 */
GS.Editor.Sidebar.prototype.doCalculate = function () {
    this.windowHeight = window.innerHeight;
    this.editorActionsSidebarHeight = 0;
    $(this.config.el.editorActionsSidebar).removeAttr('style');

    setTimeout(function () {
        this.doCalculateMenus();
        this.doCalculateActionsSidebar();
    }.bind(this), 0);
};

/**
 * Calculate the height of the menus' content (items sub-sidebar)
 * and then set them to 0
 *
 * @return {Object} Sidebar instance
 */
GS.Editor.Sidebar.prototype.doCalculateMenus = function () {
    // Figure out the headers' heights
    var itemsSidebarMenuHeadersHeight = 0;
    $(this.config.el.sidebarMenus.allItemsTitles).each(function (index, menuHeader) {
        var $header = $(menuHeader);

        if ($header.is(':visible')) {
            itemsSidebarMenuHeadersHeight += $(menuHeader).outerHeight();
        }
    }.bind(this));

    $(this.config.el.menuContent).removeAttr('style');

    $(this.config.el.sidebarMenus.allItems).each(function (index, menu) {
        var $menu = $(menu);
        var $menuContent = $menu.find(this.config.el.menuContent);
        var $menuContentInner = $menuContent.find(this.config.el.menuContentInner);
        var menuContentHeight;

        if ($menu.hasClass(this.helpers.getRawName(this.config.el.sidebarMenus.images)) ||
            $menu.hasClass(this.helpers.getRawName(this.config.el.sidebarMenus.shapes))) {
            menuContentHeight = this.windowHeight - itemsSidebarMenuHeadersHeight;
        } else {
            menuContentHeight = $menuContentInner.outerHeight();
        }

        $menu.data(this.config.attributes.sidebarMenuHeight, menuContentHeight);

        if (!$menu.hasClass(this.config.coreClasses.sidebarExpandedMenu)) {
            $menuContent.css({ height: 0 });
        }
    }.bind(this));

    return this;
};

/**
 * Calculate the action sidebar
 */
GS.Editor.Sidebar.prototype.doCalculateActionsSidebar = function () {
    this.editorItemsSidebarHeight = $(this.config.el.editorItemsSidebar).outerHeight();
    this.editorActionsSidebarHeight = this.windowHeight - this.editorItemsSidebarHeight;

    $(this.config.el.editorActionsSidebar).css({ height: this.editorActionsSidebarHeight });
};

GS.Editor.Sidebar.prototype.handleMenuWhenItemIsPurchased = function () {
    $(this.config.el.sidebarMenus.images).remove();
    $(this.config.el.sidebarActions.buy).remove();
};

GS.Editor.Sidebar.prototype.handleMenuWhenItemIsNotPurchased = function () {
    $(this.config.el.sidebarActions.save).hide();
    $(this.config.el.sidebarActions.download).remove();
};

/**
 * Expand actions sidebar
 *
 * @return {Object} Sidebar instance
 */
GS.Editor.Sidebar.prototype.expandActionsSidebar = function () {
    $(this.config.el.editorActionsSidebar).css({ height: this.helpers.isDevice('phone') ? '100%' : window.innerHeight - $(this.config.el.sidebarMenus.logo).outerHeight() });

    return this;
};

/**
 * Collapse actions sidebar
 *
 * @return {Object} Sidebar instance
 */
GS.Editor.Sidebar.prototype.collapseActionsSidebar = function () {
    $(this.config.el.editorActionsSidebar).css({ height: this.editorActionsSidebarHeight });

    return this;
};

/**
 * Reveals the sidebar when the editor/page is fully loaded
 *
 * @return {Object} Sidebar instance
 */
GS.Editor.Sidebar.prototype.revealSidebar = function () {
    $(this.config.el.sidebar).removeClass(this.config.coreClasses.sidebarHidden);

    return this;
};

/**
 * Expand the sidebar (mostly/always when clicking on a menu)
 *
 * @return {Object} Sidebar instance
 */
GS.Editor.Sidebar.prototype.expandSidebar = function () {
    $(this.config.el.sidebar).addClass(this.config.coreClasses.sidebarExpanded);
    $(this.config.el.editorActionsSidebar).addClass(this.config.coreClasses.sidebarSubHidden);

    $(this.config.el.editor).trigger(GS.Editor.Events.Sidebar.Expanded);

    return this;
};

/**
 * Collapse the sidebar
 *
 * @return {Object} Sidebar instance
 */
GS.Editor.Sidebar.prototype.collapseSidebar = function () {
    this.collapseMenus();

    $(this.config.el.sidebar).removeClass(this.config.coreClasses.sidebarExpanded);
    $(this.config.el.editorActionsSidebar).removeClass(this.config.coreClasses.sidebarSubHidden);

    // Remove the active class on the categories
    $(this.config.el.category).removeClass(this.config.coreClasses.categoryActive);

    $(this.config.el.editor).trigger(GS.Editor.Events.Sidebar.Collapsed);

    return this;
};

/**
 * Expand the target menu
 *
 * @param  {jQuery} $menu Menu item
 * @return {Object} Sidebar instance
 */
GS.Editor.Sidebar.prototype.expandMenu = function ($menu) {
    var menuHeight = $menu.data(this.config.attributes.sidebarMenuHeight);

    this.collapseMenus();

    $(this.config.el.editor).trigger(GS.Editor.Events.Sidebar.Menu.Collapsed);
    $(this.config.el.category).removeClass(this.config.coreClasses.categoryActive);

    $menu
        .addClass(this.config.coreClasses.sidebarExpandedMenu)
        .find(this.config.el.menuContent)
        .css({ height: menuHeight });

    return this;
};

/**
 * Collapses all menus (called before expanding
 * a different menu or collapsing the sidebar)
 *
 * @return {Object} Sidebar instance
 */
GS.Editor.Sidebar.prototype.collapseMenus = function () {
    $(this.config.el.sidebarTriggerExpand).removeClass(this.config.coreClasses.sidebarExpandedMenu);
    $(this.config.el.sidebarMenus.allItems)
        .find(this.config.el.menuContent)
        .css({ height: 0 });

    return this;
};

GS.Editor.Sidebar.prototype.addNewTagline = function (value) {
    var $sidebarMenuIdentity = $(this.config.el.sidebarMenus.identity);
    var $sidebarMenuIdentityContent = $sidebarMenuIdentity.find(this.config.el.menuContent);
    var sidebarMenuIdentityHeight = $sidebarMenuIdentity.data(this.config.attributes.sidebarMenuHeight);
    var newMenuContentHeight;
    var $tagline = $([
        '<form action="#" onsubmit="return false;">',
        '  <fieldset class="menu--identity__fieldset">',
        '    <input data-target-tagline="" class="menu--identity__input menu--identity__input--tagline" type="text" placeholder="Your tagline" value="' + value + '">',
        '    <button class="menu--identity__button--apply">Go</button>',
        '    <button class="menu--identity__button--remove-tagline"></button>',
        '  </fieldset>',
        '</form>'
    ].join(''));

    $tagline.insertBefore($(this.config.el.sidebarAddTaglineButton));
    $sidebarMenuIdentityContent.removeAttr('style');

    this.doCalculate();

    $(this.config.el.editor).one(GS.Editor.Events.Core.Drawn.Tagline, function (ev, data) {
        $tagline.find('.menu--identity__input--tagline').attr('data-target-tagline', data.taglineId);
    });

    $(this.config.el.editor).trigger(GS.Editor.Events.Core.Draw.Tagline);
};

GS.Editor.Sidebar.prototype.removeTagline = function ($tagline) {
    var $sidebarMenuIdentity = $(this.config.el.sidebarMenus.identity);
    var $sidebarMenuIdentityContent = $sidebarMenuIdentity.find(this.config.el.menuContent);
    var sidebarMenuIdentityHeight = $sidebarMenuIdentity.data(this.config.attributes.sidebarMenuHeight);
    var newMenuContentHeight = sidebarMenuIdentityHeight - $tagline.outerHeight();

    $tagline.remove();

    if (this.helpers.isSidebarExpanded() === false) {
        $sidebarMenuIdentityContent.css({ height: 0 });
    } else {
        $sidebarMenuIdentityContent.css({ height: newMenuContentHeight });
    }

    $sidebarMenuIdentity.data(this.config.attributes.sidebarMenuHeight, newMenuContentHeight);
};
;/* -----------------------------------------
 Logo Editor Templates module

 @author Konstantinos Vasileiou <kostas@neverbland.com>
 @copyrights Neverbland 2014
 ----------------------------------------- */

/**
 * Templates constructor

 * @param {Object} options Templates initialization options
 * @param {GS.Editor.Helpers} helpers
 * @param {Object} core Editor core
 */
GS.Editor.Templates = function (options, helpers, core) {
    this.options = options || {};

    this.helpers = helpers;
    this.core = core;

    var isPhone = this.helpers.isDevice('phone');

    this.defaults = {
        attributes: {
            template: 'template'
        },
        templates: {
            sidebar: {
                shapes: {
                    name: 'sidebar-shape-listing.mst',
                    target: '.menu--shapes .menu__content__inner'
                },
                shapesByCategory: {
                    basic: {
                        name: 'sidebar-shape-basic-listing.mst',
                        target: '.logo-listing'
                    },
                    badges: {
                        name: 'sidebar-shape-badges-listing.mst',
                        target: '.logo-listing'
                    },
                    clipart: {
                        name: 'sidebar-shape-clipart-listing.mst',
                        target: '.logo-listing'
                    },
                    decorative: {
                        name: 'sidebar-shape-decorative-listing.mst',
                        target: '.logo-listing'
                    },
                    lines: {
                        name: 'sidebar-shape-lines-listing.mst',
                        target: '.logo-listing'
                    },
                    swooshes: {
                        name: 'sidebar-shape-swooshes-listing.mst',
                        target: '.logo-listing'
                    },
                    symbols: {
                        name: 'sidebar-shape-symbols-listing.mst',
                        target: '.logo-listing'
                    }
                },
                images: {
                    name: isPhone ? 'sidebar-image-listing-mobile.mst' : 'sidebar-image-listing.mst',
                    target: '.menu--images .menu__content__inner'
                },
                logos: {
                    name: isPhone ? 'sidebar-logo-listing-mobile.mst' : 'sidebar-logo-listing.mst',
                    target: isPhone ? '.logo-listing--mobile' : '.logo-listing'
                },
                search: {
                    name: isPhone ? 'sidebar-logo-search-results-mobile.mst' : 'sidebar-logo-search-results.mst',
                    target: isPhone ? '.logo-listing--mobile' : '.logo-listing'
                }
            },
            svg: {
                master: {
                    name: 'master.mst',
                    target: '.editor'
                },
                logo: {
                    name: 'logo.mst',
                    target: '.canvas'
                },
                shape: {
                    name: 'shape.mst',
                    target: '.canvas'
                },
                business: {
                    name: 'business.mst',
                    target: '.canvas'
                },
                tagline: {
                    name: 'tagline.mst',
                    target: '.canvas'
                }
            },
            preview: {
                master: {
                    name: 'master.mst',
                    target: '.preview'
                },
                tshirt: {
                    name: 'tshirt.mst',
                    target: '[data-preview="tshirt"]'
                },
                stationery: {
                    name: 'stationery.mst',
                    target: '[data-preview="stationery"]'
                },
                web: {
                    name: 'web.mst',
                    target: '[data-preview="web"]'
                }
            },
            toolbars: {
                master: {
                    name: 'master.mst',
                    target: '.toolbar__wrapper'
                },
                image: {
                    name: 'image.mst',
                    target: '[data-toolbar="image"]'
                },
                shape: {
                    name: 'shape.mst',
                    target: '[data-toolbar="shape"]'
                },
                text: {
                    name: 'text.mst',
                    target: '[data-toolbar="text"]'
                },
                fonts: {
                    name: 'fonts.mst',
                    target: '[data-toolbar-component="font-family"]'
                }
            }
        },
        settings: {
            templateSidebarUrl: '/builder_assets/templates/sidebar/',
            templateSvgUrl: '/builder_assets/templates/svg/',
            templatePreviewUrl: '/builder_assets/templates/preview/',
            templateToolbarsUrl: '/builder_assets/templates/toolbars/'
        }
    };

    // Template caching
    this.templateCache = {
        sidebar: {
            shapes: '',
            images: '',
            logos: '',
            search: '',
            shapesByCategory: {
                basic: '',
                badges: '',
                clipart: '',
                decorative: '',
                lines: '',
                swooshes: '',
                symbols: ''
            }
        },
        svg: {
            master: '',
            logo: '',
            shape: '',
            business: '',
            tagline: ''
        },
        preview: {
            master: '',
            tshirt: '',
            stationery: '',
            web: ''
        },
        toolbars: {
            master: '',
            image: '',
            shape: '',
            text: ''
        }
    };

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);
};

/**
 *
 */
GS.Editor.Templates.prototype.fetchAndRenderFonts = function () {
    var self = this;

    console.log('   + Loading Custom Fonts (Standalone) ');

    $.getJSON('/fonts-builder.json').done(function (data) {
        var fontData = data;

        $.get(self.config.settings.templateToolbarsUrl + self.config.templates.toolbars.fonts.name, function (template) {
            $('#font-styles').text(Mustache.render(template, fontData));
        }.bind(this));
    }.bind(this));
};

/**
 * Fetching and populating the external mustache
 * templates when the target menu item requires it
 *
 * @param  {String} templateName The template name (either `shapes` or `images`)
 * @return {Object}              Templates instance
 */
GS.Editor.Templates.prototype.loadSidebarTemplate = function (templateName) {
    console.log(' ~> Loading [' + templateName + '] template ');

    var _fetchTemplate = function (templateData, _callback) {
        if (this.templateCache.sidebar[templateName] === '') {
            $.get(this.config.settings.templateSidebarUrl + this.config.templates.sidebar[templateName].name, function (template) {
                this.templateCache.sidebar[templateName] = template;

                _renderTemplate(template, templateData, _callback);
            }.bind(this));
        } else {
            _renderTemplate(this.templateCache.sidebar[templateName], templateData, _callback)
        }
    }.bind(this);

    var _renderTemplate = function (template, templateData, _callback) {
        var rendered = Mustache.render(template, templateData || {});

        $(this.config.templates.sidebar[templateName].target).html(rendered);

        _callback();
    }.bind(this);

    // Only fetch the template when it's not already populated
    if ($(this.config.templates.sidebar[templateName].target).html() === '') {
        // Images?
        if (templateName === 'images') {
            var _callback = function () {
                // Initialize scrollfoo instance
                window.categoriesScrollFoo = new ScrollFoo({
                    parentEl: '.scrollfoo__parent--categories',
                    scrollerEl: '.scrollfoo__scroller--categories',
                    visibleParentHeight: function () {
                        return $('.menu--images').data('sidebar-menu-height') - $('.menu--images__search-input').outerHeight() - 20; // give it some space
                    },
                    realParentHeight: function () {
                        return $('.scrollfoo__parent--categories').outerHeight();
                    }
                });
            };

            // Adding an event listener to only render the template when the data is fetched
            $(this.config.el.editor).one(GS.Editor.Events.Core.Fetched.Categories, function (ev, data) {
                _fetchTemplate(data, _callback);
            });

            // Trigger the event to fetch the templates
            $(this.config.el.editor).trigger(GS.Editor.Events.Core.Fetch.Categories);

            this.core.getImageCategories();
            // Or shapes?
        } else {
            var _callback = function () {
                // Initialize scrollfoo instance
                window.shapesScrollFoo = new ScrollFoo({
                    parentEl: '.scrollfoo__parent--shapes',
                    scrollerEl: '.scrollfoo__scroller--shapes',
                    visibleParentHeight: function () {
                        return $('.menu--shapes').data('sidebar-menu-height') - 20; // give it some space
                    },
                    realParentHeight: function () {
                        return $('.scrollfoo__parent--shapes').outerHeight();
                    }
                });
            };

            _fetchTemplate({}, _callback);
        }
    }

    return this;
};

/**
 * Populate and render the logo listing template, after performing a keyword search
 *
 * @param  {Object} searchData Search data (keyword, pagination ... That kind of stuff)
 * @return {Object}            Templates instance
 */
GS.Editor.Templates.prototype.fetchAndRenderLogosByKeywordTemplate = function (searchData) {
    var isPhone = this.helpers.isDevice('phone');
    var classPrefix = isPhone ? 'logo-listing--mobile' : 'logo-listing';
    var paginationData = this.getPaginationData(searchData.pagination.lastPage, isPhone ? 2 : 5, searchData.pagination.current);

    var _constructPaginationTemplate = function (paginationData) {
        var finalHtml = '';
        var currentHtml = '';
        var pageClass = classPrefix + '__pagination__page';
        var pageActiveClass = classPrefix + '__pagination__page--active';
        var pageGapFirstClass = classPrefix + '__pagination__page-gap--first';
        var pageGapLastClass = classPrefix + '__pagination__page-gap--last';
        var _singlePageTemplate = function (pageNumber, pageClass, pageNumberText) {
            pageNumberText = pageNumberText || pageNumber;

            return '<li' +
                ' data-logo-search' +
                ' data-logo-page="' + pageNumber + '"' +
                ' data-logo-keyword="' + searchData.keyword + '"' +
                ' class="' + pageClass + '">' + pageNumberText +
                '</li>';
        };
        var finalMaxPages;

        /**
         * Construct the "previous" button
         */
        if (!isPhone && paginationData.previous !== false) {
            currentHtml = _singlePageTemplate(paginationData.current - 1, pageClass, isPhone ? '&ldquo;' : 'PREVIOUS');
        }

        /**
         * Construct the gap after the "previous" button
         */
        if (paginationData.current > 3 && paginationData.max <= paginationData.total) {
            if (paginationData.total > 5) {
                var finalPageClass = pageClass;

                // Add gap to the first page, when the minimum
                // visible page is at least > first page + 1
                if (paginationData.firstGap === true) {
                    finalPageClass = finalPageClass + ' ' + pageGapFirstClass;
                }

                currentHtml = currentHtml + _singlePageTemplate(1, finalPageClass);
            }
        }

        /**
         * Construct the total amount of pages, after
         * we calculate the final page shown.
         *
         * If the maximum number shown equals the total
         * amount of pages, reduce the iteration by 1.
         */
        finalMaxPages = (function () {
            if (paginationData.max <= paginationData.total) {
                return paginationData.max;
            }
        })();

        for (var i = paginationData.min; i <= finalMaxPages; i++) {
            var finalPageClass = pageClass;

            if (i === paginationData.current) {
                finalPageClass = pageClass + ' ' + pageActiveClass;
            }

            currentHtml = currentHtml + _singlePageTemplate(i, finalPageClass);
        }

        if (paginationData.current < paginationData.total - 2 && paginationData.max !== paginationData.total) {
            var finalPageClass = pageClass;

            // Add gap to the first page, when the minimum
            // visible page is at least > first page + 1
            if (paginationData.lastGap === true) {
                finalPageClass = finalPageClass + ' ' + pageGapLastClass;
            }

            currentHtml = currentHtml + _singlePageTemplate(paginationData.total, finalPageClass);
        }

        /**
         * Construct the "next" button
         */
        if (!isPhone && paginationData.next !== false) {
            currentHtml = currentHtml + _singlePageTemplate(paginationData.current + 1, pageClass, isPhone ? '&rdquo;' : 'NEXT');
        }

        finalHtml = finalHtml + currentHtml;

        return $(finalHtml);
    };

    var _renderLogosByKeywordTemplate = function (template) {
        var rendered = Mustache.render(template, $.extend({}, searchData.logos, searchData));

        $(this.config.templates.sidebar.search.target)
            .html(rendered)
            .addClass(classPrefix + '--active');

        var $el = $('.' + classPrefix);
        if ($el.length > 0) {
            $el.scrollTop(0);
        }

        if (paginationData.total > 1) {
            $(this.config.templates.sidebar.search.target).find('.' + classPrefix + '__pagination__page__wrapper').append(_constructPaginationTemplate(paginationData));
        }

        // Give it some time before we show the elements
        setTimeout(function () {
            $('.' + classPrefix + '__logo').each(function (index) {
                var $logo = $(this);

                setTimeout(function () {
                    $logo.addClass(classPrefix + '__logo--active');
                }, 35 * index);
            });
        }, 500);
    }.bind(this);

    if (this.templateCache.sidebar.search === '') {
        $.get(this.config.settings.templateSidebarUrl + this.config.templates.sidebar.search.name, function (template) {
            this.templateCache.sidebar.search = template;

            _renderLogosByKeywordTemplate(template);
        }.bind(this));
    } else {
        _renderLogosByKeywordTemplate(this.templateCache.sidebar.search);
    }
};

/**
 * Populate and render the shape template of a specific shape category
 *
 * @param  {Object} categoryName Uh... The shape category name? Maybe?
 * @return {Object}              Templates instance
 */
GS.Editor.Templates.prototype.fetchAndRenderShapesByCategoryTemplate = function (categoryName) {
    var _renderShapesByCategoryTemplate = function (template) {
        var rendered = Mustache.render(template);

        $(this.config.templates.sidebar.shapesByCategory[categoryName].target)
            .html(rendered)
            .addClass('logo-listing--active');

        var $el = $('.logo-listing');
        if ($el.length > 0) {
            $el.scrollTop(0);
        }

        // Give it some time before we show the elements
        setTimeout(function () {
            $('.logo-listing__logo').each(function (index) {
                var $logo = $(this);

                setTimeout(function () {
                    $logo.addClass('logo-listing__logo--active');
                }, 35 * index);
            });
        }, 500);
    }.bind(this);

    if (this.templateCache.sidebar.shapesByCategory[categoryName] === '') {
        $.get(this.config.settings.templateSidebarUrl + this.config.templates.sidebar.shapesByCategory[categoryName].name, function (template) {
            this.templateCache.sidebar.shapesByCategory[categoryName] = template;

            _renderShapesByCategoryTemplate(template);
        }.bind(this));
    } else {
        _renderShapesByCategoryTemplate(this.templateCache.sidebar.shapesByCategory[categoryName]);
    }
};

/**
 * Populate and render the logo listing template, after selecting a logo category
 *
 * @param  {Object} categoryData Category data (selected category + logos of that category)
 * @return {Object}              Templates instance
 */
GS.Editor.Templates.prototype.fetchAndRenderLogosTemplate = function (categoryData) {
    var isPhone = this.helpers.isDevice('phone');
    var classPrefix = isPhone ? 'logo-listing--mobile' : 'logo-listing';

    var paginationData = this.getPaginationData(categoryData.pagination.lastPage, isPhone ? 2 : 5, categoryData.pagination.current);
    var _constructFiltersTemplate = function (category) {
        var logoFilters = [
            '<li data-logo-pagination data-logo-category-id="' + category.id + '" data-logo-page="0" data-logo-filter="normal" class="' + classPrefix + '__filter">ALL</li>',
            '<li data-logo-pagination data-logo-category-id="' + category.id + '" data-logo-page="0" data-logo-filter="popular" class="' + classPrefix + '__filter">POPULAR</li>',
            '<li data-logo-pagination data-logo-category-id="' + category.id + '" data-logo-page="0" data-logo-filter="newLogos" class="' + classPrefix + '__filter">NEW</li>',
            '<li data-logo-pagination data-logo-category-id="' + category.id + '" data-logo-page="0" data-logo-filter="random" class="' + classPrefix + '__filter">RANDOM</li>'
        ];

        if (category.children) {
            $.each(category.children, function (index, child) {
                logoFilters.push('<li data-logo-pagination data-logo-category-id="' + child.id + '" data-logo-page="0" data-logo-filter="normal" class="' + classPrefix + '__filter">' + child.name + '</li>');
            });
        }

        var $logoFilters = $(logoFilters.join(''));

        $logoFilters.each(function () {
            var $this = $(this);

            if ($this.attr('data-logo-category-id') === category.active && $this.attr('data-logo-filter') === categoryData.filter) {
                $this.addClass(classPrefix + '__filter--active');
            }
        });

        return $logoFilters;
    };
    var _constructPaginationTemplate = function (paginationData) {
        var finalHtml = '';
        var currentHtml = '';
        var pageClass = classPrefix + '__pagination__page';
        var pageActiveClass = classPrefix + '__pagination__page--active';
        var pageGapFirstClass = classPrefix + '__pagination__page-gap--first';
        var pageGapLastClass = classPrefix + '__pagination__page-gap--last';
        var _singlePageTemplate = function (categoryId, filterName, pageNumber, pageClass, pageNumberText) {
            var pageNumberText = pageNumberText || pageNumber;

            return '<li' +
                ' data-logo-pagination' +
                ' data-logo-category-id="' + categoryId + '"' +
                ' data-logo-filter="' + filterName + '"' +
                ' data-logo-page="' + pageNumber + '"' +
                ' class="' + pageClass + '">' + pageNumberText +
                '</li>';
        };
        var finalMaxPages;

        /**
         * Construct the "previous" button
         */
        if (!isPhone && paginationData.previous !== false) {
            currentHtml = _singlePageTemplate(categoryData.category.active, categoryData.filter, paginationData.current - 1, pageClass, isPhone ? '&ldquo;' : 'PREVIOUS');
        }

        /**
         * Construct the gap after the "previous" button
         */
        if (paginationData.current > 3 && paginationData.max <= paginationData.total) {
            if (paginationData.total > 5) {
                var finalPageClass = pageClass;

                // Add gap to the first page, when the minimum
                // visible page is at least > first page + 1
                if (paginationData.firstGap === true) {
                    finalPageClass = finalPageClass + ' ' + pageGapFirstClass;
                }

                currentHtml = currentHtml + _singlePageTemplate(categoryData.category.id, categoryData.filter, 1, finalPageClass);
            }
        }

        /**
         * Construct the total amount of pages, after
         * we calculate the final page shown.
         *
         * If the maximum number shown equals the total
         * amount of pages, reduce the iteration by 1.
         */
        finalMaxPages = (function () {
            if (paginationData.max <= paginationData.total) {
                return paginationData.max;
            }
        })();

        for (var i = paginationData.min; i <= finalMaxPages; i++) {
            var finalPageClass = pageClass;

            if (i === paginationData.current) {
                finalPageClass = pageClass + ' ' + pageActiveClass;
            }

            currentHtml = currentHtml + _singlePageTemplate(categoryData.category.id, categoryData.filter, i, finalPageClass);
        }

        if (paginationData.current < paginationData.total - 2 && paginationData.max !== paginationData.total) {
            var finalPageClass = pageClass;

            // Add gap to the first page, when the minimum
            // visible page is at least > first page + 1
            if (paginationData.lastGap === true) {
                finalPageClass = finalPageClass + ' ' + pageGapLastClass;
            }

            currentHtml = currentHtml + _singlePageTemplate(categoryData.category.id, categoryData.filter, paginationData.total, finalPageClass);
        }

        /**
         * Construct the "next" button
         */
        if (!isPhone && paginationData.next !== false) {
            currentHtml = currentHtml + _singlePageTemplate(categoryData.category.id, categoryData.filter, paginationData.current + 1, pageClass, isPhone ? '&rdquo;' : 'NEXT');
        }

        finalHtml = finalHtml + currentHtml;

        return $(finalHtml);
    };

    var _renderLogosTemplate = function (template) {
        var rendered = Mustache.render(template, $.extend({}, categoryData.logos, categoryData.category));

        $(this.config.templates.sidebar.logos.target)
            .html(rendered)
            .addClass(classPrefix + '--active')
            .find('.' + classPrefix + '__filter__wrapper')
            .append(_constructFiltersTemplate(categoryData.category));

        var $el = $('.' + classPrefix);
        if ($el.length > 0) {
            $el.scrollTop(0);
        }

        if (paginationData.total > 1) {
            $(this.config.templates.sidebar.logos.target).find('.' + classPrefix + '__pagination__page__wrapper').append(_constructPaginationTemplate(paginationData));
        }

        // Give it some time before we show the elements
        setTimeout(function () {
            $('.' + classPrefix + '__logo').each(function (index) {
                var $logo = $(this);

                setTimeout(function () {
                    $logo.addClass(classPrefix + '__logo--active');
                }, 35 * index);
            });
        }, 500);
    }.bind(this);

    if (this.templateCache.sidebar.logos === '') {
        $.get(this.config.settings.templateSidebarUrl + this.config.templates.sidebar.logos.name, function (template) {
            this.templateCache.sidebar.logos = template;

            _renderLogosTemplate(template);
        }.bind(this));
    } else {
        _renderLogosTemplate(this.templateCache.sidebar.logos);
    }
};

/**
 * THANKPH PHTEVEN!
 * @author Paul Werelds
 *
 * Pass in shit, get out a simple object that tells how to build your fucking ULs
 *
 * @param {array} items - The items you need to do shit with, passed as array because...dunno
 * @param {number} per_page - The number of items you want to display per page
 * @param {number} pages_to_display - How many pages you want to display at a time
 *                                      i.e. if you want to display 4,5,6,7,8 when you're on page 6 this number is 5
 * @param {number} current_page - What page you're on now; if not supplied, assumes 1
 *
 * @return {Object} {
 *     previous: number of the previous page; false if there is no previous page
 *     next: number of the next page; false if there is no next page
 *     current: convenience value because you already fucking knew this you dipshit, you passed it in damned.
 *     min: first page to display (with 4,5,6,7,8 that's 4)
 *     max: last page to display (with 4,5,6,7,8 that's 8)
 *     total: the total number of pages (items.length = 1000, per_page = 50 -> total = 20)
 * }
 */
GS.Editor.Templates.prototype.getPaginationData = function (maxPages, pagesToDisplay, currentPage) {
    if (!currentPage) {
        currentPage = 1;
    }

    var minPage, maxPage;

    // If we're at least over half of how many we want to display, do stuff
    // i.e. if we're on page 3 with 5 pages to display, but not if we're on 2
    if (currentPage > (pagesToDisplay / 2)) {
        // Since current page is the median, figure out the delta to either side
        // Floor it to keep it a nice number
        var delta = Math.floor(pagesToDisplay / 2);

        // Doh
        minPage = currentPage - delta;
        maxPage = currentPage + delta;

        // See, the shit above may very well put maxPage at 23 even though there are only 20 pages.
        // To fix that, just lower both min and max until we're back within acceptable ranges.
        while (maxPage > maxPages) {
            --maxPage;
            --minPage;
        }
    } else {
        // See, if we're under half of what we want to display, the minimum is *always* 1.
        // That in turn means that the maximum is *always* either
        // - the total number
        // - the number of pages we want to display
        minPage = 1;
        maxPage = Math.min(maxPages, pagesToDisplay);
    }

    return {
        previous: (currentPage > 1) ? currentPage - 1 : false,
        next: (currentPage < maxPages) ? currentPage + 1 : false,
        current: currentPage,
        min: minPage < 1 ? 1 : minPage,
        max: maxPage,
        total: maxPages,
        firstGap: (minPage > 2),
        lastGap: (maxPage < maxPages - 1)
    };
};

/**
 * Regenerate the master SVG element with all the selected logo items
 * Happens when we add or remove logo items from the element. It always
 * needs to be redrawn unfortunately, for the changes to be updated.
 *
 * @param  {Array} data All logo $items
 */
GS.Editor.Templates.prototype.createNewMasterSvgElementWithData = function (data) {
    var self = this;
    var _renderNewMasterSvgElement = function (template) {
        var $rendered = $(Mustache.render(template));
        var itemsHtml = "";
        var hasImages = false;
        var imageColours;

        // Iterating through all the new and old
        // elements and adding it all together.
        $.each(data.items, function () {
            // If it has images we flag it, so we can afterwards
            // do the colour collection and update our colour history
            if (this.elId === 'logo__item--logo_0') {
                hasImages = true;
                imageColours = self.helpers.getColoursFromItem($(this.el));
            }

            itemsHtml = itemsHtml + $(this.el).clone().wrap('<div>').parent().html(); // Need to include the outer element's html too
        });

        $(this.config.templates.svg.master.target).append($rendered.html(itemsHtml));

        if (hasImages === true) {
            var $gradients = $('#logo__item--logo_0').find('[fill^="url("]');

            $gradients.each(function () {
                var targetId = $(this).attr('fill').replace('url(#', '').replace(')', '');

                self.helpers.fixSvgNamespace(targetId);
            });
        }

        // Placing all elements to their original position
        var colourIndex = 0;

        $.each(data.items, function () {
            var $this = $('#' + this.elId);

            // Trigger the loaded event
            if (GS.Editor.Events.Importer.Loaded.hasOwnProperty($this.attr('data-item'))) {
                $(self.config.el.editor).trigger(GS.Editor.Events.Importer.Loaded[$this.attr('data-item')], [$this]);
            }

            // If the image is fresh, adjust the text fill to match it
            if (GSEditor.importer.newLogoImage === true && $this.attr('data-item-type') === 'text') {
                while (colourIndex < imageColours.length && imageColours[colourIndex].toUpperCase() === '#FFFFFF') {
                    ++colourIndex;
                }

                $this.find('text').attr('fill', imageColours[colourIndex]);
                colourIndex++;

                if (colourIndex >= imageColours.length) {
                    // Overflow back to 0 if we've reached the limit
                    colourIndex = 0;
                }
            }

            // If the element is new, position it properly damnit!
            // And generate its data while you're at it.
            if (typeof this.elData == "undefined") {
                self.helpers.createItemDataStructure($this);
                self.helpers.getAndStoreItemDimensions($this);
                window.GSEditor.resetElementsPosition($this);
                // Or just add back its old data
            } else {
                $this.data('logo-item', this.elData);
            }
        });

        // Fix the baseline of text items
        // depending on the browser
        self.helpers.doFixTextPositioning();

        // If there's a new graphic image selected, make sure
        // to remove the active class from any items and reset
        // their position (still maintaining any text's scale
        // though)
        if (GSEditor.importer.newLogoImage === true) {
            $(this.config.el.logoItemActive).attr('class', this.config.coreClasses.logoItem);

            this.helpers.carefullyPositionItems();
        }

        GSEditor.importer.newLogoImage = false;
    }.bind(this);

    // Removing the old SVG element (if there's any);
    $(this.config.el.canvas).remove();

    if (this.templateCache.svg.master === '') {
        $.get(this.config.settings.templateSvgUrl + this.config.templates.svg.master.name, function (template) {
            this.templateCache.svg.master = template;

            _renderNewMasterSvgElement(template);
        }.bind(this));
    } else {
        _renderNewMasterSvgElement(this.templateCache.svg.master);
    }
};

/**
 * Fetch and render the SVG logo item (logo/shape/business/tagline)
 *
 * @param  {Object} data Contains the raw SVG data of the logo item
 */
GS.Editor.Templates.prototype.fetchAndRenderSvgLogoItem = function (logoType, data) {
    var _renderSvgLogoItem = function (template) {
        var svgItems = this.helpers.getCurrentAndNewSvgContent($(Mustache.render(template, data)));

        this.createNewMasterSvgElementWithData({ items: svgItems });

        setTimeout(function () {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }.bind(this), 100);
    }.bind(this);

    if (this.templateCache.svg[logoType] === '') {
        $.get(this.config.settings.templateSvgUrl + this.config.templates.svg[logoType].name, function (template) {
            this.templateCache.svg[logoType] = template;

            _renderSvgLogoItem(template);
        }.bind(this));
    } else {
        _renderSvgLogoItem(this.templateCache.svg[logoType]);
    }
};

/**
 * Fetch and render the selected saved SVG logo
 *
 * @param  {Object} data Contains the raw SVG data of the saved logo
 */
GS.Editor.Templates.prototype.fetchAndRenderSavedSvgLogo = function (data) {
    var self = this;
    var svgItems = this.helpers.getCurrentAndNewSvgContent(null);

    // Adjust for potential resolution differences
    var center = {
        canvas: {
            x: $(this.config.el.canvas).width() / 2,
            y: $(this.config.el.canvas).height() / 2
        },
        svg: {
            x: data.viewBox.x + (data.viewBox.w / 2),
            y: data.viewBox.y + (data.viewBox.h / 2)
        }
    };

    var offset = {
        x: center.canvas.x - center.svg.x,
        y: center.canvas.y - center.svg.y
    };

    $.each(svgItems, function () {
        var $el = $(this.el);
        var transformAttr = $el.find(self.config.el.logoItemInner).attr('transform');
        var transform = self.helpers.parseTransform(transformAttr);

        this.elData = {
            transforms: {
                dimensions: {
                    width: 0,
                    height: 0
                },
                translate: transform.translate,
                scale: transform.scale,
                rotate: transform.rotate
            },
            fill: "",
            stroke: {
                width: 0,
                fill: ""
            },
            filters: {}
        };
    });

    this.createNewMasterSvgElementWithData({ items: svgItems });

    setTimeout(function () {
        // Fixing a bug where a saved logo had an item with active class
        // not removed. This rendered the specific element impossible to
        // select. So yeah. We fixed that. Bye now.
        $(self.config.el.logoItemActive).attr('class', self.config.coreClasses.logoItem);

        var $appendedSvgItems = $(self.config.el.logoItem);
        var canvasWidth = $(self.config.el.canvas).width();
        var canvasHeight = $(self.config.el.canvas).height();

        $appendedSvgItems.each(function () {
            var $item = $(this);
            var itemDimensions = self.helpers.getAndStoreItemDimensions($item);
            var transformAttr = $item.find(self.config.el.logoItemInner).attr('transform');
            var transform = self.helpers.parseTransform(transformAttr);

            transform.translate.x = transform.translate.x + offset.x;
            transform.translate.y = transform.translate.y + offset.y;

            $(self.config.el.editor).trigger(GS.Editor.Events.Transformations.Update, [
                {
                    item: $item,
                    transforms: {
                        dimensions: {
                            width: 0,
                            height: 0
                        },
                        translate: transform.translate,
                        scale: false,
                        rotate: false
                    }
                }
            ]);
        });

        $(self.config.el.editor).trigger(GS.Editor.Events.History.Enable);
        GSEditor.resetOverlay();

        setTimeout(function () {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);

            $(self.config.el.editor).trigger(GS.Editor.Events.Importer.Finished);
        }, 10);
    }, 400);
};
;/* -----------------------------------------
    Logo Editor History module

    Right now we're pushing the entire set of logo items
    to an array on each update. If we were to do an optimal
    version, it would be to separate each action in types
    and push *only* the changes done on that action alone
    on the target logo item.

    Below is just a skeleton on how it should/will be (WIP)

    =================================================
    Below are the different types of state changes:

    {
        type: 'transformation',
        item: $item,
        data: itemData
    }

    {
        type: 'text',
        item: $item
    }
    =================================================

    @author Konstantinos Vasileiou <kostas@neverbland.com>
    @copyrights Neverbland 2014
----------------------------------------- */

/**
 * History constructor

 * @param {Object} options   History initialization options
 * @param {Object} helpers   Editor helpers
 * @param {Object} templates Editor templates
 * @param {Object} core      Editor core
 */
GS.Editor.History = function(options, helpers, templates, core) {
    this.options = options || {};
    this.defaults = {};
    this.historyArray = [];
    this.historyCurrentIndex = 0;
    this.historyEnabled = false;

    // Editor modules (dependencies)
    this.helpers = helpers;
    this.templates = templates;
    this.core = core;

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.History.prototype.initialize = function() {
    console.log('> Initialized history');

    this.registerEvents();
};

GS.Editor.History.prototype.registerEvents = function() {
    var self = this;

    $(document).on('keydown', function(ev) {
        this.keydownEvent(ev);
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.History.Enable, function() {
        this.enableHistory();
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.History.Update, function() {
        this.doUpdate();
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.History.Undo, function() {
        this.doUndo();
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.History.Redo, function() {
        this.doRedo();
    }.bind(this));
};

/**
 * Call the appropriate method (history undo/redo) depending on keypress
 *
 * @param  {Object} ev keydown event
 */
GS.Editor.History.prototype.keydownEvent = function(ev) {
    if ((ev.ctrlKey || ev.metaKey) && ev.keyCode == 90 && !ev.shiftKey) {
        this.doUndo();
    }

    if (ev.shiftKey && (ev.ctrlKey || ev.metaKey) && ev.keyCode == 90) {
        this.doRedo();
    }
};

/**
 * Select or deselect items and parts
 * after the undo/redo functions
 *
 * @todo   Fix the errors when selecting/deselecting shapes + gradients
 *         (probably need to force switch to solid colour, will investigate)
 * @return {Object} History instance
 */
GS.Editor.History.prototype.doSelectItems = function() {
    var $item = this.helpers.getActiveLogoItem();

    if ($item !== false) {
        var itemType = $item.data('item-type');
        var itemAlreadyActive = this.helpers.isItemActive($item);
        var hasItemPartActive = this.helpers.hasItemPartActive();
        var $itemPart = (function() {
            if (hasItemPartActive === true) {
                if (itemType === 'text') {
                    return false;
                } else {
                    return this.helpers.getItemActivePart($item);
                }
            }
        }.bind(this))();

        if (hasItemPartActive === true) {
            if (itemType === 'text') {
                $itemPart = false
            } else {
                $itemPart = this.helpers.getItemActivePart($item);
            }
        }

        window.GSEditor.selectItem($item);

        $(this.config.el.editor).trigger(GS.Editor.Events.Item.Selected, [
            {
                item: $item,
                part: $itemPart,
                type: itemType,
                alreadyActive: false
            }
        ]);
    } else {
        $(this.config.el.editor).trigger(GS.Editor.Events.Item.Deselected);

        window.GSEditor.deselectItems();
        window.GSEditor.deselectItemParts();
    }
};

/**
 * Undo state
 *
 * @return {Object} History instance
 */
GS.Editor.History.prototype.doUndo = function() {
    if (this.historyCurrentIndex > 0) {
        this.historyCurrentIndex--;

        this.templates.createNewMasterSvgElementWithData({ items: this.historyArray[this.historyCurrentIndex] });

        setTimeout(function() {
            this.doSelectItems();
        }.bind(this), 10);
    }

    return this;
};

/**
 * Redo state
 *
 * @return {Object} History instance
 */
GS.Editor.History.prototype.doRedo = function() {
    if (this.historyCurrentIndex < this.historyArray.length - 1) {
        this.historyCurrentIndex++;

        this.templates.createNewMasterSvgElementWithData({ items: this.historyArray[this.historyCurrentIndex] });

        setTimeout(function() {
            this.doSelectItems();
        }.bind(this), 10);
    }

    return this;
};

/**
 * Enable history functionality
 *
 * @return {Object} History instance
 */
GS.Editor.History.prototype.enableHistory = function() {
    this.historyEnabled = true;

    return this;
};

/**
 * Store a new state (this is triggered every
 * time we modify an item on the editor)
 *
 * @return {Object} History instance
 */
GS.Editor.History.prototype.doUpdate = function() {
    if (this.historyEnabled === true) {
        var $items = this.helpers.getCurrentAndNewSvgContent(null);

        if (this.historyCurrentIndex < this.historyArray.length - 1) {
            this.historyArray = this.historyArray.slice(0, this.historyCurrentIndex + 1);
        }

        this.historyArray.push($items);

        this.historyCurrentIndex = this.historyArray.length - 1;

        console.log('[ Pushed history state ]');
    }

    return this;
};
;/* -----------------------------------------
    Logo Editor Toolbars module

    @todo       Fix it. :o
    @author     Konstantinos Vasileiou <kostas@neverbland.com>
    @copyrights Neverbland 2014
----------------------------------------- */

/**
 * Toolbars constructor

 * @param {Object} options   Toolbars initialization options
 * @param {Object} helpers   Editor helpers
 * @param {Object} templates Editor templates
 */
GS.Editor.Toolbars = function(options, helpers, templates, resizer) {
    this.options = options || {};

    this.defaults = {
        el: {
            toolbar: '.toolbar',
            toolbarWrapper: '.toolbar__wrapper',
            toolbarComponent: '.toolbar-component',
            toolbarParentGeneric: '[data-toolbar]',
            toolbarComponentValue: '[data-toolbar-component-value]',
            toolbarComponents: {
                fill: {
                    main: '.toolbar-component__fill',
                    match: '.toolbar-component__fill__colour-matcher',
                    matchItem: '.toolbar-component__fill__colour-matcher__item',
                    switchButton: '.toolbar-component__switch--fill',
                    switchGradientPickerButton: '.toolbar-component__fill--gradient__button',
                    solid: {
                        circle: '.toolbar-component__fill__colour-circle--solid',
                        value: '.toolbar-component__fill-value--solid'
                    },
                    gradient: {
                        circle: {
                            top: '#gradientFill [offset]:first-child',
                            bottom: '#gradientFill [offset]:last-child'
                        },
                        value: {
                            first: '.toolbar-component__fill-value--gradient--first',
                            second: '.toolbar-component__fill-value--gradient--second'
                        }
                    }
                },
                switchButton: '.toolbar-component__switch'
            },
            colourpicker: {
                main: '.colourpicker',
                image: {
                    toolbarParent: '[data-toolbar="image"]',
                    solid: '#colourpicker--image--solid',
                    gradient: {
                        first: '#colourpicker--image--gradient--first',
                        second: '#colourpicker--image--gradient--second'
                    }
                },
                shape: {
                    toolbarParent: '[data-toolbar="shape"]',
                    solid: '#colourpicker--shape--solid',
                    gradient: {
                        first: '#colourpicker--shape--gradient--first',
                        second: '#colourpicker--shape--gradient--second'
                    }
                }
            },
            undoButton: '.toolbar-component__states__button--undo',
            redoButton: '.toolbar-component__states__button--redo'
        },
        coreClasses: {
            toolbarActive: 'toolbar--active',
            toolbarWrapperActive: 'toolbar__wrapper--active',
            toolbarComponentSwitchDisabled: 'toolbar-component__switch--disabled',
            toolbarComponentSwitchOn: 'toolbar-component__switch--on',
            toolbarFillGradientActive: 'toolbar-component__fill--show-gradient',
            toolbarSwitchGradientPickerActive: 'toolbar-component__fill--gradient__button--active'
        },
        attributes: {
            toolbarType: 'toolbar',

            // Those switch-like icons/buttons on components
            // Can be 'active' or 'inactive'
            toolbarComponentSwitch: 'toolbar-component-switch',

            // Those pesky + and - icons on components
            // Can be 'increase' or 'decrease'
            toolbarComponentValueChange: 'toolbar-component-value-change',

            // Minimum allowed value for the +/- value change component
            toolbarComponentValueMin: 'toolbar-component-value-min',

            // Maximum allowed value for the +/- value change component
            toolbarComponentValueMax: 'toolbar-component-value-max',

            // When clicked, applies the current hex colour to the
            // proper colourpicker
            toolbarChangeFillTrigger: 'fill-change',

            toolbarSwitchGradientPicker: 'gradient-colourpicker-target',
            shape: {
                fill: 'fill'
            }
        }
    };

    this.helpers = helpers;
    this.templates = templates;
    this.resizer = resizer;

    // Types of toolbars ~ they match the data-toolbar attribute
    this.toolbarTypes = ['text', 'shape', 'image'];

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    console.log('> Initializing toolbars');

    // Initializing the toolbar submodules
    this.colourHistory = new GS.Editor.Toolbars.ColourHistory(this.config, this.helpers, this.templates);
    this.toolbarText = new GS.Editor.Toolbars.Text(this.config, this.colourHistory, this.helpers, this.templates);
    this.toolbarShape = new GS.Editor.Toolbars.Shape(this.config, this.colourHistory, this.helpers, this.templates);
    this.toolbarImage = new GS.Editor.Toolbars.Image(this.config, this.colourHistory, this.helpers, this.templates);

    this.initialize();
};

GS.Editor.Toolbars.prototype.initialize = function() {
    this.fetchAndRenderMasterTemplate();
    this.registerEvents();
};

GS.Editor.Toolbars.prototype.registerEvents = function() {
    var self = this;

    $(this.config.el.editor).on(GS.Editor.Events.Item.Selected, function(ev, data) {
        if (!data.alreadyActive) {
            if (!$(this.config.el.toolbarWrapper).hasClass(this.config.coreClasses.toolbarWrapperActive)) {
                $(this.config.el.toolbarWrapper).addClass(this.config.coreClasses.toolbarWrapperActive);
            }

            this.fetchAndRenderTypeTemplate(data);
        }
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Item.Deselected, function(ev, data) {
        this.hideAllToolbars();

        $(this.config.el.toolbarWrapper).removeClass(this.config.coreClasses.toolbarWrapperActive);
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Item.Part.Selected, function(ev, data) {
        this.showToolbar(data, false);
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Item.Part.Deselected, function(ev, data) {
        this.showToolbar(data, false);
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Toolbars.Show, function(ev, data) {
        this.showToolbar(data);
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Toolbars.UpdateSolidFills, function(ev, data) {
        this.updateToolbarSolidFills(data.type, data.parent, data.hex);
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Toolbars.UpdateGradientFills, function(ev, data) {
        this.updateToolbarGradientFills(data.type, data.parent, data.hexFirst, data.hexSecond);
    }.bind(this));

    /**
     * Undo/Redo Events
     */
    $body.on('click', this.config.el.undoButton, function(ev) {
        $(this.config.el.editor).trigger(GS.Editor.Events.History.Undo);
    }.bind(this));

    $body.on('click', this.config.el.redoButton, function(ev) {
        $(this.config.el.editor).trigger(GS.Editor.Events.History.Redo);
    }.bind(this));

    /**
     * Contenteditable events (type in / paste value)
     */
    $body.on('click mousedown', this.config.el.toolbarComponentValue, function(ev) {
        var $this = $(this);
        var $toolbarParent = $this.closest(self.config.el.toolbarComponent);

        $this.focus();

        $this.on({
            keydown: function(ev) { // Prevent linebreaks on "enter"
                if (ev.which == 13) {
                    $this.trigger('blur');

                    return false;
                }
            },
            paste: function(ev) { // Prevent linebreaks on pasted content
                setTimeout(function() {
                    var text = $this.text();
                    var processedText = text
                        .replace(/(\r\n|\n|\r|&nbsp;)/gm, '')
                        .replace('#', '');

                    $this.text(processedText);
                }, 0);
            },
            blur: function(ev) {
                $toolbarParent.trigger(GS.Editor.Events.Toolbars.UpdatePickers, [$this]);

                $this.off();
            }
        });
    });
};

/**
 * Fetch and render the main toolbar wrapper element. Also does cache!
 */
GS.Editor.Toolbars.prototype.fetchAndRenderMasterTemplate = function() {
    var _renderMasterTemplate = function(template) {
        var rendered = Mustache.render(template);

        $(this.templates.config.templates.toolbars.master.target).html(rendered);
    }.bind(this);

    if (this.templates.templateCache.toolbars.master === "") {
        console.log(' ~> Loading [Master] toolbar template ');

        $.get(this.templates.config.settings.templateToolbarsUrl + this.templates.config.templates.toolbars.master.name, function(template) {
            this.templates.templateCache.toolbars.master = template;

            _renderMasterTemplate(template);
        }.bind(this));
    } else {
        _renderMasterTemplate(this.templates.templateCache.toolbars.master);
    }
};

/**
 * Fetch and render a toolbar element. Also does cache!
 *
 * @param  {String} eventData The custom data passed on the selected event
 *                            which contains info about the item, its type
 *                            and any item part selected
 */
GS.Editor.Toolbars.prototype.fetchAndRenderTypeTemplate = function(eventData) {
    if ($('[data-' + this.config.attributes.toolbarType + '=' + eventData.type + ']').hasClass(this.config.coreClasses.toolbarActive)) {
        this.showToolbar(eventData, false);

        return;
    }

    var _renderTypeTemplate = function(template) {
        var rendered = Mustache.render(template);

        $(this.templates.config.templates.toolbars[eventData.type].target).html(rendered);

        this.showToolbar(eventData);

        if (eventData.type === 'text') {
            this.toolbarText.initializeFontsScrollbar();
        }
    }.bind(this);

    if (this.templates.templateCache.toolbars[eventData.type] === "") {
        console.log(' ~> Loading [' + eventData.type + '] toolbar template ');

        $.get(this.templates.config.settings.templateToolbarsUrl + this.templates.config.templates.toolbars[eventData.type].name, function(template) {
            if (eventData.type === 'text') {
                this.toolbarText.fetchAndRenderFontsTemplate(template);
            } else {
                this.templates.templateCache.toolbars[eventData.type] = template;

                _renderTypeTemplate(template);
            }
        }.bind(this));
    } else {
        _renderTypeTemplate(this.templates.templateCache.toolbars[eventData.type]);
    }
};

/**
 * Show the right toolbar for the job (based on active logo item type)
 * @param  {String} type The type of the toolbar (text/image/shape/etc)
 * @return {Object}      Toolbars instance
 */
GS.Editor.Toolbars.prototype.showToolbar = function(eventData, doHideFirst) {
    var doHideFirst = doHideFirst || true;
    var toolbarType = eventData.type;

    if (doHideFirst === true) {
        this.hideAllToolbars();
    }

    // Unregistering all registered events
    this.toolbarShape.unregisterEvents();
    this.toolbarText.unregisterEvents();
    this.toolbarImage.unregisterEvents();

    switch (toolbarType) {
        case 'text':
            this.toolbarText.registerEvents();
            this.toolbarText.prepareTextToolbar(toolbarType);
            break;
        case 'shape':
            this.toolbarShape.registerEvents();
            this.toolbarShape.prepareShapeToolbar(toolbarType);
            break;
        case 'image':
            this.toolbarImage.registerEvents();
            this.toolbarImage.prepareImageToolbar(toolbarType);
            break;
        default:
            break;
    }

    $('[data-' + this.config.attributes.toolbarType + '=' + toolbarType + ']').addClass(this.config.coreClasses.toolbarActive);

    this.colourHistory.generateColourHistory();

    return this;
};

/**
 * Well... You find out what this does.
 *
 * @return {Object} Toolbars instance
 */
GS.Editor.Toolbars.prototype.hideAllToolbars = function() {
    $(this.config.el.toolbar).removeClass(this.config.coreClasses.toolbarActive);

    $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.HideAll);

    // Unregistering click events on new toolbar generation
    $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.HideAll);

    return this;
};

/**
 * Generate a gradient element. Nice. Like it needed an explanation.
 *
 * @todo It should accept a prefix (+ index?) for a name
 */
GS.Editor.Toolbars.prototype.generateGradientElement = function() {
    if (this.helpers.hasItemPartActive()) {
        var $part = this.helpers.getItemActivePart();
        var partId = $part.attr('data-part-id');
        var fill = $part.attr('fill');
        var index = $part.index();

        if (fill.indexOf('url(') == -1) {
            var $linearGradient = $('<linearGradient id="' + partId + '" gradientUnits="objectBoundingBox" x1="0.5" y1="0" x2="0.5" y2="1">' +
                                    '<stop offset="0" style="stop-color:#000000"></stop>' +
                                    '<stop offset="1" style="stop-color:#000000"></stop>' +
                                '</linearGradient>');
            $linearGradient.insertBefore($part);
            $part.attr('fill', 'url(#' + partId + ')');

            this.helpers.refreshSVG();
        } else {
            var $gradient = $(this.helpers.getGradientIdFromPath(fill));

        }
    }
};

/**
 * Updating the toolbar fill circle and
 * value when using the solid colourpicker
 *
 * @param  {String} toolbarType Toolbar type (text/shape/image/whatevs)
 * @param  {String} hex         The chosen hex colour
 */
GS.Editor.Toolbars.prototype.updateToolbarSolidFills = function(toolbarType, $toolbarParent, hex) {
    this.updateMatchingFills(toolbarType, $toolbarParent, hex);

    $toolbarParent
        .find(this.config.el.toolbarComponents.fill.solid.circle)
            .attr('style', 'background-color: ' + hex);

    $toolbarParent
        .find(this.config.el.toolbarComponents.fill.solid.value)
            .text(hex.replace('#', ''));
};

/**
 * Updating the toolbar fill circle and
 * value when using the gradient colourpickers
 *
 * @param  {String} toolbarType Toolbar type (text/shape/image/whatevs)
 * @param  {String} hexFirst    The chosen hex colour of the first gradient
 * @param  {String} hexSecond   The chosen hex colour of the second gradient
 */
GS.Editor.Toolbars.prototype.updateToolbarGradientFills = function(toolbarType, $toolbarParent, hexFirst, hexSecond) {
    $toolbarParent
        .find(this.config.el.toolbarComponents.fill.gradient.circle.top)
            .attr('style', 'stop-color: ' + hexFirst);

    $toolbarParent
        .find(this.config.el.toolbarComponents.fill.gradient.circle.bottom)
            .attr('style', 'stop-color: ' + hexSecond);

    $toolbarParent
        .find(this.config.el.toolbarComponents.fill.gradient.value.first)
            .text(hexFirst.replace('#', ''));

    $toolbarParent
        .find(this.config.el.toolbarComponents.fill.gradient.value.second)
            .text(hexSecond.replace('#', ''));
};

/**
 * Calculating the matching colours and setting them to the circles
 *
 * @param  {String} toolbarType Image/Text/Shape/Whatevs... As usual.
 * @param  {String} hex         Hex colour selected
 */
GS.Editor.Toolbars.prototype.updateMatchingFills = function(toolbarType, $toolbarParent, hex) {
    var matchingColoursComplement = '#' + tinycolor(hex).complement().toHex();
    var matchingColoursTetrad = tinycolor(hex).tetrad().map(function(t) { return t.toHexString() });
    var matchingColoursAnalogous = tinycolor(hex).analogous(15, 30).map(function(t) { return t.toHexString() });
    var matchingColoursSplitComplement = tinycolor(hex).splitcomplement().map(function(t) { return t.toHexString() });
    var matchingColours = [];
    var setMatchingFills = function() {
        var self = this;

        $toolbarParent.find(self.config.el.toolbarComponents.fill.match).each(function() {
            var $matcher = $(this);

            for (var i = 0; i < matchingColours.length; i++) {
                var targetEl = $matcher.find(self.config.el.toolbarComponents.fill.matchItem)[i];

                $(targetEl)
                    .attr('style', 'background-color: ' + matchingColours[i])
                    .attr('data-fill-change', matchingColours[i]);
            }
        });
    }.bind(this);

    matchingColours[0] = matchingColoursComplement;
    matchingColours[1] = matchingColoursTetrad[3];
    matchingColours[2] = matchingColoursSplitComplement[1];
    matchingColours[3] = matchingColoursTetrad[1];
    matchingColours[4] = matchingColoursAnalogous[10];
    matchingColours[5] = matchingColoursAnalogous[4];

    setMatchingFills(matchingColours);
};

/**
 * Core function that changes the state of toolbar component switches
 * @param  {jQuery} $switchEl   The target switch element we need to toggle/force its state
 * @param  {String} forcedState (Optional) forced state (active/inactive).
 * @return {String}             The new state of the switch
 */
GS.Editor.Toolbars.prototype.changeSwitchState = function($switchEl, forcedState) {
    var state = $switchEl.attr('data-' + this.config.attributes.toolbarComponentSwitch);
    var newState = (forcedState !== false) ? forcedState : (state === 'active') ? 'inactive' : 'active';

    $switchEl.attr('data-' + this.config.attributes.toolbarComponentSwitch, newState);

    return newState;
};
;/* -----------------------------------------
    Logo Editor Toolbars module

    @todo       Fix it. :o
    @author     Konstantinos Vasileiou <kostas@neverbland.com>
    @copyrights Neverbland 2014
----------------------------------------- */

/**
 * Toolbars Colour History constructor

 * @param {Object} options   Toolbars initialization options
 * @param {Object} helpers   Editor helpers
 * @param {Object} templates Editor templates
 */
GS.Editor.Toolbars.ColourHistory = function(options, helpers, templates) {
    this.options = options || {};

    this.defaults = {
        el: {
            colourHistoryItem: '.toolbar-component__fill__colour-history__item',
            colourHistoryWrapper: '.toolbar-component__fill__colour-history'
        },
        settings: {
            colourHistoryMaximumItems: 10
        }
    };

    this.colourHistoryItemHtml = '<li ' +
        'data-fill-target="{{{target}}}" ' +
        'data-fill-change="{{{colour}}}" ' +
        'class="toolbar-component__fill__colour-history__item" ' +
        'style="background-color: {{{colour}}}">' +
    '</li>';

    this.colours = [];

    this.helpers = helpers;
    this.templates = templates;

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Toolbars.ColourHistory.prototype.initialize = function() {
    console.log(' ~> Initialized colour history toolbar submodule');

    this.registerEvents();
};

GS.Editor.Toolbars.ColourHistory.prototype.registerEvents = function() {
    $(this.config.el.editor).on(GS.Editor.Events.Toolbars.ColourHistory.Add, function(ev, data) {
        if (data.hex.indexOf('rgb') !== -1) {
            data.hex = this.helpers.rgb2hex(data.hex);
        }

        this.addColoursToHistory(data.hex);
    }.bind(this));
};

GS.Editor.Toolbars.ColourHistory.prototype.addColoursToHistory = function(colour) {
    if (this.checkIfColourExists(colour) === true || colour.toLowerCase() === "#ffffff" || colour.toLowerCase() === "none") {
        return;
    }

    if (this.colours.length >= this.config.settings.colourHistoryMaximumItems) {
        this.colours.splice(0, 1);
    }

    this.colours.push(colour);
    this.generateColourHistory();
};

GS.Editor.Toolbars.ColourHistory.prototype.checkIfColourExists = function(colour) {
    var colourExists = false;

    for (var i = this.colours.length - 1; i >= 0; i--) {
        if (this.colours[i] === colour) {
            colourExists = true;
        }
    }

    return colourExists;
};

GS.Editor.Toolbars.ColourHistory.prototype.generateColourHistory = function() {
    var self = this;

    $(this.config.el.colourHistoryWrapper).each(function() {
        var $colourHistoryWrapper = $(this);
        var target = $colourHistoryWrapper.data('fill-target');
        var finalHtml = '';

        for (var i = self.colours.length - 1; i >= 0; i--) {
            var item = self.colourHistoryItemHtml;
            item = item.replace(/{{{colour}}}/g, self.colours[i]);
            item = item.replace(/{{{target}}}/g, target);

            finalHtml = finalHtml + item;
        }

        $colourHistoryWrapper.html(finalHtml);
    });
};
;/* -----------------------------------------
    Logo Editor Text Toolbar module

    @todo       Fix it. :o
    @author     Konstantinos Vasileiou <kostas@neverbland.com>
    @copyrights Neverbland 2014
----------------------------------------- */

/**
 * Text Toolbar constructor

 * @param {Object} options   Toolbars initialization options
 * @param {Object} helpers   Editor helpers
 * @param {Object} templates Editor templates
 */
GS.Editor.Toolbars.Text = function(options, colourHistory, helpers, templates) {
    this.options = options || {};

    this.defaults = {
        el: {
            text: {
                italic: '.toolbar-component__font-style__button--italic',
                bold: '.toolbar-component__font-style__button--bold',
                letterSpacingValue: '.toolbar-component__letter-spacing__value',
                letterSpacingButton: '.toolbar-component__letter-spacing__button',
                fontFamily: '.toolbar-component__font-family__font',
                fontFamilyValue: '.toolbar-component__font-family__value'
            },
            toolbarComponents: {
                effects: {
                    switchButtonShadow: '.toolbar-component__switch--shadow',
                    switchButtonGlow: '.toolbar-component__switch--glow',
                    switchButtonStroke: '.toolbar-component__switch--stroke'
                }
            },
            shadow: {
                angleValue: '.toolbar-component__value-change__value--shadow-angle',
                angleButton: '.toolbar-component__shadow__angle .toolbar-component__value-change__button',
                distanceValue: '.toolbar-component__value-change__value--shadow-distance',
                distanceButton: '.toolbar-component__shadow__distance .toolbar-component__value-change__button'
            },
            glow: {
                thicknessValue: '.toolbar-component__value-change__value--glow-thickness',
                thicknessButton: '.toolbar-component__glow__thickness .toolbar-component__value-change__button'
            },
            stroke: {
                thicknessValue: '.toolbar-component__value-change__value--stroke-thickness',
                thicknessButton: '.toolbar-component__stroke__thickness .toolbar-component__value-change__button'
            },
            colourpicker: {
                text: {
                    toolbarParent: '[data-toolbar="text"]',
                    solid: '#colourpicker--text--solid'
                },
                effects: {
                    glow: {
                        solid: '[data-toolbar="text"] #colourpicker--glow--solid'
                    },
                    shadow: {
                        solid: '[data-toolbar="text"] #colourpicker--shadow--solid'
                    },
                    stroke: {
                        solid: '[data-toolbar="text"] #colourpicker--stroke--solid'
                    }
                }
            },
            fontsStyleTag: '#font-styles'
        },
        attributes: {
            text: {
                fontFamily: 'font-family',
                fontFamilyData: 'data-font-family',
                fontFamilyClassname: 'font-classname',
                fontStyle: 'data-font-style',
                fontWeight: 'data-font-weight',
                letterSpacing: 'letter-spacing',
                fill: 'fill'
            }
        }
    };

    this.colourHistory = colourHistory;
    this.helpers = helpers;
    this.templates = templates;

    // Colourpicker instances
    this.colourpickerSolid = '';
    this.strokeColourpickerSolid = '';

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Toolbars.Text.prototype.initialize = function() {
    console.log(' ~> Initialized text toolbar');

    this.registerEvents();
};

GS.Editor.Toolbars.Text.prototype.registerEvents = function() {
    var self = this;

    this.unregisterEvents();

    /**
     * Text toolbar events
     */
    // Font weight
    $(this.config.el.toolbarWrapper).on('click', this.config.el.text.bold, function(ev) {
        if (!$(ev.target).hasClass('toolbar-component__font-style__button--disabled')) {
            this.changeFontWeight(false, true, true);
        }
    }.bind(this));

    // Italic
    $(this.config.el.toolbarWrapper).on('click', this.config.el.text.italic, function(ev) {
        if (!$(ev.target).hasClass('toolbar-component__font-style__button--disabled')) {
            this.changeFontStyle(false, true, true);
        }
    }.bind(this));

    // Letter spacing
    $(this.config.el.toolbarWrapper).on('click', this.config.el.text.letterSpacingButton, function(ev) {
        self.changeLetterSpacing(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    // Font Family
    $(this.config.el.toolbarWrapper).on('click', this.config.el.text.fontFamily, function(ev) {
        self.changeFontFamily($(this), true, true);
    });

     // Shadow switch toggle
    $(this.config.el.colourpicker.text.toolbarParent).on('click', this.config.el.toolbarComponents.effects.switchButtonShadow, function(ev) {
        self.switchShadow($(this));
    });

    // Glow switch toggle
    $(this.config.el.colourpicker.text.toolbarParent).on('click', this.config.el.toolbarComponents.effects.switchButtonGlow, function(ev) {
        self.switchGlow($(this));
    });

    // Stroke switch toggle
    $(this.config.el.colourpicker.text.toolbarParent).on('click', this.config.el.toolbarComponents.effects.switchButtonStroke, function(ev) {
        self.switchStroke($(this));
    });

    // Stroke width value change
    $(this.config.el.colourpicker.text.toolbarParent).on('click', this.config.el.stroke.thicknessButton, function(ev) {
        self.changeStrokeThickness(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    // Glow thickness value change
    $(this.config.el.colourpicker.text.toolbarParent).on('click', this.config.el.glow.thicknessButton, function(ev) {
        self.changeGlowThickness(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    // Shadow distance value change
    $(this.config.el.colourpicker.text.toolbarParent).on('click', this.config.el.shadow.distanceButton, function(ev) {
        self.changeShadowDistance(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    // Shadow angle value change
    $(this.config.el.colourpicker.text.toolbarParent).on('click', this.config.el.shadow.angleButton, function(ev) {
        self.changeShadowAngle(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });


    $(this.config.el.editor).on(GS.Editor.Events.Toolbars.HideAll, function(ev) {
        $(this.config.el.colourpicker.text.toolbarParent).off('click');
    }.bind(this));
};

GS.Editor.Toolbars.Text.prototype.unregisterEvents = function() {
    $(this.config.el.toolbarWrapper).off('click');
    $(this.config.el.colourpicker.text.toolbarParent).off('click');
    $(this.config.el.editor).off(GS.Editor.Events.Toolbars.HideAll);
    $(this.config.el.toolbarComponent).off(GS.Editor.Events.Toolbars.UpdatePickers);
};

/**
 * Enable the custom scrollbar @ the font list
 */
GS.Editor.Toolbars.Text.prototype.initializeFontsScrollbar = function() {
    window.fontsScrollFoo = new ScrollFoo({
        parentEl: '.scrollfoo__parent--fonts',
        scrollerEl: '.scrollfoo__scroller--fonts',
        visibleParentHeight: 300,
        realParentHeight: function() {
            return $('.scrollfoo__parent--fonts').outerHeight();
        }
    });
};

/**
 * Fetch and render the font list
 *
 * @param  {String} textTemplate The raw text toolbar template
 */
GS.Editor.Toolbars.Text.prototype.fetchAndRenderFontsTemplate = function(textTemplate) {
    console.log('   + Loading Custom Fonts ');

    var fontData;
    var _renderFontsTemplate = function(template) {
        var rendered = Mustache.render(template, fontData);
        var finalTemplateCode;

        $(this.config.el.fontsStyleTag).text(rendered);

        finalTemplateCode = $(this.templates.config.templates.toolbars.fonts.target).parent().html();
        this.templates.templateCache.toolbars.text = finalTemplateCode;

        this.initializeFontsScrollbar();

        $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.Show, [{ type: 'text' }]);
    }.bind(this);

    $.getJSON('/fonts-builder.json').done(function(data) {
        var rendered;
        fontData = data;
        rendered = Mustache.render(textTemplate, fontData);

        $(this.templates.config.templates.toolbars.text.target).html(rendered);

        $.get(this.templates.config.settings.templateToolbarsUrl + this.templates.config.templates.toolbars.fonts.name, function(template) {
            _renderFontsTemplate(template);
        }.bind(this));
    }.bind(this));
};

/**
 * Preparing the toolbar by fetching and appending the template, then
 * populating the right data based on the selected/active text item.
 * Also, we're initializing the coloupicker. Amazing stuff!
 *
 * @param  {String} toolbarType Specifiying the type of toolbar (Text/Image/Shape/etc)
 * @return {Object}             Toolbars instance
 */
GS.Editor.Toolbars.Text.prototype.prepareTextToolbar = function(toolbarType) {
    var self = this;
    var $toolbarParent = $(this.config.el.colourpicker.text.toolbarParent);
    var $text = this.helpers.getActiveLogoItem().find('text');
    var itemData = {
        bold: $text.attr(this.config.attributes.text.fontWeight),
        italic: $text.attr(this.config.attributes.text.fontStyle),
        letterSpacing: $text.attr(this.config.attributes.text.letterSpacing),
        fontFamily: $text.attr(this.config.attributes.text.fontFamilyData),
        fill: $text.attr(this.config.attributes.text.fill)
    };

    // Needed to figure out
    var $fontElement = $('[data-toolbar-component="font-family"] [' + this.config.attributes.text.fontFamilyData + '="' + itemData.fontFamily + '"]');
    var supportedFontVariants;

    var hasShadow = (typeof $text.attr('data-filter-shadow') != 'undefined') ? true : false;
    var hasGlow = (typeof $text.attr('data-filter-glow') != 'undefined') ? true : false;
    var hasStroke = (typeof $text.attr('stroke') != 'undefined') ? true : false;

    // Initializing the text colourpicker
    this.colourpickerSolid = self.helpers.createColorPicker(this.config.el.colourpicker.text.solid, function(hex, hsv, rgb) {
        if (hex.indexOf('rgb') !== -1) {
            hex = this.helpers.rgb2hex(hex);
        }

        $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.UpdateSolidFills, [{
            type: toolbarType,
            parent: $toolbarParent,
            hex: hex
        }]);

        // Do _not_ use $text here. It may no longer be valid after glow/shadow changes
        this.helpers.getActiveLogoItem().find('text').attr('fill', hex);
    }.bind(this));

    // Initializing the stroke colourpicker
    this.strokeColourpickerSolid = self.helpers.createColorPicker(this.config.el.colourpicker.effects.stroke.solid, function(hex, hsv, rgb) {
        // Do _not_ use $text here. It may no longer be valid after glow/shadow changes
        this.helpers.getActiveLogoItem().find('text').attr('stroke', hex);

        if (hex.indexOf('rgb') !== -1) {
            hex = this.helpers.rgb2hex(hex);
        }

        $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.UpdateSolidFills, [{
            type: toolbarType,
            parent: $toolbarParent,
            hex: hex
        }]);
    }.bind(this));

    // Activating the effects toolbar component
    $('.toolbar-component-group--effects').addClass('toolbar-component-group--effects--active');

    // Doing checks and populating/applying settings accordingly
    if (hasShadow) {
        var shadowAngle = $text.attr('data-filter-shadow-angle');
        var shadowDistance = $text.attr('data-filter-shadow-distance');

        $('.toolbar-component__shadow').addClass('toolbar-component__shadow--active');

        $(this.config.el.shadow.angleValue).text(shadowAngle);
        $(this.config.el.shadow.distanceValue).text(shadowDistance);

        this.changeShadowAngle(shadowAngle);
        this.changeShadowDistance(shadowDistance);
    } else {
        $('.toolbar-component__shadow').removeClass('toolbar-component__shadow--active');
        $(this.config.el.shadow.angleValue).text('0');
        $(this.config.el.shadow.distanceValue).text('0');
    }

    if (hasGlow) {
        var glowThickness = $text.attr('data-filter-glow-thickness');

        $('.toolbar-component__glow').addClass('toolbar-component__glow--active');
        $(this.config.el.glow.thicknessValue).text(glowThickness);

        this.changeGlowThickness(glowThickness);
    } else {
        $('.toolbar-component__glow').removeClass('toolbar-component__glow--active');
        $(this.config.el.glow.thicknessValue).text('1');
    }

    if (hasStroke) {
        var stroke = $text.attr('stroke');
        var strokeWidth = $text.attr('stroke-width');

        $('.toolbar-component__stroke').addClass('toolbar-component__stroke--active');
        $(this.config.el.stroke.thicknessValue).text(stroke);

        this.changeStrokeThickness(strokeWidth);
        this.strokeColourpickerSolid.setHex(stroke);
    } else {
        $('.toolbar-component__stroke').removeClass('toolbar-component__stroke--active');
        $(this.config.el.stroke.thicknessValue).text('1');
    }

    // Updating the colourpicker with the item's fill
    this.colourpickerSolid.setHex(itemData.fill);

    // Registering click event for clicking on Colour Matching/History circles
    $toolbarParent.on('click', '[data-' + this.config.attributes.toolbarChangeFillTrigger + ']', function() {
        var $trigger = $(this);
        var targetHex = $trigger.attr('data-' + self.config.attributes.toolbarChangeFillTrigger);

        if ($trigger.hasClass(self.helpers.getRawName(self.config.el.toolbarComponents.fill.matchItem))) {
            $(self.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: targetHex }]);
        }

        switch ($trigger.data('fill-target')) {
            case 'stroke':
                self.strokeColourpickerSolid.setHex(targetHex);
                break;

            default:
                self.colourpickerSolid.setHex(targetHex);
                break;
        }
    });

    /**
     * @todo CHANGE THIS BIT!
     *       Do not refresh the font, unless we're done setting all the font family/weight/style first.
     *       We don't want to keep reloading different base64 while switching stuff on/off to match
     *       the font. If that doesn't make sense, I blame my English.
     */
    $(this.config.el.text.fontFamilyValue).attr('data-toolbar-component-value', itemData.fontFamily);
    this.changeFontWeight(itemData.bold === 'bold' ? 'active' : 'inactive', false, false);
    this.changeFontStyle(itemData.italic === 'italic' ? 'active' : 'inactive', false, false);
    this.changeFontFamily($fontElement, true, false);
    this.changeLetterSpacing(itemData.letterSpacing);

    // Contenteditable updates
    $(this.config.el.toolbarComponent).on(GS.Editor.Events.Toolbars.UpdatePickers, function(ev, $source) {
        var $component = $(this);
        var type = $component.data('toolbar-component');
        var value = $source.text();
        var mapping = {};

        if ($source.is(self.config.el.toolbarComponents.fill.solid.value)) {
            self.colourpickerSolid.setHex('#' + value);

            $(self.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: '#' + value }]);
        }

        mapping[self.config.el.text.letterSpacingValue] = 'changeLetterSpacing';
        mapping[self.config.el.stroke.thicknessValue] = 'changeStrokeThickness';
        mapping[self.config.el.shadow.angleValue] = 'changeShadowAngle';
        mapping[self.config.el.shadow.distanceValue] = 'changeShadowDistance';
        mapping[self.config.el.glow.thicknessValue] = 'changeGlowThickness';

        $.each(mapping, function(className, method) {
            if ($source.is(className)) {
                self[method](parseInt(value, 10));
            }
        });

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    return this;
};

/**
 * Changes the font family of the target text item
 *
 * @param  {jQuery}  $fontElement The $font item from the font list
 * @param  {Boolean} refresh      Refresh the embedded defs style @ the svg
 * @param  {Boolean} addToHistory Add a history state
 */
GS.Editor.Toolbars.Text.prototype.changeFontFamily = function($fontElement, refresh, addToHistory) {
    addToHistory = addToHistory || false;
    refresh = refresh || false;

    var $text = this.helpers.getActiveLogoItem().find('text');
    var newFontFamily = $fontElement.attr(this.config.attributes.text.fontFamilyData);
    var newFontFamilyClassname = $fontElement.data(this.config.attributes.text.fontFamilyClassname);
    var newFontVariants = this.getFontVariants($fontElement);
    var newFontWeight = (newFontVariants.bold === true) ? 'bold' : 'normal';
    var newFontStyle = (newFontVariants.italic === true) ? 'italic' : 'normal';
    var newFontFamilyEmbed = newFontFamily + '--' + newFontWeight + '--' + newFontStyle;

    var _callback = function() {
        $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);

        if (addToHistory === true) {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }
    }.bind(this);

    // Marking the correct font family active on the dropdown
    $(this.config.el.text.fontFamily).removeClass(this.config.coreClasses.fontFamilyActive);
    $fontElement.addClass(this.config.coreClasses.fontFamilyActive);

    // Change the font family/weight/style of the svg text
    $text.attr(this.config.attributes.text.fontFamilyData, newFontFamily);

    // If there's actually a deliberate font change, we need
    // to make sure that we're removing any bold/italic effects
    // from the text element, because we're not sure such weights
    // or styles are supported by the new font or not.
    if (addToHistory === true) {
        $text
            .attr('data-font-weight', 'normal')
            .attr('data-font-style', 'normal');

        this.changeSwitchState($(this.config.el.text.italic), 'inactive');
        this.changeSwitchState($(this.config.el.text.bold), 'inactive');
    }

    // Changing the active font name text on the dropdown to reflect the change
    $(this.config.el.text.fontFamilyValue)
        .attr('class', this.helpers.getRawName(this.config.el.text.fontFamilyValue) + ' ' + newFontFamilyClassname)
        .attr('data-toolbar-component-value', newFontFamily)
        .text(newFontFamily);

    // Check if there's support for bold or italic
    if (newFontVariants.bold === false) {
        $('.toolbar-component__font-style__button--bold').addClass('toolbar-component__font-style__button--disabled');
    } else {
        $('.toolbar-component__font-style__button--bold').removeClass('toolbar-component__font-style__button--disabled');
    }

    if (newFontVariants.italic === false) {
        $('.toolbar-component__font-style__button--italic').addClass('toolbar-component__font-style__button--disabled');
    } else {
        $('.toolbar-component__font-style__button--italic').removeClass('toolbar-component__font-style__button--disabled');
    }

    if (refresh === true) {
        this.helpers.embedFonts(_callback);
    }
};

GS.Editor.Toolbars.Text.prototype.getFontVariants = function($font) {
    $font = $font ||
            $('[data-toolbar-component="font-family"] [data-font-family="' + $('.toolbar-component__font-family__value').attr('data-toolbar-component-value') + '"]');

    var fontData = $font.data();

    return {
        bold: fontData['fontVariantsBold'],
        italic: fontData['fontVariantsItalic'],
        boldItalic: fontData['fontVariantsBolditalic']
    };
};

/**
 * Toggles the font weight of the active text item between bold and normal
 *
 * @param  {String}  forcedState  (Optional) forced state (active/inactive)
 * @param  {Boolean} refresh      Refresh the embedded defs style @ the svg
 * @param  {Boolean} addToHistory Add a history state
 */
GS.Editor.Toolbars.Text.prototype.changeFontWeight = function(forcedState, refresh, addToHistory) {
    addToHistory = addToHistory || false;
    refresh = refresh || false;

    var $text = this.helpers.getActiveLogoItem().find('text');
    var forcedState = forcedState || false;
    var newState = this.changeSwitchState($(this.config.el.text.bold), forcedState);
    var newFontWeight = newState === 'active' ? 'bold' : 'normal';
    var fontVariants = this.getFontVariants();
    var _callback = function() {
        $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);

        if (addToHistory === true) {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }

        if (newState === 'active' && fontVariants.boldItalic === false) {
            $('.toolbar-component__font-style__button--italic').addClass('toolbar-component__font-style__button--disabled');
        }
    }.bind(this);

    // Check for bold + italic support if we're activating
    // and add or remove support classes accordingly
    if (newState === 'inactive') {
        if (fontVariants.italic === true) {
            $('.toolbar-component__font-style__button--italic').removeClass('toolbar-component__font-style__button--disabled');
        } else {
            $('.toolbar-component__font-style__button--italic').addClass('toolbar-component__font-style__button--disabled');
        }
    }

    $text.attr(this.config.attributes.text.fontWeight, newFontWeight);

    if (refresh === true) {
        this.helpers.embedFonts(_callback);
    }
};

/**
 * Toggles the font style of the active text item between italic and normal
 *
 * @param  {String} (optional) forcedState If this is set (active/inactive) we enforce
 *                                         its value otherwise we just toggle it
 * @param  {Boolean} refresh               Refresh the embedded defs style @ the svg
 * @param  {Boolean} addToHistory          Add a history state
 */
GS.Editor.Toolbars.Text.prototype.changeFontStyle = function(forcedState, refresh, addToHistory) {
    addToHistory = addToHistory || false;
    refresh = refresh || false;

    var $text = this.helpers.getActiveLogoItem().find('text');
    var forcedState = forcedState || false;
    var newState = this.changeSwitchState($(this.config.el.text.italic), forcedState);
    var newFontStyle = newState === 'active' ? 'italic' : 'normal';
    var fontVariants = this.getFontVariants();
    var _callback = function() {
        $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);

        if (addToHistory === true) {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }

        if (newState === 'active' && fontVariants.boldItalic === false) {
            $('.toolbar-component__font-style__button--bold').addClass('toolbar-component__font-style__button--disabled');
        }
    }.bind(this);

    // Check for bold + italic support if we're activating
    // and add or remove support classes accordingly
    if (newState === 'inactive') {
        if (fontVariants.bold === true) {
            $('.toolbar-component__font-style__button--bold').removeClass('toolbar-component__font-style__button--disabled');
        } else {
            $('.toolbar-component__font-style__button--bold').addClass('toolbar-component__font-style__button--disabled');
        }
    }

    $text.attr(this.config.attributes.text.fontStyle, newFontStyle);

    if (refresh === true) {
        this.helpers.embedFonts(_callback);
    }
};

/**
 * Sets the new letter-spacing value to the active logo item
 *
 * @param {Number|String} value The target value number to set
 */
GS.Editor.Toolbars.Text.prototype.changeLetterSpacing = function(value) {
    value = parseInt(value, 10);
    var $text = this.helpers.getActiveLogoItem().find('text');

    $(this.config.el.text.letterSpacingValue).text(value);
    $text.attr(this.config.attributes.text.letterSpacing, value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Sets the new stroke thickness value to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Text.prototype.changeStrokeThickness = function(value) {
    var $text = this.helpers.getActiveLogoItem().find('text');

    $(this.config.el.stroke.thicknessValue).text(value);

    $text.attr('stroke-width', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Sets the new glow thickness value to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Text.prototype.changeGlowThickness = function(value) {
    var $text = this.helpers.getActiveLogoItem().find('text');
    var $glowEffect = $($text.attr('filter').replace('url(', '').replace(')', '')).find('[result="glow"]');

    $(this.config.el.glow.thicknessValue).text(value);

    $glowEffect[0].setAttribute('stdDeviation', value);

    $text.attr('data-filter-glow-thickness', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Sets the new shadow distance value to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Text.prototype.changeShadowDistance = function(value) {
    var $text = this.helpers.getActiveLogoItem().find('text');
    var $shadowEffect = $($text.attr('filter').replace('url(', '').replace(')', '')).find('[result="offsetShadow"]');
    var angle = parseInt($('[data-toolbar="text"]').find(this.config.el.shadow.angleValue).text(), 10);
    var finalValue = this.helpers.getPointFromDistanceAndAngle(value, angle);

    $(this.config.el.shadow.distanceValue).text(value);

    $shadowEffect[0].setAttribute('dx', finalValue.x);
    $shadowEffect[0].setAttribute('dy', finalValue.y);

    $text.attr('data-filter-shadow-distance', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Sets the new shadow distance angle to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Text.prototype.changeShadowAngle = function(value) {
    var $text = this.helpers.getActiveLogoItem().find('text');
    var $shadowEffect = $($text.attr('filter').replace('url(', '').replace(')', '')).find('[result="offsetShadow"]');
    var distance = parseInt($('[data-toolbar="text"]').find(this.config.el.shadow.distanceValue).text(), 10);
    var finalValue = this.helpers.getPointFromDistanceAndAngle(distance, value);

    $(this.config.el.shadow.angleValue).text(value);

    $shadowEffect[0].setAttribute('dx', finalValue.x);
    $shadowEffect[0].setAttribute('dy', finalValue.y);

    $text.attr('data-filter-shadow-angle', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

GS.Editor.Toolbars.Text.prototype.addStroke = function() {
    var $text = this.helpers.getActiveLogoItem().find('text');

    $text.attr('vector-effect', 'non-scaling-stroke');
    $text.attr('stroke', '#000000');
    $text.attr('stroke-width', 1);

    setTimeout(function() {
        $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
    }.bind(this), 0);
},

GS.Editor.Toolbars.Text.prototype.removeStroke = function() {
    var $text = this.helpers.getActiveLogoItem().find('text');

    $text.removeAttr('vector-effect');
    $text.removeAttr('stroke');
    $text.removeAttr('stroke-width');

    setTimeout(function() {
        $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
    }.bind(this), 0);
};

// 1) set filter on
// 2) check if filter exists
//   - Exists -> read values on $part -> recreate filter -> assign filter to $part
//   - Doesn’t Exist -> create initial values of $part element -> create filter -> assign filter to $part
GS.Editor.Toolbars.Text.prototype.addEffect = function(effect) {
    var $activeLogo = this.helpers.getActiveLogoItem();
    var $text = $activeLogo.find('text');
    var $filter = $activeLogo.find('filter');
    var effectId = ($filter.length === 0) ? $text.attr('data-part-id') + '_Effect' : $filter.attr('id');
    var filterHtml = '<filter id="' + effectId + '" x="-100%" y="-100%" width="300%" height="300%">' +
        '<feMerge>' +
            '<feMergeNode in="SourceGraphic" />' +
        '</feMerge>' +
    '</filter>';

    var shadowData = {
        filterHtml: '<feOffset in="SourceAlpha" dx="0" dy="0" result="offsetShadow" />' +
                    '<feGaussianBlur in="offsetShadow" stdDeviation="2" result="shadow" />',
        mergeHtml: '<feMergeNode in="shadow" />'
    };

    var glowData = {
        filterHtml: '<feGaussianBlur in="SourceGraphic" stdDeviation="1" result="glow" />',
        mergeHtml: '<feMergeNode in="glow" />'
    };

    var addShadow = function($filter) {
        $filter.prepend(shadowData.filterHtml);
        $filter.find('feMerge').prepend(shadowData.mergeHtml);

        $text.attr('data-filter-shadow', '');
        $text.attr('data-filter-shadow-distance', 0);
        $text.attr('data-filter-shadow-angle', 45);
    };

    var addGlow = function($filter) {
        $filter.prepend(glowData.filterHtml);
        $filter.find('feMerge').prepend(glowData.mergeHtml);

        $text.attr('data-filter-glow', '');
        $text.attr('data-filter-glow-thickness', 1);
    };

    if ($filter.length == 0) {
        var $newFilter = $(filterHtml);

        switch(effect) {
            case 'shadow':
                addShadow($newFilter);
                setTimeout(function() {
                    this.changeShadowAngle(45);
                    this.changeShadowDistance(0);
                }.bind(this), 20);
                break;
            case 'glow':
                addGlow($newFilter);
                break;
        }

        $newFilter.insertBefore($text);

        this.helpers.fixSvgNamespace(effectId);
    } else {
        // Here we do checks to see what filters are active and what are not,
        // then add accordingly
        var hasShadow = (typeof $text.attr('data-filter-shadow') != 'undefined') ? true : false;
        var hasGlow = (typeof $text.attr('data-filter-glow') != 'undefined') ? true : false;

        if (hasShadow === true && effect === 'glow') {
            addGlow($filter);
        }

        if (hasGlow === true && effect === 'shadow') {
            addShadow($filter);
        }

        this.helpers.fixSvgNamespace(effectId);
    }

    $text.attr('filter', 'url(#' + effectId + ')');

    this.helpers.refreshSVG();

    setTimeout(function() {
        $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
    }.bind(this), 20);
};

GS.Editor.Toolbars.Text.prototype.removeEffect = function(effect) {
    var $activeLogo = this.helpers.getActiveLogoItem();
    var $text = $activeLogo.find('text');
    var $filter = $activeLogo.find('filter');
    var effectId = ($filter.length === 0) ? $text.attr('data-part-id') + '_Effect' : $filter.attr('id');
    var hasShadow = (typeof $text.attr('data-filter-shadow') != 'undefined') ? true : false;
    var hasGlow = (typeof $text.attr('data-filter-glow') != 'undefined') ? true : false;

    var clearShadowAttributes = function() {
        $text.removeAttr('data-filter-shadow');
        $text.removeAttr('data-filter-shadow-distance');
        $text.removeAttr('data-filter-shadow-angle');
    };

    var clearGlowAttributes = function() {
        $text.removeAttr('data-filter-glow');
        $text.removeAttr('data-filter-glow-thickness');
    };

    if (effect === 'shadow') {
        if (hasGlow === false) {
            $text.removeAttr('filter');
            clearShadowAttributes();

            $filter.remove();
        } else {
            $filter.find('[result="offsetShadow"]').remove();
            $filter.find('[in="shadow"]').remove();
            $filter.find('[result="shadow"]').remove();

            clearShadowAttributes();
        }
    }

    if (effect === 'glow') {
        if (hasShadow === false) {
            $text.removeAttr('filter');

            clearGlowAttributes();

            $filter.remove();
        } else {
            $filter.find('[result="glow"]').remove();
            $filter.find('[in="glow"]').remove();

            clearGlowAttributes();
        }
    }

    this.helpers.refreshSVG();

    setTimeout(function() {
        $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
    }.bind(this), 20);
};

GS.Editor.Toolbars.Text.prototype.switchStroke = function($switchButton, state) {
    switch (state) {
        case 'off':
            $switchButton.closest('.toolbar-component__stroke').removeClass('toolbar-component__stroke--active');

            this.removeStroke();
            break;
        case 'on':
            $switchButton.closest('.toolbar-component__stroke').addClass('toolbar-component__stroke--active');

            this.addStroke();
            break;
        default:
            if (!$switchButton.closest('.toolbar-component__stroke').hasClass('toolbar-component__stroke--active')) {
                $switchButton.closest('.toolbar-component__stroke').addClass('toolbar-component__stroke--active');

                this.addStroke();
            } else {
                $switchButton.closest('.toolbar-component__stroke').removeClass('toolbar-component__stroke--active');

                this.removeStroke();
            }
            break;
    }
};

GS.Editor.Toolbars.Text.prototype.switchShadow = function($switchButton, state) {
    switch (state) {
        case 'off':
            $switchButton.closest('.toolbar-component__shadow').removeClass('toolbar-component__shadow--active');

            this.removeEffect('shadow');
            break;
        case 'on':
            $switchButton.closest('.toolbar-component__shadow').addClass('toolbar-component__shadow--active');

            this.addEffect('shadow');
            break;
        default:
            if (!$switchButton.closest('.toolbar-component__shadow').hasClass('toolbar-component__shadow--active')) {
                $switchButton.closest('.toolbar-component__shadow').addClass('toolbar-component__shadow--active');

                this.addEffect('shadow');
            } else {
                $switchButton.closest('.toolbar-component__shadow').removeClass('toolbar-component__shadow--active');

                this.removeEffect('shadow');
            }
            break;
    }
};

GS.Editor.Toolbars.Text.prototype.switchGlow = function($switchButton, state) {
    switch (state) {
        case 'off':
            $switchButton.closest('.toolbar-component__glow').removeClass('toolbar-component__glow--active');

            this.removeEffect('glow');
            break;
        case 'on':
            $switchButton.closest('.toolbar-component__glow').addClass('toolbar-component__glow--active');

            this.addEffect('glow');
            break;
        default:
            if (!$switchButton.closest('.toolbar-component__glow').hasClass('toolbar-component__glow--active')) {
                $switchButton.closest('.toolbar-component__glow').addClass('toolbar-component__glow--active');

                this.addEffect('glow');
            } else {
                $switchButton.closest('.toolbar-component__glow').removeClass('toolbar-component__glow--active');

                this.removeEffect('glow');
            }
            break;
    }
};

/**
 * Increase or decrease the value of a toolbar component
 *
 * @param  {jQuery} $actionEl Increase/Decrease element
 * @return {Number}           The new value of the toolbar component
 */
GS.Editor.Toolbars.Text.prototype.changeComponentValue = function($actionEl) {
    var action = $actionEl.data(this.config.attributes.toolbarComponentValueChange);
    var componentValue = parseInt($actionEl.siblings(this.config.el.toolbarComponentValue).text(), 10);
    var componentValueMin = $actionEl.data(this.config.attributes.toolbarComponentValueMin);
    var componentValueMax = $actionEl.data(this.config.attributes.toolbarComponentValueMax);
    var newComponentValue;

    if (action === 'increase') {
        if (componentValue + 1 > componentValueMax) {
            newComponentValue = componentValueMax;
        } else {
            newComponentValue = componentValue + 1;
        }
    } else {
        if (componentValue - 1 < componentValueMin) {
            newComponentValue = componentValueMin;
        } else {
            newComponentValue = componentValue - 1;
        }
    }

    return newComponentValue;
};

/**
 * Core function that changes the state of toolbar component switches
 *
 * @param  {jQuery} $switchEl   The target switch element we need to toggle/force its state
 * @param  {String} forcedState (Optional) forced state (active/inactive).
 * @return {String}             The new state of the switch
 */
GS.Editor.Toolbars.Text.prototype.changeSwitchState = function($switchEl, forcedState) {
    var state = $switchEl.attr('data-' + this.config.attributes.toolbarComponentSwitch);
    var newState = (forcedState !== false) ? forcedState : (state === 'active') ? 'inactive' : 'active';

    $switchEl.attr('data-' + this.config.attributes.toolbarComponentSwitch, newState);

    return newState;
};
;/* -----------------------------------------
    Logo Editor Shape Toolbar module

    @todo       Fix it. :o
    @author     Konstantinos Vasileiou <kostas@neverbland.com>
    @copyrights Neverbland 2014
----------------------------------------- */

/**
 * Shape Toolbar constructor

 * @param {Object} options   Toolbars initialization options
 * @param {Object} helpers   Editor helpers
 * @param {Object} templates Editor templates
 */
GS.Editor.Toolbars.Shape = function(options, colourHistory, helpers, templates) {
    this.options = options || {};

    this.defaults = {
        el: {
            toolbarComponents: {
                effects: {
                    switchButtonShadow: '.toolbar-component__switch--shadow',
                    switchButtonGlow: '.toolbar-component__switch--glow',
                    switchButtonStroke: '.toolbar-component__switch--stroke'
                }
            },
            shadow: {
                angleValue: '.toolbar-component__value-change__value--shadow-angle',
                angleButton: '.toolbar-component__shadow__angle .toolbar-component__value-change__button',
                distanceValue: '.toolbar-component__value-change__value--shadow-distance',
                distanceButton: '.toolbar-component__shadow__distance .toolbar-component__value-change__button'
            },
            glow: {
                thicknessValue: '.toolbar-component__value-change__value--glow-thickness',
                thicknessButton: '.toolbar-component__glow__thickness .toolbar-component__value-change__button'
            },
            stroke: {
                thicknessValue: '.toolbar-component__value-change__value--stroke-thickness',
                thicknessButton: '.toolbar-component__stroke__thickness .toolbar-component__value-change__button'
            },
            colourpicker: {
                shape: {
                    toolbarParent: '[data-toolbar="shape"]',
                    solid: '#colourpicker--shape--solid',
                    gradient: {
                        first: '#colourpicker--shape--gradient--first',
                        second: '#colourpicker--shape--gradient--second'
                    }
                },
                effects: {
                    glow: {
                        solid: '[data-toolbar="shape"] #colourpicker--glow--solid'
                    },
                    shadow: {
                        solid: '[data-toolbar="shape"] #colourpicker--shadow--solid'
                    },
                    stroke: {
                        solid: '[data-toolbar="shape"] #colourpicker--stroke--solid'
                    }
                }
            }
        },
        attributes: {
            shape: {
                fill: 'fill'
            }
        }
    };

    this.colourHistory = colourHistory;
    this.helpers = helpers;
    this.templates = templates;

    // Colourpicker instances
    this.colourpickerSolid = '';
    this.colourpickerGradientFirst = '';
    this.colourpickerGradientSecond = '';
    this.strokeColourpickerSolid = '';

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Toolbars.Shape.prototype.initialize = function() {
    console.log(' ~> Initialized shape toolbar');

    this.registerEvents();
};

GS.Editor.Toolbars.Shape.prototype.registerEvents = function() {
    var self = this;

    this.unregisterEvents();

    // Fill solid/gradient switch
    $(this.config.el.colourpicker.shape.toolbarParent).on('click', this.config.el.toolbarComponents.fill.switchButton, function(ev) {
        self.switchFillMode($(this).closest(self.config.el.toolbarComponents.fill.main));
    });

    // Shadow switch toggle
    $(this.config.el.colourpicker.shape.toolbarParent).on('click', this.config.el.toolbarComponents.effects.switchButtonShadow, function(ev) {
        self.switchShadow($(this));
    });

    // Glow switch toggle
    $(this.config.el.colourpicker.shape.toolbarParent).on('click', this.config.el.toolbarComponents.effects.switchButtonGlow, function(ev) {
        self.switchGlow($(this));
    });

    // Stroke switch toggle
    $(this.config.el.colourpicker.shape.toolbarParent).on('click', this.config.el.toolbarComponents.effects.switchButtonStroke, function(ev) {
        self.switchStroke($(this));
    });

    // Stroke width value change
    $(this.config.el.colourpicker.shape.toolbarParent).on('click', this.config.el.stroke.thicknessButton, function(ev) {
        self.changeStrokeThickness(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    // Glow thickness value change
    $(this.config.el.colourpicker.shape.toolbarParent).on('click', this.config.el.glow.thicknessButton, function(ev) {
        self.changeGlowThickness(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    // Shadow distance value change
    $(this.config.el.colourpicker.shape.toolbarParent).on('click', this.config.el.shadow.distanceButton, function(ev) {
        self.changeShadowDistance(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    // Shadow angle value change
    $(this.config.el.colourpicker.shape.toolbarParent).on('click', this.config.el.shadow.angleButton, function(ev) {
        self.changeShadowAngle(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    $(this.config.el.colourpicker.shape.toolbarParent).on('click', this.config.el.toolbarComponents.fill.switchGradientPickerButton, function(ev) {
        self.switchGradientPicker($(this));
    });
};

GS.Editor.Toolbars.Shape.prototype.unregisterEvents = function() {
    $(this.config.el.colourpicker.shape.toolbarParent).off('click');
    $(this.config.el.toolbarComponent).off(GS.Editor.Events.Toolbars.UpdatePickers);
};

/**
 * Preparing the toolbar by fetching and appending the template, then
 * populating the right data based on the selected/active shape item.
 * Also, we're initializing the coloupicker. Amazing stuff!
 *
 * @param  {String} toolbarType Specifiying the type of toolbar (Text/Image/Shape/etc)
 * @return {Object}             Toolbars instance
 */
GS.Editor.Toolbars.Shape.prototype.prepareShapeToolbar = function(toolbarType) {
    var self = this;
    var hasPartActive = this.helpers.hasItemPartActive();
    var $toolbarParent = $(this.config.el.colourpicker.shape.toolbarParent);
    var $target = hasPartActive ? this.helpers.getActiveLogoItem().find('.' + this.config.coreClasses.logoPartActive) : this.helpers.getActiveLogoItem().find('[fill]');
    var fill = $($target[0]).attr('fill');

    // Initializing the colourpickers
    this.colourpickerSolid = self.helpers.createColorPicker(this.config.el.colourpicker.shape.solid, function(hex, hsv, rgb) {
        $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.UpdateSolidFills, [{ type: toolbarType, parent: $toolbarParent, hex: hex }]);

        var hasPartActive = this.helpers.hasItemPartActive();
        var $colourTarget = hasPartActive
            ? this.helpers.getActiveLogoItem().find('.' + this.config.coreClasses.logoPartActive)
            : this.helpers.getActiveLogoItem().find('[fill]')
            ;

        // Do _not_ use $target here. It may no longer be valid after glow/shadow changes
        $colourTarget.attr('fill', hex);
    }.bind(this));

    this.colourpickerGradientFirst = self.helpers.createColorPicker(this.config.el.colourpicker.shape.gradient.first, function(hex, hsv, rgb) {
        var partFill = this.helpers.getItemActivePart().attr('fill');
        var $gradientStops = $(this.helpers.getGradientIdFromPath(partFill)).find('stop');
        var hexSecond = $(this.config.el.colourpicker[toolbarType].toolbarParent).find(this.config.el.toolbarComponents.fill.gradient.value.second).text();

        $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.UpdateGradientFills, [{ type: toolbarType, parent: $toolbarParent, hexFirst: hex, hexSecond: hexSecond }]);

        $gradientStops[0].setAttribute('style', 'stop-color:' + hex);
    }.bind(this));

    this.colourpickerGradientSecond = self.helpers.createColorPicker(this.config.el.colourpicker.shape.gradient.second, function(hex, hsv, rgb) {
        var partFill = this.helpers.getItemActivePart().attr('fill');
        var $gradientStops = $(this.helpers.getGradientIdFromPath(partFill)).find('stop');
        var hexFirst = $(this.config.el.colourpicker[toolbarType].toolbarParent).find(this.config.el.toolbarComponents.fill.gradient.value.first).text();

        $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.UpdateGradientFills, [{ type: toolbarType, parent: $toolbarParent, hexFirst: hexFirst, hexSecond: hex }]);

        $gradientStops[1].setAttribute('style', 'stop-color:' + hex);
    }.bind(this));

    // Initializing the stroke colourpicker
    this.strokeColourpickerSolid = self.helpers.createColorPicker(this.config.el.colourpicker.effects.stroke.solid, function(hex, hsv, rgb) {
        var targetHex = this.helpers.getItemActivePart().attr('stroke', hex);
    }.bind(this));

    // Updating the colourpicker with the item's
    // fill, but only when a part is active
    if (hasPartActive) {
        var $part = this.helpers.getItemActivePart();
        var stroke = $part.attr('stroke');
        var strokeWidth = $part.attr('stroke-width');

        var hasShadow = (typeof $part.attr('data-filter-shadow') != 'undefined') ? true : false;
        var hasGlow = (typeof $part.attr('data-filter-glow') != 'undefined') ? true : false;
        var hasStroke = (typeof $part.attr('stroke') != 'undefined') ? true : false;

        $('.toolbar-component-group--effects').addClass('toolbar-component-group--effects--active');

        if (hasShadow) {
            var shadowAngle = $part.attr('data-filter-shadow-angle');
            var shadowDistance = $part.attr('data-filter-shadow-distance');

            $('.toolbar-component__shadow').addClass('toolbar-component__shadow--active');

            $(this.config.el.shadow.angleValue).text(shadowAngle);
            $(this.config.el.shadow.distanceValue).text(shadowDistance);

            this.changeShadowAngle(shadowAngle);
            this.changeShadowDistance(shadowDistance);
        } else {
            $('.toolbar-component__shadow').removeClass('toolbar-component__shadow--active');

            $(this.config.el.shadow.angleValue).text('0');
            $(this.config.el.shadow.distanceValue).text('0');
        }

        if (hasGlow) {
            var glowThickness = $part.attr('data-filter-glow-thickness');

            $('.toolbar-component__glow').addClass('toolbar-component__glow--active');

            $(this.config.el.glow.thicknessValue).text(glowThickness);

            this.changeGlowThickness(glowThickness);
        } else {
            $('.toolbar-component__glow').removeClass('toolbar-component__glow--active');

            $(this.config.el.glow.thicknessValue).text('1');
        }

        if (hasStroke) {
            var stroke = $part.attr('stroke');
            var strokeWidth = $part.attr('stroke-width');

            $('.toolbar-component__stroke').addClass('toolbar-component__stroke--active');
            $(this.config.el.stroke.thicknessValue).text(stroke);

            this.changeStrokeThickness(strokeWidth);
            this.strokeColourpickerSolid.setHex(stroke);
        } else {
            $('.toolbar-component__stroke').removeClass('toolbar-component__stroke--active');
            $(this.config.el.stroke.thicknessValue).text('1');
        }

        $toolbarParent
            .find(this.config.el.toolbarComponents.switchButton)
                .removeClass(this.config.coreClasses.toolbarComponentSwitchDisabled);

        // Updating the colourpicker with the item's fill
        // Is it agradient fill?
        if (fill.indexOf('url(') == 0) {
            var $gradient = $(this.helpers.getGradientIdFromPath(fill));
            var gradientFills = this.helpers.getGradientsFromGradientStyleElement($gradient);

            this.colourpickerGradientFirst.setHex(gradientFills.first);
            this.colourpickerGradientSecond.setHex(gradientFills.second);

            this.switchFillMode($toolbarParent.find(this.config.el.toolbarComponents.fill.main), 'gradient');
        // or a solid fill?
        } else {
            this.switchFillMode($toolbarParent.find(this.config.el.toolbarComponents.fill.main), 'solid');
            this.colourpickerSolid.setHex(fill);
        }
    } else {
        $('.toolbar-component-group--effects').removeClass('toolbar-component-group--effects--active');

        this.switchFillMode($toolbarParent.find(this.config.el.toolbarComponents.fill.main), 'solid');

        $toolbarParent
            .find(this.config.el.toolbarComponents.switchButton)
                .addClass(this.config.coreClasses.toolbarComponentSwitchDisabled);
    }

    // Registering click event for clicking on Colour Matching/History circles
    $(this.config.el.colourpicker[toolbarType].toolbarParent).on('click', '[data-' + this.config.attributes.toolbarChangeFillTrigger + ']', function() {
        var targetHex = $(this).attr('data-' + self.config.attributes.toolbarChangeFillTrigger);

        if ($(this).hasClass(self.helpers.getRawName(self.config.el.toolbarComponents.fill.matchItem))) {
            $(self.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: targetHex }]);
        }

        self.colourpickerSolid.setHex(targetHex);
    });

    $(this.config.el.colourpicker[toolbarType].toolbarParent).on('click', '.toolbar-component__fill--gradient [data-' + this.config.attributes.toolbarChangeFillTrigger + ']', function() {
        var $this = $(this);
        var targetHex = $this.attr('data-' + self.config.attributes.toolbarChangeFillTrigger);

        if ($this.closest('.toolbar-component__fill--gradient').attr('data-gradient-colourpicker-active') === 'first') {
            self.colourpickerGradientFirst.setHex(targetHex);
        } else {
            self.colourpickerGradientSecond.setHex(targetHex)
        }

        $(self.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: targetHex }]);
    });

    // Contenteditable updates
    $(this.config.el.toolbarComponent).on(GS.Editor.Events.Toolbars.UpdatePickers, function(ev, $source) {
        var $component = $(this);
        var type = $component.data('toolbar-component');
        var value = $source.text();
        var mapping = {};

        if ($source.is(self.config.el.toolbarComponents.fill.solid.value)) {
            self.colourpickerSolid.setHex('#' + value);

            $(self.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: '#' + value }]);
        }

        if ($source.is(self.config.el.toolbarComponents.fill.gradient.value.first)) {
            self.colourpickerGradientFirst.setHex('#' + value);
            $(self.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: '#' + value }]);
        }

        if ($source.is(self.config.el.toolbarComponents.fill.gradient.value.second)) {
            self.colourpickerGradientSecond.setHex('#' + value);
            $(self.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: '#' + value }]);
        }

        mapping[self.config.el.stroke.thicknessValue] = 'changeStrokeThickness';
        mapping[self.config.el.shadow.angleValue] = 'changeShadowAngle';
        mapping[self.config.el.shadow.distanceValue] = 'changeShadowDistance';
        mapping[self.config.el.glow.thicknessValue] = 'changeGlowThickness';

        $.each(mapping, function(className, method) {
            if ($source.is(className)) {
                self[method](parseInt(value, 10));
            }
        });

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    return this;
};

/**
 * Sets the new stroke thickness value to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Shape.prototype.changeStrokeThickness = function(value) {
    var $part = this.helpers.getItemActivePart();

    $(this.config.el.stroke.thicknessValue).text(value);

    $part.attr('stroke-width', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Sets the new glow thickness value to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Shape.prototype.changeGlowThickness = function(value) {
    var $part = this.helpers.getItemActivePart();
    var $glowEffect = $('#' + $part.attr('data-part-id') + '_Effect').find('[result="glow"]');

    $(this.config.el.glow.thicknessValue).text(value);

    $glowEffect[0].setAttribute('stdDeviation', value);

    $part.attr('data-filter-glow-thickness', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Sets the new shadow distance value to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Shape.prototype.changeShadowDistance = function(value) {
    var $part = this.helpers.getItemActivePart();
    var $shadowEffect = $('#' + $part.attr('data-part-id') + '_Effect').find('[result="offsetShadow"]');
    var angle = parseInt($('[data-toolbar="shape"]').find(this.config.el.shadow.angleValue).text(), 10);
    var finalValue = this.helpers.getPointFromDistanceAndAngle(value, angle);

    $(this.config.el.shadow.distanceValue).text(value);

    $shadowEffect[0].setAttribute('dx', finalValue.x);
    $shadowEffect[0].setAttribute('dy', finalValue.y);

    $part.attr('data-filter-shadow-distance', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Sets the new shadow distance angle to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Shape.prototype.changeShadowAngle = function(value) {
    var $part = this.helpers.getItemActivePart();
    var $shadowEffect = $('#' + $part.attr('data-part-id') + '_Effect').find('[result="offsetShadow"]');
    var distance = parseInt($('[data-toolbar="shape"]').find(this.config.el.shadow.distanceValue).text(), 10);
    var finalValue = this.helpers.getPointFromDistanceAndAngle(distance, value);

    $(this.config.el.shadow.angleValue).text(value);

    $shadowEffect[0].setAttribute('dx', finalValue.x);
    $shadowEffect[0].setAttribute('dy', finalValue.y);

    $part.attr('data-filter-shadow-angle', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Generate a gradient element. Nice. Like it needed an explanation.
 *
 * @todo It should accept a prefix (+ index?) for a name
 */
GS.Editor.Toolbars.Shape.prototype.generateGradientElement = function() {
    if (this.helpers.hasItemPartActive()) {
        var $part = this.helpers.getItemActivePart();
        var partId = $part.attr('data-part-id');
        var fill = $part.attr('fill');
        var index = $part.index();
        var $linearGradient;

        if (fill.indexOf('url(') == -1) {
            if ($('#' + partId).length == 0) {
                $linearGradient = $('<linearGradient id="' + partId + '" gradientUnits="objectBoundingBox" x1="0.5" y1="0" x2="0.5" y2="1">' +
                                        '<stop offset="0" style="stop-color:#333333"></stop>' +
                                        '<stop offset="1" style="stop-color:#999999"></stop>' +
                                    '</linearGradient>');
                 $linearGradient.insertBefore($part);

                this.helpers.fixSvgNamespace(partId);
            }

            $part.attr('fill', 'url(#' + partId + ')');

            this.colourpickerGradientFirst.setHex('#333333');
            this.colourpickerGradientSecond.setHex('#999999');

            this.helpers.refreshSVG();
        } else {
            // einai to url idio me to part id?
            if (fill === 'url(#' + partId + ')') {
                var $gradient = $(this.helpers.getGradientIdFromPath(fill));
                var gradientFills = this.helpers.getGradientsFromGradientStyleElement($gradient);

                this.colourpickerGradientFirst.setHex(gradientFills.first);
                this.colourpickerGradientSecond.setHex(gradientFills.second);
            // an den einai to url idio me to part id
            } else {
                $linearGradient = $('<linearGradient id="' + partId + '" gradientUnits="objectBoundingBox" x1="0.5" y1="0" x2="0.5" y2="1">' +
                                        '<stop offset="0" style="stop-color:#333333"></stop>' +
                                        '<stop offset="1" style="stop-color:#999999"></stop>' +
                                    '</linearGradient>');
                $linearGradient.insertBefore($part);

                this.helpers.fixSvgNamespace(partId);

                $part.attr('fill', 'url(#' + partId + ')');

                this.colourpickerGradientFirst.setHex('#333333');
                this.colourpickerGradientSecond.setHex('#999999');

                this.helpers.refreshSVG();
            }
        }
    }
};

GS.Editor.Toolbars.Shape.prototype.addStroke = function() {
    if (this.helpers.hasItemPartActive()) {
        var $part = this.helpers.getItemActivePart();

        $part.attr('vector-effect', 'non-scaling-stroke');
        $part.attr('stroke', '#000000');
        $part.attr('stroke-width', 1);

        setTimeout(function() {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }.bind(this), 0);
    }
};

GS.Editor.Toolbars.Shape.prototype.removeStroke = function() {
    if (this.helpers.hasItemPartActive()) {
        var $part = this.helpers.getItemActivePart();

        $part.removeAttr('vector-effect');
        $part.removeAttr('stroke');
        $part.removeAttr('stroke-width');

        setTimeout(function() {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }.bind(this), 0);
    }
};

// 1) set filter on
// 2) check if filter exists
//   - Exists -> read values on $part -> recreate filter -> assign filter to $part
//   - Doesn’t Exist -> create initial values of $part element -> create filter -> assign filter to $part
GS.Editor.Toolbars.Shape.prototype.addEffect = function(effect) {
    if (this.helpers.hasItemPartActive()) {
        var $part = this.helpers.getItemActivePart();
        var partId = $part.attr('data-part-id');
        var effectId = partId + '_Effect';
        var filterHtml = '<filter id="' + effectId + '" x="-100%" y="-100%" width="300%" height="300%">' +
            '<feMerge>' +
                '<feMergeNode in="SourceGraphic" />' +
            '</feMerge>' +
        '</filter>';

        var shadowData = {
            filterHtml: '<feOffset in="SourceAlpha" dx="0" dy="0" result="offsetShadow" />' +
                        '<feGaussianBlur in="offsetShadow" stdDeviation="6" result="shadow" />',
            mergeHtml: '<feMergeNode in="shadow" />'
        };

        var glowData = {
            filterHtml: '<feGaussianBlur in="SourceGraphic" stdDeviation="1" result="glow" />',
            mergeHtml: '<feMergeNode in="glow" />'
        };

        var addShadow = function($filter) {
            $filter.prepend(shadowData.filterHtml);
            $filter.find('feMerge').prepend(shadowData.mergeHtml);

            $part.attr('data-filter-shadow', '');
            $part.attr('data-filter-shadow-distance', 0);
            $part.attr('data-filter-shadow-angle', 45);
        };

        var addGlow = function($filter) {
            $filter.prepend(glowData.filterHtml);
            $filter.find('feMerge').prepend(glowData.mergeHtml);

            $part.attr('data-filter-glow', '');
            $part.attr('data-filter-glow-thickness', 1);
        };

        var $filter = $('#' + effectId);
        if ($filter.length == 0) {
            var $newFilter = $(filterHtml);

            switch(effect) {
                case 'shadow':
                    addShadow($newFilter);
                    setTimeout(function() {
                        this.changeShadowAngle(45);
                        this.changeShadowDistance(0);
                    }.bind(this), 20);
                    break;
                case 'glow':
                    addGlow($newFilter);
                    break;
            }

            $newFilter.insertBefore($part);

            this.helpers.fixSvgNamespace(effectId);
        } else {
            // Here we do checks to see what filters are active and what are not,
            // then add accordingly
            var hasShadow = (typeof $part.attr('data-filter-shadow') != 'undefined') ? true : false;
            var hasGlow = (typeof $part.attr('data-filter-glow') != 'undefined') ? true : false;

            if (hasShadow === true && effect === 'glow') {
                addGlow($filter);
            }

            if (hasGlow === true && effect === 'shadow') {
                addShadow($filter);
            }

            this.helpers.fixSvgNamespace(effectId);
        }

        $part.attr('filter', 'url(#' + effectId + ')');

        this.helpers.refreshSVG();

        setTimeout(function() {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }.bind(this), 20);
    }
};

GS.Editor.Toolbars.Shape.prototype.removeEffect = function(effect) {
    if (this.helpers.hasItemPartActive()) {
        var $part = this.helpers.getItemActivePart();
        var partId = $part.attr('data-part-id');
        var effectId = partId + '_Effect';
        var $filter = $('#' + effectId);
        var hasShadow = (typeof $part.attr('data-filter-shadow') != 'undefined') ? true : false;
        var hasGlow = (typeof $part.attr('data-filter-glow') != 'undefined') ? true : false;

        var clearShadowAttributes = function() {
            $part.removeAttr('data-filter-shadow');
            $part.removeAttr('data-filter-shadow-distance');
            $part.removeAttr('data-filter-shadow-angle');
        };

        var clearGlowAttributes = function() {
            $part.removeAttr('data-filter-glow');
            $part.removeAttr('data-filter-glow-thickness');
        };

        if (effect === 'shadow') {
            if (hasGlow === false) {
                $part.removeAttr('filter');
                clearShadowAttributes();

                $filter.remove();
            } else {
                $filter.find('[result="offsetShadow"]').remove();
                $filter.find('[in="shadow"]').remove();
                $filter.find('[result="shadow"]').remove();

                clearShadowAttributes();
            }
        }

        if (effect === 'glow') {
            if (hasShadow === false) {
                $part.removeAttr('filter');

                clearGlowAttributes();

                $filter.remove();
            } else {
                $filter.find('[result="glow"]').remove();
                $filter.find('[in="glow"]').remove();

                clearGlowAttributes();
            }
        }

        this.helpers.refreshSVG();

        setTimeout(function() {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }.bind(this), 20);
    }
};

GS.Editor.Toolbars.Shape.prototype.switchStroke = function($switchButton, state) {
    switch (state) {
        case 'off':
            $switchButton.closest('.toolbar-component__stroke').removeClass('toolbar-component__stroke--active');

            this.removeStroke();
            break;
        case 'on':
            $switchButton.closest('.toolbar-component__stroke').addClass('toolbar-component__stroke--active');

            this.addStroke();
            break;
        default:
            if (!$switchButton.closest('.toolbar-component__stroke').hasClass('toolbar-component__stroke--active')) {
                $switchButton.closest('.toolbar-component__stroke').addClass('toolbar-component__stroke--active');

                this.addStroke();
            } else {
                $switchButton.closest('.toolbar-component__stroke').removeClass('toolbar-component__stroke--active');

                this.removeStroke();
            }
            break;
    }
};

GS.Editor.Toolbars.Shape.prototype.switchShadow = function($switchButton, state) {
    var hasPartActive = this.helpers.hasItemPartActive();
    var $target = hasPartActive ? this.helpers.getActiveLogoItem().find('.' + this.config.coreClasses.logoPartActive) : this.helpers.getActiveLogoItem().find('[fill]');

    switch (state) {
        case 'off':
            $switchButton.closest('.toolbar-component__shadow').removeClass('toolbar-component__shadow--active');

            this.removeEffect('shadow');
            break;
        case 'on':
            $switchButton.closest('.toolbar-component__shadow').addClass('toolbar-component__shadow--active');

            this.addEffect('shadow');
            break;
        default:
            if (!$switchButton.closest('.toolbar-component__shadow').hasClass('toolbar-component__shadow--active')) {
                $switchButton.closest('.toolbar-component__shadow').addClass('toolbar-component__shadow--active');

                this.addEffect('shadow');
            } else {
                $switchButton.closest('.toolbar-component__shadow').removeClass('toolbar-component__shadow--active');

                this.removeEffect('shadow');
            }
            break;
    }
};

GS.Editor.Toolbars.Shape.prototype.switchGlow = function($switchButton, state) {
    var hasPartActive = this.helpers.hasItemPartActive();
    var $target = hasPartActive ? this.helpers.getActiveLogoItem().find('.' + this.config.coreClasses.logoPartActive) : this.helpers.getActiveLogoItem().find('[fill]');

    switch (state) {
        case 'off':
            $switchButton.closest('.toolbar-component__glow').removeClass('toolbar-component__glow--active');

            this.removeEffect('glow');
            break;
        case 'on':
            $switchButton.closest('.toolbar-component__glow').addClass('toolbar-component__glow--active');

            this.addEffect('glow');
            break;
        default:
            if (!$switchButton.closest('.toolbar-component__glow').hasClass('toolbar-component__glow--active')) {
                $switchButton.closest('.toolbar-component__glow').addClass('toolbar-component__glow--active');

                this.addEffect('glow');
            } else {
                $switchButton.closest('.toolbar-component__glow').removeClass('toolbar-component__glow--active');

                this.removeEffect('glow');
            }
            break;
    }
};

GS.Editor.Toolbars.Shape.prototype.switchFillMode = function($parent, state) {
    var hasPartActive = this.helpers.hasItemPartActive();
    var $target = hasPartActive ? this.helpers.getActiveLogoItem().find('.' + this.config.coreClasses.logoPartActive) : this.helpers.getActiveLogoItem().find('[fill]');
    var _updateSolidFill = function() {
        if (hasPartActive) {
            var fill = $target.attr('fill');

            if (fill.indexOf('url(') == -1) {
                fill = $target.attr('fill');
            } else {
                fill = '#666666';
            }

            $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.UpdateSolidFills, [{ type: 'Shape', parent: $parent, hex: fill }]);

            $target.attr('fill', fill);
        }
    }.bind(this);

    switch (state) {
        case 'solid':
            $parent.removeClass(this.config.coreClasses.toolbarFillGradientActive);

            _updateSolidFill();
            break;
        case 'gradient':
            $parent.addClass(this.config.coreClasses.toolbarFillGradientActive);

            this.generateGradientElement();
            break;
        default:
            if (!$parent.hasClass(this.config.coreClasses.toolbarFillGradientActive)) {
                $parent.addClass(this.config.coreClasses.toolbarFillGradientActive);

                this.generateGradientElement();
            } else {
                $parent.removeClass(this.config.coreClasses.toolbarFillGradientActive);

                _updateSolidFill();
            }
            break;
    }
};

/**
 * Switch to the target gradient picker (first/second)
 *
 * @param  {jQuery} $button The trigger button for switching gradient pickers
 * @return {Object}         Toolbars instance
 */
GS.Editor.Toolbars.Shape.prototype.switchGradientPicker = function($button) {
    var targetGradientPicker = $button.data(this.config.attributes.toolbarSwitchGradientPicker);

    $(this.config.el.toolbarComponents.fill.switchGradientPickerButton).removeClass(this.config.coreClasses.toolbarSwitchGradientPickerActive);
    $button.addClass(this.config.coreClasses.toolbarSwitchGradientPickerActive);

    $('.toolbar-component__fill--gradient').attr('data-gradient-colourpicker-active', targetGradientPicker);
};

/**
 * Core function that changes the state of toolbar component switches
 * @param  {jQuery} $switchEl   The target switch element we need to toggle/force its state
 * @param  {String} forcedState (Optional) forced state (active/inactive).
 * @return {String}             The new state of the switch
 */
GS.Editor.Toolbars.Shape.prototype.changeSwitchState = function($switchEl, forcedState) {
    var state = $switchEl.attr('data-' + this.config.attributes.toolbarComponentSwitch);
    var newState = (forcedState !== false) ? forcedState : (state === 'active') ? 'inactive' : 'active';

    $switchEl.attr('data-' + this.config.attributes.toolbarComponentSwitch, newState);

    return newState;
};

/**
 * Increase or decrease the value of a toolbar component
 *
 * @param  {jQuery} $actionEl Increase/Decrease element
 * @return {Number}           The new value of the toolbar component
 */
GS.Editor.Toolbars.Shape.prototype.changeComponentValue = function($actionEl) {
    var action = $actionEl.data(this.config.attributes.toolbarComponentValueChange);
    var componentValue = parseInt($actionEl.siblings(this.config.el.toolbarComponentValue).text(), 10);
    var componentValueMin = $actionEl.data(this.config.attributes.toolbarComponentValueMin);
    var componentValueMax = $actionEl.data(this.config.attributes.toolbarComponentValueMax);
    var newComponentValue;

    if (action === 'increase') {
        if (componentValue + 1 > componentValueMax) {
            newComponentValue = componentValueMax;
        } else {
            newComponentValue = componentValue + 1;
        }
    } else {
        if (componentValue - 1 < componentValueMin) {
            newComponentValue = componentValueMin;
        } else {
            newComponentValue = componentValue - 1;
        }
    }

    return newComponentValue;
};
;/* -----------------------------------------
    Logo Editor Toolbars module

    @todo       Fix it. :o
    @author     Konstantinos Vasileiou <kostas@neverbland.com>
    @copyrights Neverbland 2014
----------------------------------------- */

/**
 * Toolbars constructor

 * @param {Object} options   Toolbars initialization options
 * @param {Object} helpers   Editor helpers
 * @param {Object} templates Editor templates
 */
GS.Editor.Toolbars.Image = function(options, colourHistory, helpers, templates) {
    this.options = options || {};

    this.defaults = {
        el: {
            toolbarComponents: {
                effects: {
                    switchButtonShadow: '.toolbar-component__switch--shadow',
                    switchButtonGlow: '.toolbar-component__switch--glow',
                    switchButtonStroke: '.toolbar-component__switch--stroke'
                }
            },
            shadow: {
                angleValue: '.toolbar-component__value-change__value--shadow-angle',
                angleButton: '.toolbar-component__shadow__angle .toolbar-component__value-change__button',
                distanceValue: '.toolbar-component__value-change__value--shadow-distance',
                distanceButton: '.toolbar-component__shadow__distance .toolbar-component__value-change__button'
            },
            glow: {
                thicknessValue: '.toolbar-component__value-change__value--glow-thickness',
                thicknessButton: '.toolbar-component__glow__thickness .toolbar-component__value-change__button'
            },
            stroke: {
                thicknessValue: '.toolbar-component__value-change__value--stroke-thickness',
                thicknessButton: '.toolbar-component__stroke__thickness .toolbar-component__value-change__button'
            },
            colourpicker: {
                image: {
                    toolbarParent: '[data-toolbar="image"]',
                    solid: '#colourpicker--image--solid',
                    gradient: {
                        first: '#colourpicker--image--gradient--first',
                        second: '#colourpicker--image--gradient--second'
                    }
                },
                effects: {
                    glow: {
                        solid: '[data-toolbar="image"] #colourpicker--glow--solid'
                    },
                    shadow: {
                        solid: '[data-toolbar="image"] #colourpicker--shadow--solid'
                    },
                    stroke: {
                        solid: '[data-toolbar="image"] #colourpicker--stroke--solid'
                    }
                }
            }
        },
        attributes: {

        }
    };

    this.colourHistory = colourHistory;
    this.helpers = helpers;
    this.templates = templates;

    // Colourpicker instances
    this.colourpickerSolid = '';
    this.colourpickerGradientFirst = '';
    this.colourpickerGradientSecond = '';
    this.strokeColourpickerSolid = '';

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Toolbars.Image.prototype.initialize = function() {
    console.log(' ~> Initialized image toolbar');

    this.registerEvents();
};

GS.Editor.Toolbars.Image.prototype.registerEvents = function() {
    var self = this;

    this.unregisterEvents();

    $(this.config.el.colourpicker.image.toolbarParent).on('click', this.config.el.toolbarComponents.fill.switchButton, function(ev) {
        self.switchFillMode($(this).closest(self.config.el.toolbarComponents.fill.main));
    });

    // Shadow switch toggle
    $(this.config.el.colourpicker.image.toolbarParent).on('click', this.config.el.toolbarComponents.effects.switchButtonShadow, function(ev) {
        self.switchShadow($(this));
    });

    // Glow switch toggle
    $(this.config.el.colourpicker.image.toolbarParent).on('click', this.config.el.toolbarComponents.effects.switchButtonGlow, function(ev) {
        self.switchGlow($(this));
    });

    // Stroke switch toggle
    $(this.config.el.colourpicker.image.toolbarParent).on('click', this.config.el.toolbarComponents.effects.switchButtonStroke, function(ev) {
        self.switchStroke($(this));
    });

    // Stroke width value change
    $(this.config.el.colourpicker.image.toolbarParent).on('click', this.config.el.stroke.thicknessButton, function(ev) {
        self.changeStrokeThickness(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    // Glow thickness value change
    $(this.config.el.colourpicker.image.toolbarParent).on('click', this.config.el.glow.thicknessButton, function(ev) {
        self.changeGlowThickness(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    // Shadow distance value change
    $(this.config.el.colourpicker.image.toolbarParent).on('click', this.config.el.shadow.distanceButton, function(ev) {
        self.changeShadowDistance(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    // Shadow angle value change
    $(this.config.el.colourpicker.image.toolbarParent).on('click', this.config.el.shadow.angleButton, function(ev) {
        self.changeShadowAngle(self.changeComponentValue($(this)));

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    $(this.config.el.colourpicker.image.toolbarParent).on('click', this.config.el.toolbarComponents.fill.switchGradientPickerButton, function(ev) {
        self.switchGradientPicker($(this));
    });
};

GS.Editor.Toolbars.Image.prototype.unregisterEvents = function() {
    $(this.config.el.colourpicker.image.toolbarParent).off('click');
    $(this.config.el.toolbarComponent).off(GS.Editor.Events.Toolbars.UpdatePickers);
};

/**
 * Preparing the toolbar by fetching and appending the template, then
 * populating the right data based on the selected/active image item.
 * Also, we're initializing the coloupicker. Amazing stuff!
 *
 * @param  {String} toolbarType Specifiying the type of toolbar (Text/Image/Shape/etc)
 * @return {Object}             Toolbars instance
 */
GS.Editor.Toolbars.Image.prototype.prepareImageToolbar = function(toolbarType) {
    var self = this;
    var hasPartActive = this.helpers.hasItemPartActive();
    var $toolbarParent = $(this.config.el.colourpicker.image.toolbarParent);
    var $target = hasPartActive ? this.helpers.getActiveLogoItem().find('.' + this.config.coreClasses.logoPartActive) : this.helpers.getActiveLogoItem().find('[fill]');
    var fill = $($target[0]).attr('fill');

    var $el;

    // Initializing the colourpickers
    this.colourpickerSolid = self.helpers.createColorPicker(this.config.el.colourpicker.image.solid, function (hex, hsv, rgb) {
        $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.UpdateSolidFills, [{
            type: toolbarType,
            parent: $toolbarParent,
            hex: hex
        }]);

        var hasPartActive = this.helpers.hasItemPartActive();
        var $colourTarget = hasPartActive
            ? this.helpers.getActiveLogoItem().find('.' + this.config.coreClasses.logoPartActive)
            : this.helpers.getActiveLogoItem().find('[fill]')
            ;

        // Do _not_ use $target here. It may no longer be valid after glow/shadow changes
        $colourTarget .attr('fill', hex);
    }.bind(this));

    this.colourpickerGradientFirst = self.helpers.createColorPicker(this.config.el.colourpicker.image.gradient.first, function (hex, hsv, rgb) {
        var partFill = this.helpers.getItemActivePart().attr('fill');
        var $gradientStops = $(this.helpers.getGradientIdFromPath(partFill)).find('stop');
        var hexSecond = $(this.config.el.colourpicker[toolbarType].toolbarParent).find(this.config.el.toolbarComponents.fill.gradient.value.second).text();

        $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.UpdateGradientFills, [{
            type: toolbarType,
            parent: $toolbarParent,
            hexFirst: hex,
            hexSecond: hexSecond
        }]);

        $gradientStops[0].setAttribute('style', 'stop-color:' + hex);
    }.bind(this));

    this.colourpickerGradientSecond = self.helpers.createColorPicker(this.config.el.colourpicker.image.gradient.second, function (hex, hsv, rgb) {
        var partFill = this.helpers.getItemActivePart().attr('fill');
        var $gradientStops = $(this.helpers.getGradientIdFromPath(partFill)).find('stop');
        var hexFirst = $(this.config.el.colourpicker[toolbarType].toolbarParent).find(this.config.el.toolbarComponents.fill.gradient.value.first).text();

        $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.UpdateGradientFills, [{
            type: toolbarType,
            parent: $toolbarParent,
            hexFirst: hexFirst,
            hexSecond: hex
        }]);

        $gradientStops[1].setAttribute('style', 'stop-color:' + hex);
    }.bind(this));

    // Initializing the stroke colourpicker
    this.strokeColourpickerSolid = self.helpers.createColorPicker(this.config.el.colourpicker.effects.stroke.solid, function (hex, hsv, rgb) {
        var targetHex = this.helpers.getItemActivePart().attr('stroke', hex);
    }.bind(this));

    // Updating the colourpicker with the item's fill
    // Is it a gradient fill?
    if (hasPartActive) {
        var $part = this.helpers.getItemActivePart();
        var stroke = $part.attr('stroke');
        var strokeWidth = $part.attr('stroke-width');

        var hasShadow = (typeof $part.attr('data-filter-shadow') != 'undefined') ? true : false;
        var hasGlow = (typeof $part.attr('data-filter-glow') != 'undefined') ? true : false;
        var hasStroke = (typeof $part.attr('stroke') != 'undefined') ? true : false;

        $('.toolbar-component-group--effects').addClass('toolbar-component-group--effects--active');

        if (hasShadow) {
            var shadowAngle = $part.attr('data-filter-shadow-angle');
            var shadowDistance = $part.attr('data-filter-shadow-distance');

            $('.toolbar-component__shadow').addClass('toolbar-component__shadow--active');

            $(this.config.el.shadow.angleValue).text(shadowAngle);
            $(this.config.el.shadow.distanceValue).text(shadowDistance);

            this.changeShadowAngle(shadowAngle);
            this.changeShadowDistance(shadowDistance);
        } else {
            $('.toolbar-component__shadow').removeClass('toolbar-component__shadow--active');

            $(this.config.el.shadow.angleValue).text('0');
            $(this.config.el.shadow.distanceValue).text('0');
        }

        if (hasGlow) {
            var glowThickness = $part.attr('data-filter-glow-thickness');

            $('.toolbar-component__glow').addClass('toolbar-component__glow--active');

            $(this.config.el.glow.thicknessValue).text(glowThickness);

            this.changeGlowThickness(glowThickness);
        } else {
            $('.toolbar-component__glow').removeClass('toolbar-component__glow--active');

            $(this.config.el.glow.thicknessValue).text('1');
        }

        if (hasStroke) {
            var stroke = $part.attr('stroke');
            var strokeWidth = $part.attr('stroke-width');

            $('.toolbar-component__stroke').addClass('toolbar-component__stroke--active');
            $(this.config.el.stroke.thicknessValue).text(stroke);

            this.changeStrokeThickness(strokeWidth);
            this.strokeColourpickerSolid.setHex(stroke);
        } else {
            $('.toolbar-component__stroke').removeClass('toolbar-component__stroke--active');
            $(this.config.el.stroke.thicknessValue).text('1');
        }

        $toolbarParent
            .find(this.config.el.toolbarComponents.switchButton)
                .removeClass(this.config.coreClasses.toolbarComponentSwitchDisabled);

        // Updating the colourpicker with the item's fill
        // Is it a gradient fill?
        if (fill.indexOf('url(') == 0) {
            // Does it have the gradient of its part id ...
            if (fill === 'url(#' + $target.attr('data-part-id') + ')') {
                var $gradient = $(this.helpers.getGradientIdFromPath(fill));
                var gradientFills = this.helpers.getGradientsFromGradientStyleElement($gradient);

                this.colourpickerGradientFirst.setHex(gradientFills.first);
                this.colourpickerGradientSecond.setHex(gradientFills.second);
                this.switchFillMode($toolbarParent.find(this.config.el.toolbarComponents.fill.main), 'gradient');
            // ... or a custom one?
            } else {
                this.switchFillMode($toolbarParent.find(this.config.el.toolbarComponents.fill.main), 'solid');
            }
        // or a solid fill?
        } else {
            this.switchFillMode($toolbarParent.find(this.config.el.toolbarComponents.fill.main), 'solid');
            this.colourpickerSolid.setHex(fill);
        }
    } else {
        $('.toolbar-component-group--effects').removeClass('toolbar-component-group--effects--active');

        this.switchFillMode($toolbarParent.find(this.config.el.toolbarComponents.fill.main), 'solid');

        $toolbarParent
            .find(this.config.el.toolbarComponents.switchButton)
                .addClass(this.config.coreClasses.toolbarComponentSwitchDisabled);
    }

    // Registering click event for clicking on Colour Matching/History circles
    $toolbarParent.on('click', '[data-' + this.config.attributes.toolbarChangeFillTrigger + ']', function() {
        var $trigger = $(this);
        var targetHex = $trigger.attr('data-' + self.config.attributes.toolbarChangeFillTrigger);
        var target = $trigger.data('fill-target');

        if ($trigger.closest('.toolbar-component__fill--gradient').length !== 0) {
            target = 'gradient';
        }

        if ($trigger.hasClass(self.helpers.getRawName(self.config.el.toolbarComponents.fill.matchItem))) {
            $(self.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: targetHex }]);
        }

        switch (target) {
            case 'stroke':
                self.strokeColourpickerSolid.setHex(targetHex);
                break;

            case 'gradient':
                if ($trigger.closest('.toolbar-component__fill--gradient').attr('data-gradient-colourpicker-active') === 'first') {
                    self.colourpickerGradientFirst.setHex(targetHex);
                } else {
                    self.colourpickerGradientSecond.setHex(targetHex)
                }
                break;

            default:
                self.colourpickerSolid.setHex(targetHex);
                break;
        }
    });

    // Contenteditable updates
    $(this.config.el.toolbarComponent).on(GS.Editor.Events.Toolbars.UpdatePickers, function(ev, $source) {
        var $component = $(this);
        var type = $component.data('toolbar-component');
        var value = $source.text();
        var mapping = {};

        if ($source.is(self.config.el.toolbarComponents.fill.solid.value)) {
            self.colourpickerSolid.setHex('#' + value);

            $(self.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: '#' + value }]);
        }

        if ($source.is(self.config.el.toolbarComponents.fill.gradient.value.first)) {
            self.colourpickerGradientFirst.setHex('#' + value);
            $(self.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: '#' + value }]);
        }

        if ($source.is(self.config.el.toolbarComponents.fill.gradient.value.second)) {
            self.colourpickerGradientSecond.setHex('#' + value);
            $(self.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [{ hex: '#' + value }]);
        }

        mapping[self.config.el.stroke.thicknessValue] = 'changeStrokeThickness';
        mapping[self.config.el.shadow.angleValue] = 'changeShadowAngle';
        mapping[self.config.el.shadow.distanceValue] = 'changeShadowDistance';
        mapping[self.config.el.glow.thicknessValue] = 'changeGlowThickness';

        $.each(mapping, function(className, method) {
            if ($source.is(className)) {
                self[method](parseInt(value, 10));
            }
        });

        setTimeout(function() {
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }, 0);
    });

    return this;
};

/**
 * Sets the new stroke thickness value to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Image.prototype.changeStrokeThickness = function(value) {
    var $part = this.helpers.getItemActivePart();

    $(this.config.el.stroke.thicknessValue).text(value);

    $part.attr('stroke-width', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Sets the new glow thickness value to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Image.prototype.changeGlowThickness = function(value) {
    var $part = this.helpers.getItemActivePart();
    var $glowEffect = $('#' + $part.attr('data-part-id') + '_Effect').find('[result="glow"]');

    $(this.config.el.glow.thicknessValue).text(value);

    $glowEffect[0].setAttribute('stdDeviation', value);

    $part.attr('data-filter-glow-thickness', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Sets the new shadow distance value to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Image.prototype.changeShadowDistance = function(value) {
    var $part = this.helpers.getItemActivePart();
    var $shadowEffect = $('#' + $part.attr('data-part-id') + '_Effect').find('[result="offsetShadow"]');
    var angle = parseInt($('[data-toolbar="image"]').find(this.config.el.shadow.angleValue).text(), 10);
    var finalValue = this.helpers.getPointFromDistanceAndAngle(value, angle);

    $(this.config.el.shadow.distanceValue).text(value);

    $shadowEffect[0].setAttribute('dx', finalValue.x);
    $shadowEffect[0].setAttribute('dy', finalValue.y);

    $part.attr('data-filter-shadow-distance', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Sets the new shadow distance angle to the active logo part item
 *
 * @param  {Number} value The target value number to set
 */
GS.Editor.Toolbars.Image.prototype.changeShadowAngle = function(value) {
    var $part = this.helpers.getItemActivePart();
    var $shadowEffect = $('#' + $part.attr('data-part-id') + '_Effect').find('[result="offsetShadow"]');
    var distance = parseInt($('[data-toolbar="image"]').find(this.config.el.shadow.distanceValue).text(), 10);
    var finalValue = this.helpers.getPointFromDistanceAndAngle(distance, value);

    $(this.config.el.shadow.angleValue).text(value);

    $shadowEffect[0].setAttribute('dx', finalValue.x);
    $shadowEffect[0].setAttribute('dy', finalValue.y);

    $part.attr('data-filter-shadow-angle', value);

    $(this.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
};

/**
 * Generate a gradient element. Nice. Like it needed an explanation.
 *
 * @todo It should accept a prefix (+ index?) for a name
 */
GS.Editor.Toolbars.Image.prototype.generateGradientElement = function() {
    if (this.helpers.hasItemPartActive()) {
        var $part = this.helpers.getItemActivePart();
        var partId = $part.attr('data-part-id');
        var fill = $part.attr('fill');
        var index = $part.index();
        var $linearGradient;

        if (fill.indexOf('url(') == -1) {
            if ($('#' + partId).length == 0) {
                $linearGradient = $('<linearGradient id="' + partId + '" gradientUnits="objectBoundingBox" x1="0.5" y1="0" x2="0.5" y2="1">' +
                                        '<stop offset="0" style="stop-color:#333333"></stop>' +
                                        '<stop offset="1" style="stop-color:#999999"></stop>' +
                                    '</linearGradient>');
                $linearGradient.insertBefore($part);

                this.helpers.fixSvgNamespace(partId);
            }

            $part.attr('fill', 'url(#' + partId + ')');

            this.colourpickerGradientFirst.setHex('#333333');
            this.colourpickerGradientSecond.setHex('#999999');

            this.helpers.refreshSVG();
        } else {
            // einai to url idio me to part id?
            if (fill === 'url(#' + partId + ')') {
                var $gradient = $(this.helpers.getGradientIdFromPath(fill));
                var gradientFills = this.helpers.getGradientsFromGradientStyleElement($gradient);

                this.colourpickerGradientFirst.setHex(gradientFills.first);
                this.colourpickerGradientSecond.setHex(gradientFills.second);
            // an den einai to url idio me to part id
            } else {
                $linearGradient = $('<linearGradient id="' + partId + '" gradientUnits="objectBoundingBox" x1="0.5" y1="0" x2="0.5" y2="1">' +
                                        '<stop offset="0" style="stop-color:#333333"></stop>' +
                                        '<stop offset="1" style="stop-color:#999999"></stop>' +
                                    '</linearGradient>');
                $linearGradient.insertBefore($part);

                this.helpers.fixSvgNamespace(partId);

                $part.attr('fill', 'url(#' + partId + ')');

                this.colourpickerGradientFirst.setHex('#333333');
                this.colourpickerGradientSecond.setHex('#999999');

                this.helpers.refreshSVG();
            }
        }
    }
};

GS.Editor.Toolbars.Image.prototype.addStroke = function() {
    if (this.helpers.hasItemPartActive()) {
        var $part = this.helpers.getItemActivePart();

        $part.attr('vector-effect', 'non-scaling-stroke');
        $part.attr('stroke', '#000000');
        $part.attr('stroke-width', 1);

        setTimeout(function() {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }.bind(this), 0);
    }
};

GS.Editor.Toolbars.Image.prototype.removeStroke = function() {
    if (this.helpers.hasItemPartActive()) {
        var $part = this.helpers.getItemActivePart();

        $part.removeAttr('vector-effect');
        $part.removeAttr('stroke');
        $part.removeAttr('stroke-width');

        setTimeout(function() {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }.bind(this), 0);
    }
};

// 1) set filter on
// 2) check if filter exists
//   - Exists -> read values on $part -> recreate filter -> assign filter to $part
//   - Doesn’t Exist -> create initial values of $part element -> create filter -> assign filter to $part
GS.Editor.Toolbars.Image.prototype.addEffect = function(effect) {
    if (this.helpers.hasItemPartActive()) {
        var $part = this.helpers.getItemActivePart();
        var partId = $part.attr('data-part-id');
        var effectId = partId + '_Effect';
        var filterHtml = '<filter id="' + effectId + '" x="-100%" y="-100%" width="300%" height="300%">' +
            '<feMerge>' +
                '<feMergeNode in="SourceGraphic" />' +
            '</feMerge>' +
        '</filter>';

        var shadowData = {
            filterHtml: '<feOffset in="SourceAlpha" dx="0" dy="0" result="offsetShadow" />' +
                        '<feGaussianBlur in="offsetShadow" stdDeviation="7" result="shadow" />',
            mergeHtml: '<feMergeNode in="shadow" />'
        };

        var glowData = {
            filterHtml: '<feGaussianBlur in="SourceGraphic" stdDeviation="1" result="glow" />',
            mergeHtml: '<feMergeNode in="glow" />'
        };

        var addShadow = function($filter) {
            $filter.prepend(shadowData.filterHtml);
            $filter.find('feMerge').prepend(shadowData.mergeHtml);

            $part.attr('data-filter-shadow', '');
            $part.attr('data-filter-shadow-distance', 0);
            $part.attr('data-filter-shadow-angle', 45);
        };

        var addGlow = function($filter) {
            $filter.prepend(glowData.filterHtml);
            $filter.find('feMerge').prepend(glowData.mergeHtml);

            $part.attr('data-filter-glow', '');
            $part.attr('data-filter-glow-thickness', 1);
        };

        var $filter = $('#' + effectId);
        if ($filter.length == 0) {
            var $newFilter = $(filterHtml);

            switch(effect) {
                case 'shadow':
                    addShadow($newFilter);
                    setTimeout(function() {
                        this.changeShadowAngle(45);
                        this.changeShadowDistance(0);
                    }.bind(this), 20);
                    break;
                case 'glow':
                    addGlow($newFilter);
                    break;
            }

            $newFilter.insertBefore($part);

            this.helpers.fixSvgNamespace(effectId);
        } else {
            // Here we do checks to see what filters are active and what are not,
            // then add accordingly
            var hasShadow = (typeof $part.attr('data-filter-shadow') != 'undefined') ? true : false;
            var hasGlow = (typeof $part.attr('data-filter-glow') != 'undefined') ? true : false;

            if (hasShadow === true && effect === 'glow') {
                addGlow($filter);
            }

            if (hasGlow === true && effect === 'shadow') {
                addShadow($filter);
            }

            // Stupid fix for safari and firefox to show effects/gradients
            $body.append('<svg id="dummy" style="display:none"><defs>' + $filter.clone().wrap('<p>').parent().html() + '</defs></svg>');
            $('.canvas #' + effectId).replaceWith($('#dummy #' + effectId));
            $('#dummy').remove();
        }

        $part.attr('filter', 'url(#' + effectId + ')');

        this.helpers.refreshSVG();

        setTimeout(function() {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }.bind(this), 20);
    }
};

GS.Editor.Toolbars.Image.prototype.removeEffect = function(effect) {
    if (this.helpers.hasItemPartActive()) {
        var $part = this.helpers.getItemActivePart();
        var partId = $part.attr('data-part-id');
        var effectId = partId + '_Effect';
        var $filter = $('#' + effectId);
        var hasShadow = (typeof $part.attr('data-filter-shadow') != 'undefined') ? true : false;
        var hasGlow = (typeof $part.attr('data-filter-glow') != 'undefined') ? true : false;

        var clearShadowAttributes = function() {
            $part.removeAttr('data-filter-shadow');
            $part.removeAttr('data-filter-shadow-distance');
            $part.removeAttr('data-filter-shadow-angle');
        };

        var clearGlowAttributes = function() {
            $part.removeAttr('data-filter-glow');
            $part.removeAttr('data-filter-glow-thickness');
        };

        if (effect === 'shadow') {
            if (hasGlow === false) {
                $part.removeAttr('filter');
                clearShadowAttributes();

                $filter.remove();
            } else {
                $filter.find('[result="offsetShadow"]').remove();
                $filter.find('[in="shadow"]').remove();
                $filter.find('[result="shadow"]').remove();

                clearShadowAttributes();
            }
        }

        if (effect === 'glow') {
            if (hasShadow === false) {
                $part.removeAttr('filter');

                clearGlowAttributes();

                $filter.remove();
            } else {
                $filter.find('[result="glow"]').remove();
                $filter.find('[in="glow"]').remove();

                clearGlowAttributes();
            }
        }

        this.helpers.refreshSVG();

        setTimeout(function() {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }.bind(this), 20);
    }
};

GS.Editor.Toolbars.Image.prototype.switchStroke = function($switchButton, state) {
    switch (state) {
        case 'off':
            $switchButton.closest('.toolbar-component__stroke').removeClass('toolbar-component__stroke--active');

            this.removeStroke();
            break;
        case 'on':
            $switchButton.closest('.toolbar-component__stroke').addClass('toolbar-component__stroke--active');

            this.addStroke();
            break;
        default:
            if (!$switchButton.closest('.toolbar-component__stroke').hasClass('toolbar-component__stroke--active')) {
                $switchButton.closest('.toolbar-component__stroke').addClass('toolbar-component__stroke--active');

                this.addStroke();
            } else {
                $switchButton.closest('.toolbar-component__stroke').removeClass('toolbar-component__stroke--active');

                this.removeStroke();
            }
            break;
    }
};

GS.Editor.Toolbars.Image.prototype.switchShadow = function($switchButton, state) {
    var hasPartActive = this.helpers.hasItemPartActive();
    var $target = hasPartActive ? this.helpers.getActiveLogoItem().find('.' + this.config.coreClasses.logoPartActive) : this.helpers.getActiveLogoItem().find('[fill]');

    switch (state) {
        case 'off':
            $switchButton.closest('.toolbar-component__shadow').removeClass('toolbar-component__shadow--active');

            this.removeEffect('shadow');
            break;
        case 'on':
            $switchButton.closest('.toolbar-component__shadow').addClass('toolbar-component__shadow--active');

            this.addEffect('shadow');
            break;
        default:
            if (!$switchButton.closest('.toolbar-component__shadow').hasClass('toolbar-component__shadow--active')) {
                $switchButton.closest('.toolbar-component__shadow').addClass('toolbar-component__shadow--active');

                this.addEffect('shadow');
            } else {
                $switchButton.closest('.toolbar-component__shadow').removeClass('toolbar-component__shadow--active');

                this.removeEffect('shadow');
            }
            break;
    }
};

GS.Editor.Toolbars.Image.prototype.switchGlow = function($switchButton, state) {
    var hasPartActive = this.helpers.hasItemPartActive();
    var $target = hasPartActive ? this.helpers.getActiveLogoItem().find('.' + this.config.coreClasses.logoPartActive) : this.helpers.getActiveLogoItem().find('[fill]');

    switch (state) {
        case 'off':
            $switchButton.closest('.toolbar-component__glow').removeClass('toolbar-component__glow--active');

            this.removeEffect('glow');
            break;
        case 'on':
            $switchButton.closest('.toolbar-component__glow').addClass('toolbar-component__glow--active');

            this.addEffect('glow');
            break;
        default:
            if (!$switchButton.closest('.toolbar-component__glow').hasClass('toolbar-component__glow--active')) {
                $switchButton.closest('.toolbar-component__glow').addClass('toolbar-component__glow--active');

                this.addEffect('glow');
            } else {
                $switchButton.closest('.toolbar-component__glow').removeClass('toolbar-component__glow--active');

                this.removeEffect('glow');
            }
            break;
    }
};

GS.Editor.Toolbars.Image.prototype.switchFillMode = function($parent, state) {
    var hasPartActive = this.helpers.hasItemPartActive();
    var $target = hasPartActive ? this.helpers.getActiveLogoItem().find('.' + this.config.coreClasses.logoPartActive) : this.helpers.getActiveLogoItem().find('[fill]');
    var _updateSolidFill = function() {
        if (hasPartActive) {
            var fill = $target.attr('fill');

            if (fill !== 'url(#' + $target.attr('data-part-id')) {
                if (fill.indexOf('url(') == -1) {
                    fill = $target.attr('fill');
                } else {
                    fill = '#666666'
                }
            } else {
                $target.attr('fill', fill);
            }

            $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.UpdateSolidFills, [{ type: 'Image', parent: $parent, hex: fill }]);
        }
    }.bind(this);

    switch (state) {
        case 'solid':
            $parent.removeClass(this.config.coreClasses.toolbarFillGradientActive);

            _updateSolidFill();
            break;
        case 'gradient':
            $parent.addClass(this.config.coreClasses.toolbarFillGradientActive);

            this.generateGradientElement();
            break;
        default:
            if (!$parent.hasClass(this.config.coreClasses.toolbarFillGradientActive)) {
                $parent.addClass(this.config.coreClasses.toolbarFillGradientActive);

                this.generateGradientElement();
            } else {
                $parent.removeClass(this.config.coreClasses.toolbarFillGradientActive);

                _updateSolidFill();
            }
            break;
    }
};

/**
 * Switch to the target gradient picker (first/second)
 *
 * @param  {jQuery} $button The trigger button for switching gradient pickers
 * @return {Object}         Toolbars instance
 */
GS.Editor.Toolbars.Image.prototype.switchGradientPicker = function($button) {
    var targetGradientPicker = $button.data(this.config.attributes.toolbarSwitchGradientPicker);

    $(this.config.el.toolbarComponents.fill.switchGradientPickerButton).removeClass(this.config.coreClasses.toolbarSwitchGradientPickerActive);
    $button.addClass(this.config.coreClasses.toolbarSwitchGradientPickerActive);

    $('.toolbar-component__fill--gradient').attr('data-gradient-colourpicker-active', targetGradientPicker);
};

/**
 * Core function that changes the state of toolbar component switches
 * @param  {jQuery} $switchEl   The target switch element we need to toggle/force its state
 * @param  {String} forcedState (Optional) forced state (active/inactive).
 * @return {String}             The new state of the switch
 */
GS.Editor.Toolbars.Image.prototype.changeSwitchState = function($switchEl, forcedState) {
    var state = $switchEl.attr('data-' + this.config.attributes.toolbarComponentSwitch);
    var newState = (forcedState !== false) ? forcedState : (state === 'active') ? 'inactive' : 'active';

    $switchEl.attr('data-' + this.config.attributes.toolbarComponentSwitch, newState);

    return newState;
};

/**
 * Increase or decrease the value of a toolbar component
 *
 * @param  {jQuery} $actionEl Increase/Decrease element
 * @return {Number}           The new value of the toolbar component
 */
GS.Editor.Toolbars.Image.prototype.changeComponentValue = function($actionEl) {
    var action = $actionEl.data(this.config.attributes.toolbarComponentValueChange);
    var componentValue = parseInt($actionEl.siblings(this.config.el.toolbarComponentValue).text(), 10);
    var componentValueMin = $actionEl.data(this.config.attributes.toolbarComponentValueMin);
    var componentValueMax = $actionEl.data(this.config.attributes.toolbarComponentValueMax);
    var newComponentValue;

    if (action === 'increase') {
        if (componentValue + 1 > componentValueMax) {
            newComponentValue = componentValueMax;
        } else {
            newComponentValue = componentValue + 1;
        }
    } else {
        if (componentValue - 1 < componentValueMin) {
            newComponentValue = componentValueMin;
        } else {
            newComponentValue = componentValue - 1;
        }
    }

    return newComponentValue;
};
;/* -----------------------------------------
    Logo Editor Payment module

    @author Konstantinos Vasileiou <kostas@neverbland.com>
    @copyrights Neverbland 2014
----------------------------------------- */

/**
 * Login constructor
 * Didn't steal this from Payment at all. Nuh-uh.
 *
 * @param {Object} options Payment initialization options
 * @param {GS.Editor.Helpers} helpers Editor helpers
 * @param {GS.Editor.Templates} templates Editor templates
 * @param {GS.Editor.Core} core Editor core
 */
GS.Editor.Login = function(options, helpers, templates, core) {
    this.options = options || {};

    this.defaults = {
        el: {
            login: '.login',
            loginFormTab: '.login__tab',
            loginFormLogin: '.login__form--login',
            loginFormRegister: '.login__form--register',
            loginInputs: {
                username: '#user_login_username',
                password: '#user_login_password'
            },
            registerInputs: {
                email: '#user_email',
                password: '#user_password',
                passwordCopy: '#user_password_copy'
            },
            formErrors: '.form-item__message',
            formErrorsGlobal: '.form-item__message__global',
            actionButtons: {
                submit: '.login__button--submit'
            }
        },
        coreClasses: {
            loginActive: 'login--active',
            loginFormActive: 'login__form--active',
            loginFormTabActive: 'login__tab--active',
            loginFormErrorsActive: 'form-item__message--active'
        },
        attributes: {
            loginFormType: 'login-form-type'
        },
        settings: {
            loginUrl: '/auth/login',
            registerUrl: '/account/register',
            loginTemplateUrl: '/builder/payment-login'
        }
    };

    this.helpers = helpers;
    this.templates = templates;
    this.core = core;

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Login.prototype.initialize = function() {
    console.log('> Initialized Login module');

    this.registerEvents();
};

GS.Editor.Login.prototype.registerEvents = function() {
    var self = this;

    $(self.config.el.sidebar).on(GS.Editor.Events.Sidebar.Navigated, function () {
        $(self.config.el.login).removeClass(self.config.coreClasses.loginActive);
    });

    $(this.config.el.editor).on(GS.Editor.Events.Login.LoginOrRegister, function(ev, data) {
        if (self.helpers.isLoggedIn() !== true) {
            var cb = {};

            if (data && data.cb) {
                cb = data.cb;
            }

            self.doLoginRegister(cb);
        } else if ($(self.config.el.login).hasClass(self.config.coreClasses.loginActive)) {
            return false;
        }

        return true;
    });

    // Login/Register Tabs
    $body.on('click', this.config.el.loginFormTab, function(ev) {
        var $this = $(this);

        $this.removeClass(self.config.coreClasses.loginFormTabActive);
        $(self.config.el.loginFormTab).not($this).addClass(self.config.coreClasses.loginFormTabActive);

        // $(self.config.el.loginFormTab).removeClass(self.config.coreClasses.loginFormTabActive);
        // $this.addClass(self.config.coreClasses.loginFormTabActive);

        if ($this.data(self.config.attributes.loginFormType) === "register") {
            $(self.config.el.loginFormLogin).removeClass(self.config.coreClasses.loginFormActive);
            $(self.config.el.loginFormRegister).addClass(self.config.coreClasses.loginFormActive);
        } else {
            $(self.config.el.loginFormLogin).addClass(self.config.coreClasses.loginFormActive);
            $(self.config.el.loginFormRegister).removeClass(self.config.coreClasses.loginFormActive);
        }

        return false;
    });

    // Submit button event (login/register)
    // $body.on('click', this.config.el.actionButtons.submit, function() {
    //     self.doLoginRegister();
    // });
};

GS.Editor.Login.prototype.renderLoginTemplate = function() {
    $.get(this.config.settings.loginTemplateUrl, function(data) {}).done(function(data) {
        $(this.config.el.login).html(data);
        $(this.config.el.login).addClass(this.config.coreClasses.loginActive);
        this.helpers.submitGaEvent(GS.Editor.Events.GA.Signup);
    }.bind(this));
};

GS.Editor.Login.prototype.doClose = function(event) {
    // Remove active class
    $(this.config.el.login).removeClass(this.config.coreClasses.loginActive);

    if (!!event) {
        $(this.config.el.editor).trigger(event);
    }
};

GS.Editor.Login.prototype.doLoginRegister = function(cb) {
    cb = cb || {};
    var self = this;
    var $activeTab = $('.' + this.config.coreClasses.loginFormTabActive);
    var $activeForm = $('.' + this.config.coreClasses.loginFormActive);
    var isLogin = ($activeTab.data(this.config.attributes.loginFormType) === 'register');
    var email, username, password;

    // Clear errors on submit
    $(this.config.el.formErrors)
        .html('')
        .removeClass(this.config.coreClasses.loginFormErrorsActive);

    var handleErrors = function(errors) {
        if ($.isArray(errors)) {
            $activeForm
                .find(self.config.el.formErrorsGlobal)
                .html('<p>' + errors.join('</p><p>') + '</p>')
                .addClass(self.config.coreClasses.loginFormErrorsActive);
        } else if ($.isPlainObject(errors)) {
            $.each(errors, function(id, messages) {
                $('#' + id, $activeForm)
                    .siblings(self.config.el.formErrors)
                    .html('<p>' + messages.join('</p><p>') + '</p>')
                    .addClass(self.config.coreClasses.loginFormErrorsActive)
            });
        }
    };

    if (isLogin === true) {
        username = $(this.config.el.loginInputs.username).val();
        password = $(this.config.el.loginInputs.password).val();

        $.post(this.config.settings.loginUrl, {
            user: {
                username: username,
                password: password
            }
        }).done(function(data) {
            if (data.success === true) {
                console.log('>> User logged in: #' + (data.user_id || '0') + ' <' + (data.email || '') + '>');

                this.helpers.submitGaEvent(GS.Editor.Events.GA.Login);
                this.doClose(GS.Editor.Events.Login.LoggedIn);

                if (typeof cb === 'function') {
                    cb();
                }
            } else {
                $(this.config.el.loginInputs.username).prop('value', '');
                $(this.config.el.loginInputs.password).prop('value', '');

                if (!!data.data.errors) {
                    handleErrors(data.data.errors);
                }
            }
        }.bind(this));
    } else {
        email = $(this.config.el.registerInputs.email).val();
        password = $(this.config.el.registerInputs.password).val();
        var passwordCopy = $(this.config.el.registerInputs.passwordCopy).val();
        var clearInputs = function() {
            $(this.config.el.registerInputs.email).prop('value', '');
            $(this.config.el.registerInputs.password).prop('value', '');
            $(this.config.el.registerInputs.passwordCopy).prop('value', '');
        }.bind(this);

        if (password !== passwordCopy) {
            $(this.config.el.registerInputs.passwordCopy, $activeForm)
                .siblings(self.config.el.formErrors)
                .html('<p>The passwords don\'t match</p>')
                .addClass(self.config.coreClasses.loginFormErrorsActive);

            return false;
        }

        $.post(this.config.settings.registerUrl, {
            user: {
                email: email,
                password: password
            }
        }).done(function(data) {
            if (data.success === true) {
                console.log('!!! User registered');

                this.helpers.submitGaEvent(GS.Editor.Events.GA.Signup);
                $(this.config.el.editor).trigger(GS.Editor.Events.Login.Registered);

                $.post(this.config.settings.loginUrl, {
                    'user[username]': email,
                    'user[password]': password
                }).done(function(data) {
                    console.log('>> User registered: ' + email);
                    console.log('>> User logged in: #' + (data.user_id || '0') + ' <' + email + '>');

                    this.helpers.submitGaEvent(GS.Editor.Events.GA.Login);
                    this.doClose(GS.Editor.Events.Login.LoggedIn);

                    if (typeof cb === 'function') {
                        cb();
                    }
                }.bind(this));
            } else {
                if (!!data.data.errors) {
                    handleErrors(data.data.errors);
                }
            }
        }.bind(this));
    }

    return true;
};
;/* -----------------------------------------
 Logo Editor Payment module

 @author Konstantinos Vasileiou <kostas@neverbland.com>
 @copyrights Neverbland 2014
 ----------------------------------------- */

/**
 * Payment constructor

 * @param {Object} options Payment initialization options
 * @param {Object} helpers Editor helpers
 */
GS.Editor.Payment = function (options, helpers, templates, core) {
    this.options = options || {};

    this.helpers = helpers;
    this.templates = templates;
    this.core = core;

    var isPhone = this.helpers.isDevice('phone');

    this.defaults = {
        el: {
            payment: '.payment',
            stagesOuter: '.payment__stage__outer',
            paymentForm: '[data-payment-form]',
            allFormElements: '[data-payment-form] input, [data-payment-form] select',
            loginInputs: {
                username: '#user_login_username',
                password: '#user_login_password'
            },
            formErrors: '.form-item__message',
            formErrorsGlobal: '.form-item__message__global',
            download: '.download',
            downloadButton: '.download__button',
            discountCode: '.payment__discount-code',
            discountCodeButton: '.payment__discount-code__button',
            licenseButton: '.licence-button',
            paymentCardTypeDropdown: '[data-creditCardType-dropdown]',
            paymentCardType: {
                methods: '[data-payment-method]',
                dropdown: '[data-payment-method-dropdown]'
            },
            paymentCcWrapper: '.payment__cc-payment-wrapper',
            actionButtons: {
                submit: '.payment__button--submit',
                proceedToPay: '.payment__button--proceed-to-pay',
                pay: '#DoDirectPaymentBtn'
            },
            paymentSection: {
                details: '.payment__section__details',
                upsell: '.payment__section__upsell',
                upsellButton: '.payment__section__upsell__submit',
                upsellLabel: '.payment__upsell__label'
            }
        },
        coreClasses: {
            paymentActive: 'payment--active',
            paymentCheckoutActive: 'payment-checkout--active',
            paymentCardTypeActive: 'payment__card-type--active',
            paymentCcWrapperDisabled: 'payment__cc-payment-wrapper--disabled',
            licenseSelected: 'licence-button--selected',
            licenseDisabled: 'licence-button--disabled',
            downloadActive: 'download--active',
            downloadReady: 'download--ready',
            paymentFormErrorsActive: 'form-item__message--active',
            paymentSectionVisible: 'payment__section--visible',
            paymentCardTypes: 'payment__section__details__cards',
            paymentCardTypesHidden: 'payment__section__details__cards--hidden'
        },
        attributes: {
            paymentCardType: 'payment-method',
            paymentFormType: 'payment-form-type',
            paymentLicenseId: 'license-id',
            paymentLicenseValue: 'license-value',
            paymentLicenseType: 'payment-method'
        },
        settings: {
            loginUrl: '/auth/login',
            registerUrl: '/account/register',
            paymentTemplateUrl: isPhone ? '/builder/payment-mobile?v=1' : '/builder/payment?v=1',
            paymentPreviewTemplateUrl: isPhone ? '/builder/payment-preview-mobile' : '/builder/payment-preview',
            payUrl: '/payment/process',
            payPaypalUrl: '/payment/Process_express',
            upsellUrl: '/payment/upsell'
        }
    };

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Payment.prototype.initialize = function () {
    console.log('> Initialized Payment module');

    this.registerEvents();
};

GS.Editor.Payment.prototype.registerEvents = function () {
    var self = this;

    $(this.config.el.sidebar).on('click', this.config.el.sidebarActions.buy, function () {
        if ($(self.config.el.payment).hasClass(self.config.coreClasses.paymentActive)) {
            return false;
        }

        self.goToSecond();

        return true;
    });

    $body.on('click', '.payment__stage-action--buy', function () {
        this.goToThird();
    }.bind(this));

    // Choose card type
    $body.on('click', this.config.el.paymentCardType.methods, function (ev) {
        var $this = $(this);

        $(self.config.el.paymentCardType.methods).removeClass(self.config.coreClasses.paymentCardTypeActive);

        $this.addClass(self.config.coreClasses.paymentCardTypeActive);

        if ($this.data(self.config.attributes.paymentLicenseType).toLowerCase() == 'paypal') {
            $(self.config.el.paymentCcWrapper).addClass(self.config.coreClasses.paymentCcWrapperDisabled);
        } else {
            $(self.config.el.paymentCcWrapper).removeClass(self.config.coreClasses.paymentCcWrapperDisabled);
        }

        $(self.config.el.paymentCardType.dropdown).val($this.data(self.config.attributes.paymentLicenseType));
    });

    // Show discount code
    $body.on('click', this.config.el.discountCodeButton, function () {
        $(self.config.el.discountCode).toggle();
    });

    // License buttons
    $body.on('click', this.config.el.licenseButton, function () {
        var isExclusive = $(this).attr('data-license-is_exclusive');

        $(self.config.el.licenseButton).removeClass(self.config.coreClasses.licenseSelected);
        $(this).addClass(self.config.coreClasses.licenseSelected);

        if (isExclusive) {
            $('.payment__stage__article--exclusive').show();
        } else {
            $('.payment__stage__article--exclusive').hide();
        }
    });

    // Download button
    $body.on('click', this.config.el.downloadButton, function () {
        self.resetPaymentTemplate();
    });

};

/**
 * @returns {{id: *, type: *, value: *}}
 */
GS.Editor.Payment.prototype.getLicense = function () {
    var $selected = $('.' + this.config.coreClasses.licenseSelected);
    return {
        id: $selected.data(this.config.attributes.paymentLicenseId),
        type: $selected.data(this.config.attributes.paymentLicenseType),
        value: $selected.data(this.config.attributes.paymentLicenseValue)
    };
};

GS.Editor.Payment.prototype.clearErrors = function ($form) {
    var self = this;

    // Could just select all active error placeholders and remove the classes...
    // But this way it can't display old errors accidentally.
    $(self.config.el.formErrorsGlobal, $form)
        .html('')
        .removeClass(self.config.coreClasses.paymentFormErrorsActive);

    $(self.config.el.formErrors, $form)
        .html('')
        .removeClass(self.config.coreClasses.paymentFormErrorsActive);
};

GS.Editor.Payment.prototype.handleErrors = function (data, $form) {
    var self = this;

    if (data.errors) {
        if ($.isArray(data.errors)) {
            $(self.config.el.formErrorsGlobal, $form)
                .html('<p>' + data.errors.join('</p><p>') + '</p>')
                .addClass(self.config.coreClasses.paymentFormErrorsActive);
        } else if ($.isPlainObject(data.errors)) {
            $.each(data.errors, function (id, messages) {
                $('#' + id, $form)
                    .siblings(self.config.el.formErrors)
                    .html('<p>' + messages.join('</p><p>') + '</p>')
                    .addClass(self.config.coreClasses.paymentFormErrorsActive);
            });
        }
    } else if (data.error) {
        $(self.config.el.formErrorsGlobal, $form)
            .html('<p>' + data.error + '</p>')
            .addClass(self.config.coreClasses.paymentFormErrorsActive);
    }
};

GS.Editor.Payment.prototype.resetPaymentTemplate = function () {
    $body
        .removeClass(this.config.coreClasses.paymentActive)
        .trigger(GS.Editor.Events.Sidebar.Calculate)
    ;
    $(this.config.el.payment).removeClass(this.config.coreClasses.paymentActive);
    $(this.config.el.download).removeClass(this.config.coreClasses.downloadActive);
    $(this.config.el.download).removeClass(this.config.coreClasses.downloadReady);
};

GS.Editor.Payment.prototype.goToSecond = function () {
    this.renderPaymentPreviewTemplate();
    this.helpers.submitGaEvent(GS.Editor.Events.GA.SalesPreview);
};

GS.Editor.Payment.prototype.goToThird = function () {
    this.renderPaymentTemplate();
    this.helpers.submitGaEvent(GS.Editor.Events.GA.Checkout);
};

GS.Editor.Payment.prototype.renderPaymentTemplate = function () {

    $.get(this.config.settings.paymentTemplateUrl, function (data) {
    }).done(function (data) {
        var self = this;
        var $target = $(this.config.el.stagesOuter);

        $body
            .addClass(this.config.coreClasses.paymentCheckoutActive)
            .trigger(GS.Editor.Events.Sidebar.Calculate)
        ;

        $target.html(data);

        if (this.helpers.isLoggedIn() === true) {
            $('.payment__login').addClass('payment__login--disabled');
            $('[data-payment-form] .payment__section-header').text('2. Your payment');
        }

        var $el = $(this.config.el.payment);
        if ($el.length > 0) {
            $el.addClass(this.config.coreClasses.paymentActive);
            $el.scrollTop(0);
        }

        self.form = new PaymentForm({
            onPaymentMethodReceived: function() {
                if (!self.helpers.isLoggedIn()) {
                    $(self.config.el.editor).trigger(GS.Editor.Events.Login.LoginOrRegister, [{
                        cb: function () {
                            self.doPay();
                        }
                    }]);
                } else {
                    self.doPay();
                }
            },
            onComplete: function () {
                self.form.setState('saving');
                self.form.setState('disabled');

                self.clearErrors(self.form.$form);

                $.post(self.form.getAction(), self.form.getData()).done(function (response) {
                    if (!response.success) {
                        self.form.setState('enabled');
                        self.form.handleError(response.data);
                    } else {
                        self.form.setState('redirecting');

                        if (response.data.url) {
                            window.location.replace(response.data.url);
                        }
                    }
                }.bind(this));
            }
        });

        self.form.init();
    }.bind(this));
};

GS.Editor.Payment.prototype.renderPaymentPreviewTemplate = function () {
    $body
        .addClass(this.config.coreClasses.paymentActive)
        .trigger(GS.Editor.Events.Sidebar.Calculate)
    ;

    $.get(this.config.settings.paymentPreviewTemplateUrl, function (data) {
    }).done(function (data) {
        var $target = $(this.config.el.stagesOuter);

        $target.html(data);

        this.helpers.getFinalSvgLogoCode().done(function (svgCode) {
            var $svgParent = $('.payment__previews');

            this.helpers.drawPreview(svgCode, $svgParent);
            $(this.config.el.payment).addClass(this.config.coreClasses.paymentActive);
        }.bind(this));

        var $el = $(this.config.el.payment);
        if ($el.length > 0) {
            $el.scrollTop(0);
        }
    }.bind(this));
};

GS.Editor.Payment.prototype.doPay = function () {
    var self = this;
    var error;
    var $button = $(this.config.el.actionButtons.pay);
    var $form = $(self.config.el.paymentForm);

    $button.prop('disabled', true);

    var setButtonText = function(text) {
        if ($button.is('button')) {
            $button.text(text);
        } else {
            $button.attr('value', text);
        }
    };

    setButtonText($button.data('text-validating'));

    var doUpsell = function() {
        var data = self.form.getData();

        $.post(this.config.settings.upsellUrl, data).done(function (response) {
            if (!response.success) {
                self.handleErrors(response.data, $form);

                $button.prop('disabled', false);

                $button.attr('value', $button.data('text-error'));

                setTimeout(function () {
                    $button.attr('value', $button.data('text-default'));
                }, 2000);
            } else if (response.data && response.data.upsell) {
                $('[data-upsell-container]').html(response.data.html);

                self.form.update();

                $button = $(this.config.el.paymentSection.upsellButton);
                $button.on('click', function(ev) {
                    if (self.form.hasPayment()) {
                        ev.preventDefault();

                        self.form.complete();
                    } else {
                        self.form.options.onPaymentMethodReceived = function() {
                            self.form.complete();
                        };
                    }
                });
            } else {
                self.form.complete();
            }
        }.bind(this));
    }.bind(this);

    $(this.config.el.editor).one(GS.Editor.Events.Core.Saved.Logo, function (ev, data) {
        doUpsell();
    });

    this.helpers.saveLogo();

    return false;
};

GS.Editor.Payment.prototype.prepareDownload = function (logoId) {
    $(this.config.el.download).addClass(this.config.coreClasses.downloadActive);

    setTimeout(function () {
        $(this.config.el.download).addClass(this.config.coreClasses.downloadReady);
        $(this.config.el.downloadButton).attr('href', '/account/download/' + logoId);
        this.helpers.submitGaEvent(GS.Editor.Events.GA.Thankyou);
    }.bind(this), 1000);
};
;/* -----------------------------------------
 Logo Editor Preview module

 @todo   Refactoring

 @author Konstantinos Vasileiou <kostas@neverbland.com>
 @copyrights Neverbland 2014
 ----------------------------------------- */

/**
 * Preview constructor

 * @param {Object} options Preview initialization options
 * @param {Object} helpers Editor helpers
 * @param {GS.Editor.Templates} templates Editor templates
 * @param {GS.Editor.Core} core Editor core
 */
GS.Editor.Preview = function(options, helpers, templates, core) {
    this.options = options || {};

    this.defaults = {
        el: {
            preview: '.preview',
            previewMenuButton: '.preview__menu-button',
            previewSection: '.preview__content-section',
            previewActionButton: {
                all: '.preview__action-button',
                buy: '.preview__action-button--buy',
                download: '.preview__action-button--download',
                share: '.preview__action-button--share'
            },
            previewShare: {
                wrapper: '.preview__share',
                inner: '.preview__share__inner',
                emailInput: '.preview__share__input',
                sendButton: '.preview__share__button--email'
            }
        },
        coreClasses: {
            previewActive: 'preview--active',
            previewMenuButtonActive: 'preview__menu-button--active',
            previewSectionActive: 'preview__content-section--active',
            previewShareWorking: 'preview__share--working',
            previewShareActive: 'preview__share--active',
            previewShareFailure: 'preview__share--failure',
            previewShareSuccess: 'preview__share--success'
        },
        attributes: {
            previewSection: 'preview',
            previewTargetSection: 'preview-target'
        },
        settings: {
            previewShareUrl: '/builder/preview'
        }
    };

    this.cachedPreviewSvgCode = "";

    this.helpers = helpers;
    this.templates = templates;
    this.core = core;

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Preview.prototype.initialize = function() {
    console.log('> Initialized Preview module');

    this.registerEvents();
};

GS.Editor.Preview.prototype.registerEvents = function() {
    var self = this;

    $(this.config.el.sidebar).on('click', this.config.el.sidebarActions.preview, function() {
        self.fetchAndRenderPreviewMasterTemplate();
        self.helpers.submitGaEvent(GS.Editor.Events.GA.Preview);
    });

    $body.on('click', this.config.el.previewMenuButton, function() {
        var $menuButton = $(this);
        var targetSectionName = $menuButton.data(self.config.attributes.previewTargetSection);

        self.resetActiveMenusAndViews();
        self.fetchAndRenderPreviewSectionTemplate(targetSectionName);

        $(this).addClass(self.config.coreClasses.previewMenuButtonActive);
    });

    $(this.config.el.preview).on('click', this.config.el.previewActionButton.buy, function() {
        $(this.config.el.sidebarActions.buy).trigger('click');
    }.bind(this));

    $(this.config.el.preview).on('click', this.config.el.previewActionButton.download, function() {
        $(this.config.el.sidebarActions.download).trigger('click');
    }.bind(this));

    $(this.config.el.preview).on('click', this.config.el.previewActionButton.share, function() {
        $(this.config.el.previewShare.wrapper).addClass(this.config.coreClasses.previewShareActive);

        var self = this;

        $(this.config.el.sidebar).one(GS.Editor.Events.Sidebar.Navigated, function() {
            $(self.config.el.previewShare.wrapper).removeClass(self.config.coreClasses.previewShareActive);
        });
    }.bind(this));

    $(document).on('keydown', function(ev) {
        if (ev.keyCode == this.helpers.keys.KEYESCAPE && $(this.config.el.previewShare.wrapper).hasClass(this.config.coreClasses.previewShareActive)) {
            $(this.config.el.previewShare.wrapper).removeClass(this.config.coreClasses.previewShareActive);
        }
    }.bind(this));

    $(this.config.el.preview).on('click', this.config.el.previewShare.sendButton, function(ev) {
        ev.stopPropagation();

        var self = this;
        var $trigger = $(this);

        self.helpers.getFinalSvgLogoCode().done(function(svg) {
            var svgCode = svg.svg;
            var data = {
                'preview[email]': $(self.config.el.previewShare.emailInput).val(),
                'preview[svg]': svgCode
            };

            $(self.config.el.previewShare.wrapper).addClass(self.config.coreClasses.previewShareWorking);
            $.post(self.config.settings.previewShareUrl, data).done(function(resp) {
                if (resp.success) {
                    $(self.config.el.previewShare.wrapper).addClass(self.config.coreClasses.previewShareSuccess);
                } else {
                    $(self.config.el.previewShare.wrapper).addClass(self.config.coreClasses.previewShareFailure);
                }

                $(self.config.el.previewShare.wrapper).removeClass([
                    self.config.coreClasses.previewShareActive,
                    self.config.coreClasses.previewShareWorking
                ].join(' '));

                setTimeout(function() {
                    $(self.config.el.previewShare.wrapper).removeClass([
                        self.config.coreClasses.previewShareSuccess,
                        self.config.coreClasses.previewShareFailure
                    ].join(' '));
                }, 2000);
            }.bind(this));
        });

        return false;
    }.bind(this));
};

GS.Editor.Preview.prototype.resetPreviewTemplate = function() {
    $(this.config.el.preview).removeClass(this.config.coreClasses.previewActive);
    $(this.config.el.preview).find('svg').remove();

    this.resetActiveMenusAndViews();
};

GS.Editor.Preview.prototype.preparePreview = function() {
    setTimeout(function() {
        $(this.config.el.preview).addClass(this.config.coreClasses.previewActive);

        $(this.config.el.previewMenuButton).first().trigger('click');
    }.bind(this), 0);
};

GS.Editor.Preview.prototype.resetActiveMenusAndViews = function() {
    $(this.config.el.previewSection).removeClass(this.config.coreClasses.previewSectionActive);
    $(this.config.el.previewMenuButton).removeClass(this.config.coreClasses.previewMenuButtonActive);
};

GS.Editor.Preview.prototype.showTargetSection = function(sectionName) {
    $('[data-' + this.config.attributes.previewSection + '=' + sectionName + ']').addClass(this.config.coreClasses.previewSectionActive);
};

/**
 * Fetch and render the main preview section
 */
GS.Editor.Preview.prototype.fetchAndRenderPreviewMasterTemplate = function() {
    // Clear the cached svg code
    this.cachedPreviewSvgCode = "";

    this.resetActiveMenusAndViews();

    // Only fetch the template when it's not already populated
    if ($(this.templates.config.templates.preview.master.target).html() !== "") {
        this.preparePreview();

        return;
    }

    var _renderNewPreviewMasterElement = function(template) {
        var rendered = Mustache.render(template);

        $(this.templates.config.templates.preview.master.target).html(rendered);

        this.preparePreview();
    }.bind(this);

    if (this.templates.templateCache.preview.master === "") {
        $.get(this.templates.config.settings.templatePreviewUrl + this.templates.config.templates.preview.master.name, function(template) {
            this.templates.templateCache.preview.master = template;

            _renderNewPreviewMasterElement(template);
        }.bind(this));
    } else {
        _renderNewPreviewMasterElement(this.templates.templateCache.preview.master);
    }
};

/**
 * Fetch and render each individual preview template
 * based on the sectionName supplied
 *
 * @param  {String} sectionName The target template name
 */
GS.Editor.Preview.prototype.fetchAndRenderPreviewSectionTemplate = function(sectionName) {
    // Render the template
    var _renderNewPreviewSectionElement = function(svgCode) {
        var rendered = Mustache.render(this.templates.templateCache.preview[sectionName], { svg: svgCode });
        var $target = $(this.templates.config.templates.preview[sectionName].target);

        $target.html(rendered);

        this.showTargetSection(sectionName);
        this.helpers.drawPreview(svgCode, $target);
    }.bind(this);

    if (this.templates.templateCache.preview[sectionName] === "") {
        var templateUrl = this.templates.config.settings.templatePreviewUrl;
        templateUrl += this.templates.config.templates.preview[sectionName].name;
        templateUrl += "?" + Math.random();

        $.get(templateUrl, function(template) {
            this.templates.templateCache.preview[sectionName] = template;

            // Base64-infused SVG Code cached or not?
            if (this.cachedPreviewSvgCode === "") {
                this.helpers.getFinalSvgLogoCode().done(function(svg) {
                    this.cachedPreviewSvgCode = svg;

                    _renderNewPreviewSectionElement(svg);
                }.bind(this));
            } else {
                _renderNewPreviewSectionElement(this.cachedPreviewSvgCode);
            }
        }.bind(this));
    } else {
        // Base64-infused SVG Code cached or not?
        if (this.cachedPreviewSvgCode === "") {
            this.helpers.getFinalSvgLogoCode().done(function(svg) {
                this.cachedPreviewSvgCode = svg;

                _renderNewPreviewSectionElement(svg);
            }.bind(this));
        } else {
            _renderNewPreviewSectionElement(this.cachedPreviewSvgCode);
        }
    }
};
;/* -----------------------------------------
 Logo Editor Importer module

 Listens to the sidebar clicks on images/shapes & the change
 on input values (identity) and then imports/adds the appropriate
 logo items to the editor

 @author Konstantinos Vasileiou <kostas@neverbland.com>
 @copyrights Neverbland 2014
 ----------------------------------------- */

/**
 * Importer constructor

 * @param {Object} options Importer initialization options
 * @param {Object} helpers Editor helpers
 */
GS.Editor.Importer = function (options, helpers, templates, core) {
    this.options = options || {};

    this.defaults = {
        el: {
            triggers: {
                importerLogo: '[data-importer-logo]',
                importerShape: '[data-importer-shape]',
                importerBusiness: '.menu--identity__input--business',
                importerTagline: '.menu--identity__input--tagline'
            },
            logo: {
                listing: '.logo-listing',
                svg: '#logo__item--logo_0'
            },
            business: {
                text: '#logo__item--business text'
            },
            tagline: {
                text: '#logo__item--tagline text'
            }
        },
        coreClasses: {
            importer: {
                logoListingActive: 'logo-listing--active'
            }
        },
        attributes: {
            importerLogo: 'importer-logo',
            importerShape: 'importer-shape'
        }
    };

    this.logoOldPosition = {
        x: 0,
        y: 0
    };

    this.newLogoImage = false;

    this.helpers = helpers;
    this.templates = templates;
    this.core = core;

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Importer.prototype.initialize = function () {
    console.log('> Initialized importer');

    this.registerEvents();
};

GS.Editor.Importer.prototype.registerEvents = function () {
    var self = this;

    // When sidebar is collapsed deactivate the logo listing section
    $(this.config.el.editor).on(GS.Editor.Events.Sidebar.Collapsed, function () {
        $(self.config.el.logo.listing).removeClass(self.config.coreClasses.importer.logoListingActive);
    });

    // When a sidebar menu is collapsed deactivate the logo listing section
    $(this.config.el.editor).on(GS.Editor.Events.Sidebar.Menu.Collapsed, function () {
        $(self.config.el.logo.listing).removeClass(self.config.coreClasses.importer.logoListingActive);
    });

    /**
     * Import Events
     */

    // Import saved user logo
    $(this.config.el.editor).on(GS.Editor.Events.Core.Draw.SavedLogo, function (ev, data) {
        /*
         * Changed on 2014-12-04 by Paul
         * Lo and behold: EPIC FAIL
         *
         * .html() (or rather, .append(), since that's what jQuery uses) does not preserve case.
         * The end result? Shit breaks. SVG = XML = case sensitive.
         *
         * Le fix? Just use innerHTML...if data.svg is a string. Just in case.
         *
         * And yes, there is way more comments in here than there is code, fuck you.
         */

        var $canvas = $(this.config.el.canvas);

        if (typeof data.svg === 'string') {
            $canvas[0].innerHTML = data.svg;
        } else {
            $canvas.html(data.svg);
        }

        self.templates.fetchAndRenderSavedSvgLogo(data);
    }.bind(this));

    // Load business text
    $(this.config.el.editor).on(GS.Editor.Events.Importer.Loaded.Business, function (ev, $el) {
        var text = $('text', $el).text().trim();

        if (self.helpers.isOnboardingActive() && text.length === 0) {
            return;
        }

        $(self.config.el.triggers.importerBusiness).val(self.helpers.decodeXmlString(text));
        console.log('>> Loaded identity.business: ' + text);
    });

    // Load tagline text
    $(this.config.el.editor).on(GS.Editor.Events.Importer.Loaded.Tagline, function (ev, $el) {
        var text = $('text', $el).text().trim();
        var id = $el.attr('id');
        var $sidebarMenuIdentity = $(self.config.el.sidebarMenus.identity);
        var sidebarMenuIdentityHeight = $sidebarMenuIdentity.data(self.config.attributes.sidebarMenuHeight);
        var newMenuContentHeight;

        if ($('[data-target-tagline="' + id + '"]').length === 0) {
            var $tagline = $(
                [
                    '<form action="#" onsubmit="return false;">',
                    '  <fieldset class="menu--identity__fieldset">',
                    '    <button class="menu--identity__button--apply"></button>',
                    '    <button class="menu--identity__button--remove-tagline"></button>',
                    '    <input value="' + self.helpers.decodeXmlString(text) + '" data-target-tagline="' + id + '" class="menu--identity__input menu--identity__input--tagline" type="text" placeholder="Your tagline">',
                    '  </fieldset>',
                    '</form>'
                ].join('')
            );

            $tagline.insertBefore($(self.config.el.sidebarAddTaglineButton));

            newMenuContentHeight = sidebarMenuIdentityHeight + $tagline.outerHeight();

            $sidebarMenuIdentity.data(self.config.attributes.sidebarMenuHeight, newMenuContentHeight);
        }

        console.log('>> Loaded identity.tagline: ' + text);
    });

    // Get Logo code
    $body.on('click', this.config.el.triggers.importerLogo, function (ev) {
        // Storing the position of the old image logo
        // so we can move the new one to the same position
        var $imageItem = $('[data-item="Image"]');

        if ($imageItem.data('logoItem')) {
            var oldPosition = $imageItem.data('logoItem').transforms.translate;

            self.logoOldPosition.x = oldPosition.x;
            self.logoOldPosition.y = oldPosition.y;
        }

        // Remove all duplicated logo items
        $imageItem.filter('[data-item-clone="true"]').remove();

        self.core.getSvgCode($(this).data(self.config.attributes.importerLogo), GS.Editor.Events.Core.Draw.Logo);

        $(self.config.el.logo.listing).removeClass(self.config.coreClasses.importer.logoListingActive);
    });

    // Render Logo
    $(this.config.el.editor).on(GS.Editor.Events.Core.Draw.Logo, function (ev, data) {
        // Remove the current logo first
        $(self.config.el.logo.svg).remove();

        self.templates.fetchAndRenderSvgLogoItem('logo', data);
    });

    // Get Shape code
    $body.on('click', this.config.el.triggers.importerShape, function (ev) {
        self.core.getSvgCode($(this).data(self.config.attributes.importerShape), GS.Editor.Events.Core.Draw.Shape);
    });

    // Render Shape
    $(this.config.el.editor).on(GS.Editor.Events.Core.Draw.Shape, function (ev, data) {
        self.templates.fetchAndRenderSvgLogoItem('shape', data);
    });

    // Render Tagline
    $(this.config.el.editor).on(GS.Editor.Events.Core.Draw.Tagline, function (ev) {
        self.templates.fetchAndRenderSvgLogoItem('tagline', {});
    });

    // Update Business text
    $(this.config.el.triggers.importerBusiness).on('keydown', function (ev) {
        if (ev.keyCode === self.helpers.keys.KEYENTER) {
            ev.stopPropagation();
            ev.preventDefault();

            var $input = $(this);
            var $editor = $(self.config.el.editor);

            function updateBusinessText() {
                var escaped = self.helpers.encodeXmlString($input.val());

                self.helpers.setText($(self.config.el.business.text)[0], escaped);

                $editor.trigger(GS.Editor.Events.Resizer.Update);
                $editor.trigger(GS.Editor.Events.History.Update);
            }

            if ($(self.config.el.business.text).length === 0) {
                var text = $input.val();

                $editor.one(GS.Editor.Events.History.Update, function () {
                    $input.val(text);

                    updateBusinessText();
                });

                self.templates.fetchAndRenderSvgLogoItem('business', {});
            } else {
                updateBusinessText();
            }
        }
    });

    // Update Tagline text
    $body.on('keydown', this.config.el.triggers.importerTagline, function (ev) {
        var $input = $(this);
        var targetTagline = $input.attr('data-target-tagline');

        if (ev.keyCode === self.helpers.keys.KEYENTER) {
            var escaped = self.helpers.encodeXmlString($input.val());

            self.helpers.setText($('#' + targetTagline).find('text')[0], escaped);

            $(self.config.el.editor).trigger(GS.Editor.Events.Resizer.Update);
            $(self.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }
    });


    /**
     * Delete Logo Item Events
     */

    // Delete Business text
    $(this.config.el.editor).on(GS.Editor.Events.Importer.Deleted.Business, function (ev, data) {
        // $(self.config.el.business.text).text('');
        // $(self.config.el.triggers.importerBusiness).prop('value', '');
        data.item.remove();
    });

    // Delete Tagline text
    $(this.config.el.editor).on(GS.Editor.Events.Importer.Deleted.Tagline, function (ev, data) {
        data.item.remove();
    });

    // Delete Shape
    $(this.config.el.editor).on(GS.Editor.Events.Importer.Deleted.Shape, function (ev, data) {
        $(data.item).remove();
    });

    // Delete Logo
    $(this.config.el.editor).on(GS.Editor.Events.Importer.Deleted.Image, function (ev, data) {
        $(data.item).remove();
    });
};
;GS.Editor.Events = {
    Core: {
        Fetch: {
            Categories: 'categories:fetch:core.editor',
            Logos: {
                Default: 'default:logos:fetch:core.editor',
                Keyword: 'keyword:logos:fetch:core.editor'
            }
        },
        Fetched: {
            Categories: 'categories:fetched:core.editor',
            Logos: {
                Default: 'default:logos:fetched:core.editor',
                Keyword: 'keyword:logos:fetched:core.editor'
            }
        },
        Draw: {
            Logo: 'logo:draw:core.editor',
            Shape: 'shape:draw:core.editor',
            Tagline: 'tagline:draw:core.editor',
            SavedLogo: 'savedlogo:draw:core.editor'
        },
        Drawn: {
            Tagline: 'tagline:drawn:core.editor'
        },
        Save: {
            Logo: 'logo:save:core.editor'
        },
        Saved: {
            Logo: 'logo:saved:core.editor'
        },
        Loaded: {
            Logo: 'logo:loaded:core.editor'
        }
    },
    History: {
        Update: 'update:history.editor',
        Undo: 'undo:history.editor',
        Redo: 'redo:history.editor',
        Enable: 'enable:history.editor'
    },
    Importer: {
        Finished: 'finished:importer.editor',
        Loaded: {
            Business: 'business:loaded:importer.editor',
            Tagline: 'tagline:loaded:importer.editor',
            Image: 'logo:loaded:importer.editor',
            Shape: 'shape:loaded:importer.editor'
        },
        Deleted: {
            Business: 'business:deleted:importer.editor',
            Tagline: 'tagline:deleted:importer.editor',
            Image: 'logo:deleted:importer.editor',
            Shape: 'shape:deleted:importer.editor'
        }
    },
    Sidebar: {
        Navigated: 'sidebar:navigated',
        Expanded: 'expanded:sidebar.editor',
        Collapsed: 'collapsed:sidebar.editor',
        Menu: {
            Collapsed: 'collapsed:menu:sidebar.editor'
        },
        Calculate: 'sidebar:calculate'
    },
    Resizer: {
        // Updates the active resizer
        // Need that when changing stuff from the toolbar
        Update: 'update:resizer.editor'
    },
    Item: {
        Selected: 'selected:item.editor',
        Deselected: 'deselect:item.editor',
        Resize: 'resize:item.editor',
        Part: {
            Selected: 'selected:part:item.editor',
            Deselected: 'deselected:part:item.editor'
        }
    },
    Transformations: {
        Update: 'update:transformations.editor',
        Updated: 'updated:transformations.editor',
        Transformed: 'transformed:transformations.editor',
        Rotated: 'rotated:transformations.editor'
    },
    Toolbars: {
        Show: 'show:toolbars.editor',
        Hide: 'hide:toolbars.editor',
        HideAll: 'hideall:toolbars.editor',
        UpdatePickers: 'updatepickers:toolbars.editor',
        UpdateSolidFills: 'updatesolidfills:toolbars.editor',
        UpdateGradientFills: 'updategradientfills:toolbars.editor',
        ColourHistory: {
            Add: 'add:colourhistory:toolbars.editor'
        }
    },
    ScrollFoo: {
        Scrolling: 'scrolling.scrollfoo'
    },
    Colourpicker: {
        Updated: 'updated:colourpicker.editor'
    },
    GA: {
        Stage1: 'stage-1',
        Stage2: 'stage-2',
        Stage3: 'stage-3',
        MobileStage1: 'mobile-stage-1',
        MobileStage2: 'mobile-stage-2',
        MobileStage3: 'mobile-stage-3',
        MobileStage4: 'mobile-stage-4',
        Loaded: 'editor-loaded',
        Identity: 'sidebar-identity',
        Images: 'sidebar-images',
        Shapes: 'sidebar-shapes',
        Preview: 'page-preview',
        SalesPreview: 'sales-preview',
        Signup: 'page-signup',
        Login: 'page-login',
        Checkout: 'page-checkout',
        Thankyou: 'page-thank-you'
    },
    Login: {
        LoginOrRegister: 'login:execute',
        LoggedIn: 'login:logged-in',
        Registered: 'login:registered'
    },
    Payment: {
        Pay: 'payment:pay'
    }
};
;/* -----------------------------------------
    Logo Editor Resizer/Rotator module

    @author Konstantinos Vasileiou <kostas@neverbland.com>
    @copyrights Neverbland 2014
----------------------------------------- */

/**
 * Resizer constructor
 *
 * @param {Object} options Resizer initialization options
 * @param {Object} helpers Editor helpers
 */
GS.Editor.Resizer = function(options, helpers, transform) {
    this.options = options || {};

    this.defaults = {
        el: {
            resizer: '.resizer',
            bullet: {
                all: '.resizer__bullet',
                nw: '.resizer__bullet--nw',
                ne: '.resizer__bullet--ne',
                se: '.resizer__bullet--se',
                sw: '.resizer__bullet--sw'
            },
            rotator: '.rotator',
            option: {
                bringToFront: '[data-resizer-option="bring-to-front"]',
                sendToBack: '[data-resizer-option="send-to-back"]',
                duplicate: '[data-resizer-option="duplicate"]',
                remove: '[data-resizer-option="remove"]'
            }
        },
        coreClasses: {
            resizerActive: 'resizer--active',
            optionHidden: 'options__option--hidden'
        },
        attributes: {
            // Storing the id name of the target logo item
            resizerTarget: 'target-item',
            // Storing current position and size
            resizerData: 'resizer-data'
        },
        settings: {
            resizerOffset: 15,
            // Locks the aspect ratio (width is the dominant)
            ratioLock: true
        }
    };

    this.helpers = helpers;
    this.transform = transform;

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Resizer.prototype.initialize = function() {
    console.log('> Initialized resizer');

    this.registerEvents();
    this.prepareResizer();
};

GS.Editor.Resizer.prototype.registerEvents = function() {
    // Prevent item deselecting (bubbles up
    // to editor click event otherwise)
    $(this.config.el.resizer).on('click', function(ev) {
        ev.stopPropagation();
    });

    // Main resize event
    $(this.config.el.resizer).on('mousedown', this.config.el.bullet.all, function(ev) {
        ev.stopPropagation();

        this.resizeEventProcess($(this.config.el.resizer).data(this.config.attributes.resizerTarget), ev);
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Resizer.Update, function(ev) {
        this.updateResizer();
    }.bind(this));

    $(this.config.el.resizer).on('mousedown', this.config.el.rotator, function(ev) {
        ev.stopPropagation();

        this.rotateEventProcess(ev);
    }.bind(this));

    // Remove event
    $(this.config.el.resizer).on('mousedown', this.config.el.option.remove, function(ev) {
        ev.stopPropagation();

        var $activeLogoItem = $(this.config.el.logoItemActive);
        var logoItem = $activeLogoItem.data(this.config.attributes.logoItem);

        $(this.config.el.editor)
            .trigger(GS.Editor.Events.Item.Deselected)
            .trigger(GS.Editor.Events.Importer.Deleted[logoItem], [{ item: $activeLogoItem }])
            .trigger(GS.Editor.Events.History.Update);
    }.bind(this));

    // Bring To Front event
    $(this.config.el.resizer).on('mousedown', this.config.el.option.bringToFront, function(ev) {
        ev.stopPropagation();

        var $activeLogoItem = $(this.config.el.logoItemActive);

        $activeLogoItem.appendTo(this.config.el.canvas);

        $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
    }.bind(this));

    // Send To Back event
    $(this.config.el.resizer).on('mousedown', this.config.el.option.sendToBack, function(ev) {
        ev.stopPropagation();

        var $activeLogoItem = $(this.config.el.logoItemActive);

        $activeLogoItem.prependTo(this.config.el.canvas);

        $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
    }.bind(this));

    // Duplicate event
    $(this.config.el.resizer).on('mousedown', this.config.el.option.duplicate, function(ev) {
        ev.stopPropagation();

        this.duplicateLogoItem($(this.config.el.logoItemActive));
    }.bind(this));

    // Listen to the shift key - preserves aspect ratio
    // TEMPORARILY DISABLED TILL I FIGURE OUT HOW TO SOLVE
    // THE MOVING CENTERS OF THE RESIZER OUTLINE WHEN
    // WE ROTATE (due to skew effect on disproportionate
    // width/height logo items)
    //
    // $(document).on('keydown', function(ev) {
    //     if (ev.keyCode == 16) {
    //         this.config.settings.ratioLock = true;

    //         $(document).on('keyup', function(ev) {
    //             this.config.settings.ratioLock = false;
    //         }.bind(this));
    //     }
    // }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Item.Selected, function(ev, data) {
        var itemId = data.item.attr('id');

        // Don't allow business text removal.
        $(this.config.el.option.remove).toggleClass(
            this.config.coreClasses.optionHidden,
            data.item.attr('data-item') === 'Business'
        );

        // If it's already selected, why select it again? >:-|
        if ($(this.config.el.resizer).data(this.config.attributes.resizerTarget) !== itemId) {
            $(this.config.el.resizer).data(this.config.attributes.resizerTarget, itemId);

            this.hideResizer();

            // Wait for another browser tick, otherwise the resizer
            // won't bounce after removing the active class
            setTimeout(function() {
                this.showResizer();
            }.bind(this), 0);
        }

        this.transformResizer(data.item, this.helpers.getItemDimensions(data.item));
    }.bind(this));

    // Hide the resizer when the criteria is met
    $(this.config.el.editor).on(GS.Editor.Events.Item.Deselected, function() {
        $(this.config.el.resizer).data(this.config.attributes.resizerTarget, '');

        this.hideResizer();
    }.bind(this));

    // Listens to movements of logo items
    $(this.config.el.editor).on(GS.Editor.Events.Transformations.Updated, function(ev, data) {
        window.requestAnimationFrame(function() {
            this.transformResizer(data.item, this.helpers.getItemDimensions(data.item));
        }.bind(this));
    }.bind(this));
};

/**
 * Method called when we resize a logo element
 *
 * @param  {Object} initialEvent The original mousedown  event
 */
GS.Editor.Resizer.prototype.resizeEventProcess = function(itemId, initialEvent) {
    var $item = $(this.config.el.logoItemActive);
    var storedItemData = this.helpers.getItemData($item).transforms;
    var isResized = false;

    // Caching initial data
    var cache = {
        width: storedItemData.dimensions.width,
        height: storedItemData.dimensions.height,
        scaleX: storedItemData.scale.x,
        scaleY: storedItemData.scale.y
    };

    // this.helpers.doStartGlitchFix();

    $(this.config.el.editor).on('mousemove', $item, function(ev) {
        isResized = true;

        // Calculating the distance the mouse moved since mouseDown
        var distance = this.helpers.getMousemoveDistance(initialEvent, ev);

        // Adding/subtracting to the initial width/height
        // (t'is a more acurate to calculate this way :-D)
        var hypotheticalWidth = cache.width + distance.x;
        var hypotheticalHeight = cache.height + distance.y;

        // Have to divide the saved dimensions by the saved scale, because every
        // time we initiate a new resize action, the calculated/stored dimensions
        // already include it.
        var finalScaleX = (hypotheticalWidth * cache.scaleX) / cache.width;
        var finalScaleY = !!this.config.settings.ratioLock ? finalScaleX : (hypotheticalHeight * cache.scaleY) / cache.height;

        // Draw it already!
        $(this.config.el.editor).trigger(GS.Editor.Events.Transformations.Update, [{
            item: $item,
            transforms: {
                dimensions: {
                    width: hypotheticalWidth,
                    height: !!this.config.settings.ratioLock ? (cache.height / cache.scaleY) * finalScaleX : hypotheticalHeight
                },
                translate: false,
                scale: {
                    x: finalScaleX,
                    y: finalScaleY
                },
                rotate: false
            }
        }]);
    }.bind(this));

    $(this.config.el.editor).one('mouseup', function() {
        $(this.config.el.editor).off('mousemove');
        // this.helpers.doStopGlitchFix();

        if (isResized === true) {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }
    }.bind(this));
};

/**
 * Updates the active item's resizer dimensions
 * Use case: When changing an item's attributes
 * using a toolbar
 *
 * @return {Object} Editor resizer instance
 */
GS.Editor.Resizer.prototype.updateResizer = function() {
    var $item = this.helpers.getActiveLogoItem();

    if (!!$item) {
        this.transformResizer($item, this.helpers.getItemDimensions($item));

        this.helpers.doStartGlitchFix().doStopGlitchFix();
    }
};

/**
 * Method called when we rotate a logo element
 *
 * @param  {Object} initialEvent The original mousedown  event
 */
GS.Editor.Resizer.prototype.rotateEventProcess = function(initialEvent) {
    var isRotated = false;

    // Get the current transforms
    var itemDataTransforms = this.helpers.getItemData($(this.config.el.logoItemActive)).transforms;

    var oldRotate = itemDataTransforms.rotate.a;

    // Calculate the centers of the shape
    var itemCenterX = itemDataTransforms.translate.x + (itemDataTransforms.dimensions.width / 2);
    var itemCenterY = itemDataTransforms.translate.y + (itemDataTransforms.dimensions.height / 2);

    $(this.config.el.editor).on('mousemove', function(e) {
        isRotated = true;
        var offset = Math.atan2(itemCenterY - initialEvent.pageY, initialEvent.pageX - itemCenterX);
        var rad2deg = 180 / Math.PI;
        var newOffset = Math.atan2(itemCenterY - e.pageY, e.pageX - itemCenterX);
        var degrees = (offset - newOffset) * rad2deg;

        // Draw it already!
        $(this.config.el.editor).trigger(GS.Editor.Events.Transformations.Update, [{
            item: $(this.config.el.logoItemActive),
            transforms: {
                dimensions: false,
                translate: false,
                scale: false,
                rotate: {
                    a: oldRotate + degrees,
                    x: (itemDataTransforms.dimensions.width / itemDataTransforms.scale.x) / 2,
                    y: (itemDataTransforms.dimensions.height / itemDataTransforms.scale.y) / 2
                }
            }
        }]);
    }.bind(this));

    $(this.config.el.editor).one('mouseup', function() {
        $(this.config.el.editor).off('mousemove');

        if (isRotated === true) {
            $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        }
    }.bind(this));
};

/**
 * Returns the resizer's stored data
 *
 * @return {Object} Resizer data
 */
GS.Editor.Resizer.prototype.getResizerData = function() {
    return $(this.config.el.resizer).data(this.config.attributes.resizerData);
};

/**
 * Initialize the resizer element (adding needed custom attribute
 * which is needed for storing the logo item ID that's connected to
 * but also the dimensions and position of it)
 *
 * @return {Object} Editor resizer instance
 */
GS.Editor.Resizer.prototype.prepareResizer = function() {
    $(this.config.el.resizer)
        .data(this.config.attributes.resizerTarget, '')
        .data(this.config.attributes.resizerData, {
            dimensions: {
                width: 0,
                height: 0
            },
            translate: {
                x: 0,
                y: 0
            },
            rotate: 0
        });

    return this;
};

/**
 * Shows the resizer
 *
 * @return {Object} Editor resizer instance
 */
GS.Editor.Resizer.prototype.showResizer = function() {
    $(this.config.el.resizer).addClass(this.config.coreClasses.resizerActive);

    return this;
};

/**
 * Hides the resizer
 *
 * @return {Object} Editor resizer instance
 */
GS.Editor.Resizer.prototype.hideResizer = function() {
    $(this.config.el.resizer).removeClass(this.config.coreClasses.resizerActive);

    return this;
};

/**
 * Transform the resizer with data similar to the target element
 *
 * @param  {Object} transforms Target logo item current transformation data
 */
GS.Editor.Resizer.prototype.transformResizer = function($item, transforms) {
    var resizerTransforms = this.getResizerData();
    var finalCss = {
        width: transforms.width + (this.config.settings.resizerOffset * 2),
        height: transforms.height + (this.config.settings.resizerOffset * 2),
        top: transforms.y - this.config.settings.resizerOffset,
        left: transforms.x - this.config.settings.resizerOffset
    };

    // Apply the css
    $(this.config.el.resizer).css(finalCss);

    // Store the new data to the resizer element
    resizerTransforms.dimensions.width = transforms.width + (this.config.settings.resizerOffset * 2);
    resizerTransforms.dimensions.height = transforms.height + (this.config.settings.resizerOffset * 2);
};

/**
 * Duplicate a logo item
 * @param  {jQuery} $logoItem [Optional] Target logo item
 */
GS.Editor.Resizer.prototype.duplicateLogoItem = function($logoItem) {
    var self = this;
    var $duplicate = $(this.config.el.logoItemActive).clone(true, true);
    var $duplicateLogoItemParts;

    $duplicate[0].setAttribute('id', $logoItem.attr('id') + '-copy');
    $duplicate.attr('data-item-clone', 'true');

    // Treat the duplicated Business item type as Tagline
    if ($duplicate.attr('data-item') === 'Business') {
        $duplicate.attr('data-item', 'Tagline');
    }

    $duplicate.insertAfter($logoItem);

    $duplicateLogoItemParts = $duplicate.find('circle, ellipse, line, path, polygon, polyline, rect, text');

    // Need to take care of the unique IDs for filters and gradients
    $duplicateLogoItemParts.each(function() {
        var $logoItemPart = $(this);
        var logoItemPartId = $logoItemPart.attr('data-part-id');
        var fill = $logoItemPart.attr('fill');
        var filterId = $logoItemPart.attr('filter') || null;
        var gradientId = self.helpers.getGradientIdFromPath(fill);
        var newGradientId;
        var newFilterId;

        // Adding a 'copy' suffix to all logo item part IDs
        $logoItemPart[0].setAttribute('data-part-id', logoItemPartId + '-copy');

        // Take care of gradients
        if (fill.indexOf('url(') !== -1) {
            newGradientId = gradientId + '-copy';

            $duplicate.find(gradientId)[0].setAttribute('id', newGradientId.replace('#', ''));
            $logoItemPart.attr('fill', 'url(' + newGradientId + ')');
        }

        // Take care of filters
        if (filterId !== null) {
            filterId = filterId.replace('url(', '').replace(')', '')
            newFilterId = logoItemPartId + '-copy_Effect';

            $logoItemPart.attr('filter', 'url(#' + newFilterId + ')');
            $duplicate.find(filterId)[0].setAttribute('id', newFilterId.replace('#', ''));
        }
    });

    var duplicateData = this.helpers.getItemData($duplicate);
    duplicateData.transforms.translate.x = duplicateData.transforms.translate.x - 20;
    duplicateData.transforms.translate.y = duplicateData.transforms.translate.y - 20;

    this.transform.transform($duplicate);

    $(this.config.el.editor).trigger(GS.Editor.Events.Item.Deselected);
    this.helpers.refreshSVG();
};
;/* -----------------------------------------
 Logo Editor Helpers module
 Set & get data, do calculations
 and all kinds of cool stuff!

 @author Konstantinos Vasileiou <kostas@neverbland.com>
 @copyrights Neverbland 2014
 ----------------------------------------- */

/**
 * Editor Helpers constructor
 *
 * @param {Object} config Main editor config
 */
GS.Editor.Helpers = function (config) {
    this.defaults = {
        settings: {
            fontPath: '/builder_assets/fonts'
        },
        attributes: {
            // That's where we store the browser data
            browserData: 'data-browser'
        }
    };

    // Keycodes
    this.keys = {
        KEYRIGHT: 39,
        KEYLEFT: 37,
        KEYESCAPE: 27,
        KEYENTER: 13
    };

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, config);

    this.registerEvents();

    $('body').addClass(this.isTouchDevice() ? 'touch' : 'no-touch');
};

GS.Editor.Helpers.prototype.registerEvents = function () {
    console.log('> Registered helpers');

    $(this.config.el.editor).on(GS.Editor.Events.Transformations.Update, function (ev, data) {
        this.storeItemTransformsData(data.item, data.transforms);
        $(this.config.el.editor).trigger(GS.Editor.Events.Transformations.Updated, [
            { item: data.item }
        ]);
    }.bind(this));

    $(this.config.el.editor).on(GS.Editor.Events.Login.LoggedIn, function () {
        $('body').removeClass('not-logged-in');
    });
};

/**
 * Returns whether the device is a touch device or not. YMMV.
 *
 * @returns {boolean|*}
 */
GS.Editor.Helpers.prototype.isTouchDevice = function () {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
};

/**
 *
 * @param {String} device
 * @param {String} orientation
 * @returns {Boolean}
 */
GS.Editor.Helpers.prototype.isDevice = function (device, orientation) {
    if (!device || (device != 'phone' && device != 'tablet')) {
        return false;
    }

    if (!orientation) {
        return this.isDevice(device, 'portrait') || this.isDevice(device, 'landscape');
    }

    if (orientation != 'portrait' && orientation != 'landscape') {
        return false;
    }

    var breakpoints = {
        phone: {
            portrait: {
                "max-device-width": '720px' // 1440p...
            },
            landscape: {
                "max-device-width": '767px'
            }
        },
        tablet: {
            portrait: {
                "max-device-width": '1024px'
            },
            landscape: {
                "max-device-width": '1280px'
            }
        }
    };

    var query = [
        'orientation: ' + orientation
    ];

    for (var prop in breakpoints[device][orientation]) {
        if (!breakpoints[device][orientation].hasOwnProperty(prop)) {
            continue;
        }

        var value = breakpoints[device][orientation][prop];

        query.push(prop + ': ' + value);
    }

    query = '(' + query.join(') and (') + ')';

    return (window.matchMedia(query).matches);
};

/**
 * Encodes a string for use as XML content
 *
 * @param {string} input
 * @returns {string}
 */
GS.Editor.Helpers.prototype.encodeXmlString = function (input) {
    var xmlDoc = (new DOMParser()).parseFromString('<a></a>', 'text/xml');

    return (new XMLSerializer()).serializeToString(xmlDoc.createTextNode(input));
};

/**
 * Encodes a string for use as XML content
 *
 * @param {string} input
 * @returns {string}
 */
GS.Editor.Helpers.prototype.preserveSpacing = function (input) {
    return input.replace(/  /g, ' \u2005');
};

/**
 * Sets the text content of an XML node.
 *
 * @param {Element} node
 * @param {string} input
 * @returns {string}
 */
GS.Editor.Helpers.prototype.setText = function (node, input) {
    try {
        input = this.preserveSpacing(input);

        input = input.replace(/&amp;/g, '&');

        node.innerHTML = '';
        node.textContent = input;
    } catch(e) {
        console.log(e);
    }
};

/**
 * Returns a dummy colour picker to avoid "undefined" errors.
 * For some reason on some systems the toolbars don't always load, even though there is no error reported.
 *
 * TODO: Figure out what's causing the error and remove this dummy.
 *
 * @returns {{}}
 */
GS.Editor.Helpers.prototype.createColorPicker = function (selector, callback) {
    var $el = null;

    // Dummy
    var cp = {
        setHex: function () {
            var args = arguments;

            console.log('Dummy setHex');
            setTimeout(function () {
                cp.setHex.apply(cp, args);
            }, 100);
        },
        setHsv: function () {
            var args = arguments;

            console.log('Dummy setHsv');
            setTimeout(function () {
                cp.setHsv.apply(cp, args);
            }, 100);
        },
        setRgb: function () {
            var args = arguments;

            console.log('Dummy setRgb');
            setTimeout(function () {
                cp.setRgb.apply(cp, args);
            }, 100);
        }
    };

    // This is nasty but necessary right now
    var tries = 0;
    var interval = setInterval(function () {
        ++tries;

        $el = $(selector);

        if ($el.length > 0) {
            cp = ColorPicker($el[0], callback);

            console.log('!!! Created colour picker on ' + selector + ' after ' + tries + ' tries.');

            clearInterval(interval);
        }

        if (tries >= 5) {
            console.log('!!! Unable to create colour picker on ' + selector + ' after ' + tries + ' tries.');

            clearInterval(interval);
        }
    }, 50);

    return {
        setHex: function () {
            cp.setHex.apply(cp, arguments);
        },
        setHsv: function () {
            cp.setHsv.apply(cp, arguments);
        },
        setRgb: function () {
            cp.setRgb.apply(cp, arguments);
        }
    };
};

/**
 * Decodes a string from an XML document for human use
 *
 * @param {string} input
 * @returns {string}
 */
GS.Editor.Helpers.prototype.decodeXmlString = function (input) {
    return input
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ');
};

/**
 * Return the raw item name
 * (basically without '#', '.' or '[]')
 *
 * @param  {String} _string Item name / Data attribute including '#', '.' or '[]'
 * @return {String}         Raw item name
 */
GS.Editor.Helpers.prototype.getRawName = function (_string) {
    return _string.replace(/[.#\[\]]/g, '');
};

/**
 * Basic WebKit detection.
 * Add appropriate class if detected.
 *
 * @return {Boolean} Is it WebKit or not
 */
GS.Editor.Helpers.prototype.isWebkit = function () {
    var result = bowser.webkit || false;

    if (result === true) {
        $body.addClass('browser--webkit');
    }

    return result;
};

/**
 * Basic Firefox detection.
 * Add appropriate class if detected.
 *
 * @return {Boolean} Is it Firefox or not
 */
GS.Editor.Helpers.prototype.isFirefox = function () {
    var result = bowser.firefox || false;

    if (result === true) {
        $body.addClass('browser--firefox');
    }

    return result;
};

/**
 * Basic IE detection.
 * Add appropriate class if detected.
 *
 * @return {Boolean} Is it IE or not
 */
GS.Editor.Helpers.prototype.isIE = function () {
    var result = (bowser.name.toLowerCase() === 'internet explorer');

    if (result === true) {
        $body.addClass('browser--ie');
    }

    return result;
};

GS.Editor.Helpers.prototype.getBrowserInfo = function () {
    return bowser;
};

/**
 * Checks if the user browser is unsupported
 *
 * @return {Object} Is browser supported or not ffs?
 */
GS.Editor.Helpers.prototype.checkIfBrowserUnsupported = function () {
    var browserName = bowser.name.toLowerCase();
    var browserVersion = Number(bowser.version);
    var browserUnsupported = (browserName === 'chrome' && browserVersion < 30) ||
        (browserName === 'safari' && browserVersion < 6.1) ||
        (browserName === 'opera' && browserVersion < 18) ||
        (browserName === 'internet explorer');

    if (browserUnsupported === true && !$body.hasClass('browser--unsupported')) {
        $body.addClass('browser--unsupported');
    }

    return browserUnsupported;
};

GS.Editor.Helpers.prototype.checkIfUnsavedChanges = function () {
    return window.GSEditor.savedHistoryPosition !== window.GSEditor.history.historyArray.length;
};

/**
 * Fix for when dragging the text elements around basically.
 * On mousedown we set a clipPath around the SVG(*) to prevent
 * the glitch generation of elements that expand outside their
 * viewbox (wat?). On mouseup we remove the clip to show the font
 * in its fullest width (no croppings).
 *
 * (*) No reason why applying this to SVG actually works. Ultimately,
 * we're applying clipping to the main SVG element, but cropping everything
 * that's drawn beyond its 100% dimensions. In other words, we're clipping
 * absolutely nothing.
 */
GS.Editor.Helpers.prototype.doStartGlitchFix = function () {
    if (this.isWebkit()) {
        $(this.config.el.editor).addClass(this.config.coreClasses.editorDragging);
    }

    return this;
};

GS.Editor.Helpers.prototype.doStopGlitchFix = function () {
    if (this.isWebkit()) {
        $(this.config.el.editor).removeClass(this.config.coreClasses.editorDragging);
    }

    return this;
};

/**
 * Fix text positioning crossbrowser
 */
GS.Editor.Helpers.prototype.doFixTextPositioning = function () {
    console.log('!!! Fixing text positioning');

    var isIE = this.isIE();
    var isSafari = (bowser.name.toLowerCase() === 'safari');

    $(this.config.el.logoItem).each(function (index, el) {
        var $el = $(el);

        if ($el.data('item-type') === 'text') {
            var $text = $el.find('text');

            if (isIE === true) {
                $text.attr('dy', '');
            } else {
                $text.attr('dominant-baseline', 'auto');
                $text.attr('alignment-baseline', 'auto');
                $text.attr('dy', '0');
            }
        }
    });
};

/**
 * Fix for Safari and Firefox (at this time of writing).
 * When we're applying new (or existing) gradients or shadows to elements,
 * the SVG namespace is lost and the gradients/effects don't render at all.
 * This is the way we go around this annoying bug.
 *
 * @param  {String} targetId Target element id we need to fix
 */
GS.Editor.Helpers.prototype.fixSvgNamespace = function (targetId) {
    $body.append('<svg id="dummy" style="display:none"><defs>' + $('#' + targetId).clone().wrap('<p>').parent().html() + '</defs></svg>');
    $('.canvas #' + targetId).replaceWith($('#dummy #' + targetId));
    $('#dummy').remove();
};

/**
 * Method to see if a user is logged in
 *
 * @return {Boolean} Is user logged in?
 */
GS.Editor.Helpers.prototype.isLoggedIn = function () {
    return !$('body').hasClass('not-logged-in');
};

GS.Editor.Helpers.prototype.isOnboardingActive = function () {
    return $('body').hasClass('onboarding--active');
};

GS.Editor.Helpers.prototype.isSidebarExpanded = function () {
    return $('.sidebar').hasClass('sidebar--expanded');
};

/**
 * Returns the ID of the current logo  (if saved)
 * otherwise it returns Boolean (false) if it's not yet saved
 */
GS.Editor.Helpers.prototype.getCurrentLogoId = function () {
    return window.GSEditor.currentLogoId;
};

/**
 * Returns the currently selected logo item
 *
 * @return {jQuery/Boolean} Selected/Active logo item or False if nothing's selected
 */
GS.Editor.Helpers.prototype.getActiveLogoItem = function () {
    var $active = $(this.config.el.canvas).find(this.config.el.logoItemActive);

    return ($active.length > 0) ? $active : false;
};

/**
 * Checks if the item is already active
 *
 * @param  {jQuert}  $item Logo item
 * @return {Boolean}       Is it active or not?
 */
GS.Editor.Helpers.prototype.isItemActive = function ($item) {
    return ($item.attr('class').match(/(logo__item--active)/g) != null) ? true : false;
};

/**
 * Checks if an item has active parts
 *
 * @param  {jQuery}  $item (Optional) Target logo item that contains the part
 * @return {Boolean}       Are there active parts or not?
 */
GS.Editor.Helpers.prototype.hasItemPartActive = function ($item) {
    var $item = $item || this.getActiveLogoItem();

    return ($item.attr('class').match(/(logo__item-part--active)/g)) ? true : false;
};

/**
 * Get the active item part of a specific/active item
 *
 * @param  {jQuery} $item Target logo item
 * @return {jQuery}       Active logo item part
 */
GS.Editor.Helpers.prototype.getItemActivePart = function ($item) {
    var $item = $item || this.getActiveLogoItem();

    return $item.find('.' + this.config.coreClasses.logoPartActive);
};

GS.Editor.Helpers.prototype.getColoursFromItem = function ($item) {
    var $itemFills = $item.find('[fill]');
    var finalColoursArray = [];
    var doHex = function (hex) {
        if (hex.indexOf('rgb') !== -1) {
            return hex = this.rgb2hex(hex);
        } else {
            return hex;
        }
    }.bind(this);

    $itemFills.each(function (index, item) {
        var fill = $(item).attr('fill');

        if (fill.indexOf('url(') != -1) {
            var fillId = this.getGradientIdFromPath(fill);
            var colours = this.getGradientsFromGradientStyleElement($item.find(fillId));

            finalColoursArray.push(doHex(colours.first));
            finalColoursArray.push(doHex(colours.second));
        } else {
            if (fill !== 'none') {
                finalColoursArray.push(doHex(fill));
            }
        }
    }.bind(this));

    return finalColoursArray;
};

/**
 * Returns the raw ID (including the hash) of an item part's gradient
 *
 * @param  {String} fillString Gradient fill id (example: 'url(#gradient-id)')
 * @return {String}            Raw ID (example: '#gradient-id')
 */
GS.Editor.Helpers.prototype.getGradientIdFromPath = function (fillString) {
    return fillString.replace('url(', '').replace(')', '');
};

/**
 * Returns the first and last colours of a gradient element
 *
 * @param  {jQuery} $gradient (linear/radial/etc)Gradient element
 * @return {Object}           First and last colours
 */
GS.Editor.Helpers.prototype.getGradientsFromGradientStyleElement = function ($gradient) {
    return {
        first: $gradient.find('stop:first-child').attr('style').replace('stop-color:', ''),
        second: $gradient.find('stop:last-child').attr('style').replace('stop-color:', '')
    };
};

/**
 * Redraw the SVG on the canvas to refresh any changes
 */
GS.Editor.Helpers.prototype.refreshSVG = function () {
    var svgItems = this.getCurrentAndNewSvgContent(null);

    window.GSEditor.templates.createNewMasterSvgElementWithData({ items: svgItems });
};

/**
 * Returns an array of all the logo items on the master SVG element
 *
 * @param  {jQuery}  $newItem The newly added logo item (the reason we update the master SVG)
 * @param  {jQuery}  $svgEl   The target SVG logo (could be the current one or a cloned one)
 * @return {Array}            Array of new and old logo items the master SVG is consisted of
 */
GS.Editor.Helpers.prototype.getCurrentAndNewSvgContent = function ($newItem, $svgEl) {
    var self = this;
    var $svg = $svgEl || $(this.config.el.canvas);
    var shapeIndex = 1;
    var taglineIndex = 1;
    var itemsArray = [];

    // Iterating through the item parts and assigning unique
    // IDs. These will help us later to generate Fill URLs
    // and IDs for custom effects (shadow/glow)
    var generatePartIds = function (id, $parts) {
        $parts.each(function (index) {
            $(this).attr({ 'data-part-id': id + '__' + index });
        });
    };

    $svg.find(this.config.el.logoItem).each(function (index) {
        var $this = $(this).clone();
        var elId = $this.attr('id');

        switch ($this.attr('data-item')) {
            case 'Shape':
                elId = 'logo__item--shape_' + shapeIndex;
                generatePartIds(elId, $this.find('circle, ellipse, line, path, polygon, polyline, rect'));
                shapeIndex++;
                break;
            case 'Tagline':
                elId = 'logo__item--tagline_' + taglineIndex;
                generatePartIds(elId, $this.find('text'));
                taglineIndex++;
                break;
            default:
                elId = elId;
                break;
        }

        $this.attr({ id: elId });

        itemsArray.push({
            el: $this,
            elId: elId,
            elData: $.extend(true, {}, $(this).data(self.config.attributes.logoItemData))
        });
    });

    if ($newItem != null) {
        var itemType = $newItem.attr('data-item');
        var elId = $newItem.attr('id');

        if (itemType !== 'Business') {
            elId += '_0';
        }

        // Add the part id's on new items
        if (itemType === 'Shape' || itemType === 'Tagline' || itemType === 'Image') {
            if (itemType === 'Shape') {
                elId = 'logo__item--shape_' + shapeIndex;
            }

            if (itemType === 'Image') {
                var imageColours = this.getColoursFromItem($newItem);

                // Making it obvious that the new element we're adding is an image.
                // This way we can change the colour of the text and match it with the
                // image's dominant colours.
                GSEditor.importer.newLogoImage = true;

                for (var i = imageColours.length - 1; i >= 0; i--) {
                    var hex = imageColours[i];

                    if (hex.toUpperCase() === '#FFFFFF') {
                        continue;
                    }

                    $(this.config.el.editor).trigger(GS.Editor.Events.Toolbars.ColourHistory.Add, [
                        { hex: hex }
                    ]);
                }
            }

            if (itemType === 'Tagline') {
                elId = 'logo__item--tagline_' + taglineIndex;

                $(this.config.el.editor).trigger(GS.Editor.Events.Core.Drawn.Tagline, [
                    { taglineId: elId }
                ]);
            } else {
                window.GSEditor.sidebar.collapseSidebar();
            }

            generatePartIds(elId, $newItem.find('circle, ellipse, line, path, polygon, polyline, rect, text'));
        }

        itemsArray.push({
            el: $newItem.clone().attr('id', elId),
            elId: elId,
            elData: undefined
        });

        $(this.config.el.editor).trigger(GS.Editor.Events.Item.Deselected);
    }

    return itemsArray;
};

/**
 * Gets the final SVG code and triggers a save action
 *
 * @param {Function} cb     Callback function to execute when the logo is saved
 * @param {Boolean}  silent Show overlay or not?
 */
GS.Editor.Helpers.prototype.saveLogo = function (cb, silent) {
    cb = cb || {};
    silent = silent || false;

    $(this.config.el.canvas).attr(this.config.attributes.browserData, bowser.name + '[' + bowser.version + ']');

    this.getFinalSvgLogoCode().done(function (svgCode) {
        $(this.config.el.editor).trigger(GS.Editor.Events.Core.Save.Logo, [
            { data: svgCode.svg, cb: cb, silent: silent }
        ]);
    }.bind(this));
};

/**
 * Embeds all the necessary fonts into the SVG as Base64 encoded @font-face definitions
 *
 * @param {Function} callMeBack It's a damn callback, what else would it be.
 *                              Usually a resizer update trigger event.
 */
GS.Editor.Helpers.prototype.embedFonts = function (callMeBack) {
    callMeBack = callMeBack || {};
    var self = this;
    var $svg = $(self.config.el.canvas);
    var currentIndex = 0; // Keeping track of the text element processed
    var _processFonts = function () {
        // Do not trigger history update unless we've just
        // processed the final text element of the svg
        if (currentIndex === $svg.find('text').length) {
            if (typeof callMeBack === 'function') {
                // Giving it 100ms to make sure (hopefully?) that the
                // font is done rendering (considering base64) is kinda
                // resource hungry. This depends on the CPU horsepower of
                // the user's machine, but can't do much about it atm.
                setTimeout(function () {
                    callMeBack();
                }.bind(this), 200);
            }
        }
    }.bind(this);

    // Clear the current defs styles before proceeding
    $svg.find('> defs style').text('');

    // Make sure we include the right base64 fonts in there
    $svg.find('text').each(function (index) {
        var $text = $(this);

        var fontFamily = $text.attr('data-font-family');
        var fontWeight = $text.attr('data-font-weight');
        var fontStyle = $text.attr('data-font-style');

        var familyFileName = fontFamily.replace(/\s+/g, '-').toLowerCase();
        var fontFilename = ['font', familyFileName, fontWeight, fontStyle].join('-');

        // Storing the ttf url (used for conversion/export)
        $text.attr('data-font-filename', fontFilename.replace('font-', ''));

        // Updating the font-family attribute of the text element
        $text.attr('font-family', fontFamily);
        $text.attr('font-weight', fontWeight);
        $text.attr('font-style', fontStyle);

        currentIndex++;

        _processFonts();
    });
};

/**
 * Parses a transform attribute string into a consistent format.
 * Does it in a manner that works across browsers.
 *
 * @param {string} attr
 * @returns {{translate: *, scale: *, rotate: *}}
 */
GS.Editor.Helpers.prototype.parseTransform = function (attr) {
    // First, let's clean this shit up so that it's consistent across all retar...err, browsers.
    // We'll first force lower case
    attr = attr.toLowerCase();

    // Then we simply split it up by looking for any function
    // Lazy match on the function parameters so that we allow any number of them
    // 0 fucks given about commas and spaces
    var matches = attr.match(/([a-z]+\(.+?\))/g);

    // Getting ready to build the normalised transform now
    var transform = {
        translate: {
            x: 0,
            y: 0
        },
        scale: {
            x: 1,
            y: 1
        },
        rotate: {
            a: 0,
            x: 0,
            y: 0
        }
    };

    for (var i in matches) {
        var func = matches[i];
        var params = func.match(/(\-?\d+\.?\d*)/g);

        // #1: substr is quicker than regex
        // #2: Parse each explicitly, because some browsers omit values if they're 0
        if (func.substr(0, 9) === 'translate') {
            switch (params.length) {
                case 2:
                    transform.translate.x = parseFloat(params[0]);
                    transform.translate.y = parseFloat(params[1]);
                    break;

                case 1:
                    transform.translate.x = parseFloat(params[0]);
                    transform.translate.y = 0;
                    break;

                default:
                    transform.translate = false;
            }
        } else if (func.substr(0, 5) === 'scale') {
            switch (params.length) {
                case 2:
                    transform.scale.x = parseFloat(params[0]);
                    transform.scale.y = parseFloat(params[1]);
                    break;

                case 1:
                    transform.scale.x = parseFloat(params[0]);
                    transform.scale.y = parseFloat(params[0]);
                    break;

                default:
                    transform.scale = false;
            }
        } else if (func.substr(0, 6) === 'rotate') {
            switch (params.length) {
                case 3:
                    transform.rotate.a = parseFloat(params[0]);
                    transform.rotate.x = parseFloat(params[1]);
                    transform.rotate.y = parseFloat(params[2]);
                    break;

                case 1:
                    transform.rotate.a = parseFloat(params[0]);
                    break;

                default:
                    transform.rotate = false;
            }
        }
    }

    return transform;
};

/**
 * Opposite of parseTransform, builds a transform string from a normalised transform object.
 *
 * @param {object} transform
 * @returns {string}
 */
GS.Editor.Helpers.prototype.buildTransform = function (transform) {
    var parts = [];

    if (transform.translate) {
        parts.push('translate(' + transform.translate.x + ' ' + transform.translate.y + ')');
    }

    if (transform.scale) {
        parts.push('scale(' + transform.scale.x + ' ' + transform.scale.y + ')');
    }

    if (transform.rotate) {
        parts.push('rotate(' + transform.rotate.a + ' ' + transform.rotate.x + ' ' + transform.rotate.y + ')');
    }

    return parts.join(' ');
};

/**
 * Get the minimum and maximum coordinates being covered by the SVG,
 * in order to start cropping the shit out of it! Excuse the language. :-/
 *
 * @return {Object} Coords
 */
GS.Editor.Helpers.prototype.getMinimumAndMaximumXAndYs = function () {
    var self = this;

    return $.Deferred(function (deferred) {
        console.log('[getMinimumAndMaximumXAndYs] Calling server for viewbox');

        var timer = {
            start: new Date().getTime(),
            finish: function () {
                var end = new Date().getTime();

                console.log('[getMinimumAndMaximumXAndYs] Finished after ' + (end - this.start) + 'ms');
            }
        };

        var $svg = $(self.config.el.canvas);

        var svgCode = $svg.clone()
            .attr('width', $svg.width())
            .attr('height', $svg.height())
            .wrap('<div />')
            .parent().html();

        $.ajax({
            url: '/viewboxer',
            async: false,
            cache: false,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
                width: $svg.width(),
                height: $svg.height(),
                svg: svgCode
            }),
            success: function (data) {
                if (data.viewBox) {
                    var minMax = data.viewBox;

                    minMax.toViewboxString = function () {
                        var viewbox = [this.minX, this.minY, this.width, this.height].join(' ');

                        console.log('[Viewbox] ' + viewbox);

                        return viewbox;
                    };

                    timer.finish();

                    deferred.resolve(minMax);
                }
            }
        });
    }).promise();

    return $.Deferred(function (deferred) {
        // Let's benchmark this fucker
        var timer = {
            start: new Date().getTime(),
            finish: function () {
                var end = new Date().getTime();

                console.log('[getMinimumAndMaximumXAndYs] Finished after ' + (end - this.start) + 'ms');
            }
        };

        setTimeout(function () {
            var $svg = $(self.config.el.canvas);

            /*
             * Dear IE and Safari < 6,
             *
             * Kindly go fuck yourself.
             *
             * With love,
             *
             * Phteven
             */
            var doViewboxerWorkaround = function () {
                console.log('[getMinimumAndMaximumXAndYs] Canvas analysis failed, falling back');
                $.ajax({
                    url: '/viewboxer',
                    async: false,
                    cache: false,
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        width: $svg.width(),
                        height: $svg.height(),
                        svg: svgCode
                    }),
                    success: function (data) {
                        if (data.viewBox) {
                            var minMax = data.viewBox;

                            minMax.toViewboxString = function () {
                                var viewbox = [this.minX, this.minY, this.width, this.height].join(' ');

                                console.log('[Viewbox] ' + viewbox);

                                return viewbox;
                            };

                            timer.finish();

                            deferred.resolve(minMax);
                            imageObj.onerror = null;
                        }
                    }
                });
            };

            var svgCode = $svg.clone()
                .attr('width', $svg.width())
                .attr('height', $svg.height())
                .wrap('<div />')
                .parent().html();

            var viewbox = {
                min: {
                    x: +Infinity,
                    y: +Infinity
                },
                max: {
                    x: -Infinity,
                    y: -Infinity
                }
            };

            var canvas = document.getElementById('utility-canvas');
            canvas.width = $svg.width();
            canvas.height = $svg.height();

            var ctx = canvas.getContext('2d');

            var imageObj = new Image();

            imageObj.onload = function () {
                console.log('[getMinimumAndMaximumXAndYs] Image loaded, attempting canvas analysis');
                setTimeout(function () {
                    try {
                        ctx.drawImage(imageObj, 0, 0);

                        var w = ctx.canvas.width;
                        var h = ctx.canvas.height;
                        var pixels_rgba = ctx.getImageData(0, 0, w, h).data;

                        for (var x = 0; x < w; ++x) {
                            for (var y = 0; y < h; ++y) {
                                var alpha = pixels_rgba[(w * y + x) * 4 + 3];

                                if (alpha > 0) {
                                    if (x < viewbox.min.x) {
                                        viewbox.min.x = x;
                                    }

                                    if (x > viewbox.max.x) {
                                        viewbox.max.x = x;
                                    }

                                    if (y < viewbox.min.y) {
                                        viewbox.min.y = y;
                                    }

                                    if (y > viewbox.max.y) {
                                        viewbox.max.y = y;
                                    }
                                }
                            }
                        }

                        imageObj.onload = null;

                        timer.finish();

                        // Add 3 pixels on all sides to avoid browser issues
                        var padding = 3;

                        deferred.resolve({
                            minX: viewbox.min.x - padding,
                            minY: viewbox.min.y - padding,
                            maxX: viewbox.max.x + padding,
                            maxY: viewbox.max.y + padding,
                            width: (viewbox.max.x - viewbox.min.x) + (2 * padding),
                            height: (viewbox.max.y - viewbox.min.y) + (2 * padding),
                            toViewboxString: function () {
                                var viewbox = [this.minX, this.minY, this.width, this.height].join(' ');

                                console.log('[Viewbox] ' + viewbox);

                                return viewbox;
                            }
                        });
                    } catch (e) {
                        doViewboxerWorkaround();
                    }
                }, 1);
            };

            imageObj.onerror = function () {
                doViewboxerWorkaround();
            };

            imageObj.crossOrigin = 'Anonymous';
            imageObj.src = 'data:image/svg+xml,' + encodeURIComponent(svgCode);
        }, 2);
    }).promise();
};

/**
 * Prepare our SVG code for dispatch. Cleanup all the shit.
 *
 * @return {Object} SVG Code + dimensions
 */
GS.Editor.Helpers.prototype.getFinalSvgLogoCode = function () {
    var self = this;

    return $.Deferred(function (deferred) {
        self.getMinimumAndMaximumXAndYs().done(function (minMax) {
            var $svg = $(self.config.el.canvas).clone();
            var $finalSvg = $($svg.wrap('<div>').parent().html());

            $finalSvg.removeAttr('id class clip-path width height');
            $finalSvg.find('#wtf-clip').remove();

            // Need to do these in flat JS because otherwise jQuery will not keep the case...facepalm
            $finalSvg[0].setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid meet');
            $finalSvg[0].setAttributeNS(null, 'viewBox', minMax.toViewboxString());

            //this.minX, this.minY, this.width, this.height
            if (!!window.DEBUG_VIEWBOX) {
                var $frame = $('#viewbox-frame');
                if ($frame.length == 0) {
                    $frame = $('<div />');
                    $frame.attr('id', 'viewbox-frame');
                    $frame.appendTo($('body'));
                }

                $frame.css({
                    position: 'fixed',
                    top: minMax.minY,
                    left: 70 + minMax.minX,
                    width: minMax.width,
                    height: minMax.height,
                    border: '1px solid red',
                    zIndex: 999999
                });
            }

            deferred.resolve({
                svg: $finalSvg.wrap('<div>').parent().html(),
                dimensions: {
                    width: minMax.maxX - minMax.minX,
                    height: minMax.maxY - minMax.minY
                }
            });
        });
    });
};

/**
 * Remove all unnecessary attributes from the target logo item
 *
 * @param  {jQuery} $item Logo item
 */
GS.Editor.Helpers.prototype.cleanupSvgLogoItem = function ($item) {
    $item
        .removeAttr('data-item-type')
        .removeAttr('data-item')
        .removeAttr('id')
        .removeAttr('class');

    $item
        .find(this.config.el.logoItemInner)
        .removeAttr('class');
};

/**
 * Draw the preview of the SVG on the preview's template's canvas elements
 *
 * @param  {Object} svgCode SVG Code including dimensions
 * @param  {jQuery} $parent The preview parent element
 */
GS.Editor.Helpers.prototype.drawPreview = function (svgCode, $parent) {
    $parent.find('.svg-render-target').each(function () {
        var $target = $(this);

        $target.html(svgCode.svg);
    });
};

/**
 * Creates the logo item's data structure (Duh)
 *
 * @return {Object} The logo item's data
 */
GS.Editor.Helpers.prototype.createItemDataStructure = function ($item) {
    var logoItemData = {
        transforms: {
            dimensions: {
                width: 0,
                height: 0
            },
            translate: {
                x: 0,
                y: 0
            },
            scale: {
                x: 1,
                y: 1
            },
            rotate: {
                a: 0,
                x: 0,
                y: 0
            }
        }
    };

    $item.data(this.config.attributes.logoItemData, logoItemData);

    return logoItemData;
};

/**
 * Return the current data of the target logo item
 *
 * @param  {jQuery} $item Logo item
 * @return {Object}       Logo item data (dimensions, position etc)
 */
GS.Editor.Helpers.prototype.getItemData = function ($item) {
    return $item.data(this.config.attributes.logoItemData);
};

/**
 * Update a logo item's transform data after a position/rotation change
 *
 * @param  {jQuery} $item Logo item
 * @param  {Object} data  The transform data to be saved
 * @return {Object}       Helpers instance
 */
GS.Editor.Helpers.prototype.storeItemTransformsData = function ($item, data) {
    var currentData = $item.data(this.config.attributes.logoItemData).transforms || {};

    for (var prop in data) {
        if (data[prop] === false) {
            data[prop] = $item.data(this.config.attributes.logoItemData).transforms[prop];
        }

        currentData[prop] = data[prop];
    }

    return this;
};

/**
 * Get the current dimensions of our canvas (editor)
 *
 * @return {Object} Canvas/editor dimensions
 */
GS.Editor.Helpers.prototype.getCanvasDimensions = function () {
    return {
        width: $(this.config.el.editor).width(),
        height: $(this.config.el.editor).height()
    };
};

GS.Editor.Helpers.prototype.getItemDimensions = function ($item) {
    var defaultBBox = {
        height: 0,
        width: 0,
        x: 0,
        y: 0,
        style: {}
    };

    var bbox;
    try {
        bbox = $item.length && $item.length > 0 ? $item[0].getBBox() : defaultBBox;
    } catch (e) {
        bbox = defaultBBox;
    }

    return bbox;
};

/**
 * Get the dimensions of the given
 * logo item and also store them
 *
 * @param  {jQuery} $item Logo item
 * @param {Object} dimensions Logo item dimensions
 * @return {Object} Logo item dimensions
 */
GS.Editor.Helpers.prototype.getAndStoreItemDimensions = function ($item, dimensions) {
    dimensions = dimensions || this.getItemDimensions($item);
    var storedData = this.getItemData($item).transforms || this.createItemDataStructure($item).transforms;

    storedData.dimensions.width = dimensions.width;
    storedData.dimensions.height = dimensions.height;

    return {
        width: dimensions.width,
        height: dimensions.height
    };
};

/**
 * Get the translate of the current logo item
 *
 * @param  {jQuery}  $item The selected logo item
 * @return {Object}  Current translate
 */
GS.Editor.Helpers.prototype.getItemTranslate = function ($item) {
    var storedData = this.getItemData($item).transforms;

    return {
        x: storedData.translate.x,
        y: storedData.translate.y
    };
};

/**
 * Center the position of the logo items after the onboarding process
 */
GS.Editor.Helpers.prototype.carefullyPositionItems = function () {
    var self = this;
    var isIE = this.isIE();

    // Caching our elements
    var $image = $('[data-item="Image"]');
    //noinspection JSJQueryEfficiency
    var $business = $('[data-item="Business"]').length > 0 ? $('[data-item="Business"]') : false;
    //noinspection JSJQueryEfficiency
    var $tagline = $('[data-item="Tagline"]').length > 0 ? $('[data-item="Tagline"]') : false;

    var imageDimensions = this.getAndStoreItemDimensions($image);
    var businessDimensions = this.getAndStoreItemDimensions($business);

    // Creating new vars to update position and shit
    var topImagePosition = ($(this.config.el.editor).innerHeight() / 2) - 100;
    var leftImagePosition;
    var topBusinessPosition;
    var topTaglinePosition;
    var leftBusinessPosition = ($(this.config.el.editor).innerWidth() / 2) - (businessDimensions.width / 2);
    var newImageScale;
    var newImageWidth;
    var newImageHeight;

    // Max dimension (either width or height) should be 120px
    if (imageDimensions.width >= imageDimensions.height) {
        newImageScale = (120 / imageDimensions.width);
        newImageWidth = 120;
        newImageHeight = imageDimensions.height * newImageScale;
    } else {
        newImageScale = (120 / imageDimensions.height);
        newImageHeight = 120;
        newImageWidth = imageDimensions.width * newImageScale;
    }

    var $inner = $image.find('.logo__item__inner');
    var factor = { x: 1, y: 1 };

    try {
        factor.x = $inner.length && $inner.length > 0 ? $inner[0].getBBox().x : 1;
    } catch (e) {
        factor.x = 1;
    }

    try {
        factor.y = $inner.length && $inner.length > 0 ? $inner[0].getBBox().y : 1;
    } catch (e) {
        factor.y = 1;
    }

    leftImagePosition = ($(this.config.el.editor).innerWidth() / 2) - (newImageWidth / 2) - (factor.x * newImageScale);
    topBusinessPosition = topImagePosition + newImageHeight + (factor.y * newImageScale) + businessDimensions.height;
    topTaglinePosition = topBusinessPosition + 5;

    // Position our image
    $(this.config.el.editor).trigger(GS.Editor.Events.Transformations.Update, [
        {
            item: $image,
            transforms: {
                dimensions: {
                    width: newImageWidth,
                    height: newImageHeight
                },
                translate: {
                    x: leftImagePosition,
                    y: topImagePosition
                },
                scale: {
                    x: newImageScale,
                    y: newImageScale
                },
                rotate: false
            }
        }
    ]);

    // Position our business
    $(this.config.el.editor).trigger(GS.Editor.Events.Transformations.Update, [
        {
            item: $business,
            transforms: {
                dimensions: {
                    width: 0,
                    height: 0
                },
                translate: {
                    x: leftBusinessPosition,
                    y: topBusinessPosition
                },
                scale: false,
                rotate: false
            }
        }
    ]);

    if ($tagline !== false) {
        $tagline.each(function (index) {
            var taglineDimensions = self.getAndStoreItemDimensions($(this));
            var leftTaglinePosition = ($(self.config.el.editor).innerWidth() / 2) - (taglineDimensions.width / 2);
            topTaglinePosition = topTaglinePosition + taglineDimensions.height;

            $(self.config.el.editor).trigger(GS.Editor.Events.Transformations.Update, [
                {
                    item: $($tagline[index]),
                    transforms: {
                        dimensions: {
                            width: 0,
                            height: 0
                        },
                        translate: {
                            x: leftTaglinePosition,
                            y: topTaglinePosition
                        },
                        scale: false,
                        rotate: false
                    }
                }
            ]);
        });
    }
};

/**
 * Returns the distance (x & y) since mousemove
 *
 * @param  {Object} initial Initial event (mousedown)
 * @param  {Object} current Current event (mousemove)
 * @return {Object}         Distance
 */
GS.Editor.Helpers.prototype.getMousemoveDistance = function (initialEv, currentEv) {
    return {
        x: currentEv.pageX - initialEv.pageX,
        y: currentEv.pageY - initialEv.pageY
    };
};

/**
 * What is says
 *
 * @param  {Number} angle The angle ...
 * @return {Number}       The rad ...
 */
GS.Editor.Helpers.prototype.getRadFromAngle = function (angle) {
    return angle * (Math.PI / 180)
};

/**
 * Get the final X and Y when we know the distance from a point and the target angle
 *
 * @param  {Number} distance The target distance
 * @param  {Number} angle    The target angle
 * @return {Object}          Final points
 */
GS.Editor.Helpers.prototype.getPointFromDistanceAndAngle = function (distance, angle) {
    distance = parseInt(distance, 10);
    angle = parseInt(angle, 10);

    var xv = distance * Math.cos(this.getRadFromAngle(angle));
    var yv = distance * Math.sin(this.getRadFromAngle(angle));

    return {
        x: xv.toFixed(2),
        y: yv.toFixed(2)
    }
};

GS.Editor.Helpers.prototype.rgb2hex = function (rgb) {
    rgb = rgb.replace(';', '').trim().match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

    if (rgb && rgb.length === 4) {
        return '#' +
            ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2);
    } else {
        return '';
    }
};

/**
 * Submits an event to GA
 *
 * @param {String} eventName
 */
GS.Editor.Helpers.prototype.submitGaEvent = function (eventName) {
    if (typeof ga === 'function') {
        ga('send', 'event', 'builder', eventName);
        console.log(">>> GA sent: " + eventName);
    }
};

/**
 * Toggles the "working" overlay with optional text
 *
 * @param {string} text
 */
GS.Editor.Helpers.prototype.toggleWorkingOverlay = function (text) {
    var $overlay = $(this.config.el.overlay);

    $overlay.children('h2').remove();

    if (!text && $overlay.hasClass(this.config.coreClasses.overlayWorking)) {
        $overlay.removeClass(this.config.coreClasses.overlayWorking);

        return;
    }

    if (!!text && text.length > 0) {
        $overlay.append('<h2>' + text + '</h2>');
    }

    $overlay.addClass(this.config.coreClasses.overlayWorking);
};
;/* -----------------------------------------
 Logo Editor Transformation module
 translate, scale, rotate items (and more...? Maybe...)

 @author Konstantinos Vasileiou <kostas@neverbland.com>
 @copyrights Neverbland 2014
 ----------------------------------------- */

/**
 * Editor Transformation constructor
 * @param {Object} config  Editor config
 * @param {Object} helpers Editor helpers
 */
GS.Editor.Transformation = function(config, helpers) {
    this.config = config;
    this.helpers = helpers;

    this.registerEvents();
};

GS.Editor.Transformation.prototype.registerEvents = function() {
    console.log('> Registered transformation events');

    $(this.config.el.editor).on(GS.Editor.Events.Transformations.Updated, function(ev, data) {
        this.transform(data.item);
    }.bind(this));
};

/**
 * Core method that applies all the transformations
 * to the target logo item
 *
 * @param  {jQuery} $item Logo item
 */
GS.Editor.Transformation.prototype.transform = function($item) {
    var self = this;
    var itemDataTransforms = this.helpers.getItemData($item).transforms;

    $item.find(this.config.el.logoItemInner).attr({
        transform: self.helpers.buildTransform(itemDataTransforms)
    });
};
;/* -----------------------------------------
 Editor tooltip module

 @author Konstantinos Vasileiou <kostas@neverbland.com>
 @copyrights Neverbland 2014
 ----------------------------------------- */

/**
 * Tooltip constructor

 * @param {Object} options Custom initialization options
 * @param {Object} helpers Editor helpers
 */
GS.Editor.Tooltip = function (options, helpers) {
    this.options = options || {};

    this.defaults = {
        el: {
            // Main tooltip element
            tooltip: '.tooltip',

            // Element(s) that trigger(s) the tooltip
            trigger: '[data-tooltip]'
        },
        coreClasses: {
            active: 'tooltip--active'
        },
        attributes: {
            tooltip: 'tooltip'
        },
        settings: {
            // Placement offsets for the tooltip element
            offsetTop: 0,
            offsetLeft: 20,
            active: true
        }
    };

    this.helpers = helpers;

    // Merging user options with plugin defaults
    this.config = $.extend(true, {}, this.defaults, this.options);

    this.initialize();
};

GS.Editor.Tooltip.prototype.initialize = function () {
    console.log('> Initialized tooltips');

    this.createTooltipElement();
    this.registerEvents();
};

GS.Editor.Tooltip.prototype.registerEvents = function () {
    var self = this;

    // Don't do anything for phones.
    if (self.helpers.isDevice('phone')) {
        return;
    }

    $body.on('mouseenter', this.config.el.trigger, function (ev) {
        if (self.config.settings.active === true) {
            self.constructAndShow($(this));
        }
    });

    $body.on('mouseleave', this.config.el.trigger, function (ev) {
        $(self.config.el.tooltip).removeClass(self.config.coreClasses.active);
    });

    $(this.config.el.editor).on(GS.Editor.Events.Sidebar.Expanded, function (ev) {
        self.config.settings.active = false;

        self.hideTooltip();
    });

    $(this.config.el.editor).on(GS.Editor.Events.Sidebar.Collapsed, function (ev) {
        self.config.settings.active = true;
    });
};

/**
 * Generate tooltip when initializing for the first time
 */
GS.Editor.Tooltip.prototype.createTooltipElement = function () {
    var el = document.createElement('div'); // faster than jQ equivalent, though probably negligible

    el.className = this.helpers.getRawName(this.config.el.tooltip);
    document.body.appendChild(el);
};

/**
 * Populate the tooltip with data,
 * position it and finally show it
 *
 * @param  {jQuery} $target The target element that triggers the tooltip
 */
GS.Editor.Tooltip.prototype.constructAndShow = function ($target) {
    var $tooltip = $(this.config.el.tooltip);
    var targetContent = $target.data(this.config.attributes.tooltip);
    var targetPos = $target[0].getBoundingClientRect();

    $tooltip
        .text(targetContent)
        .css({
            top: targetPos.top + (targetPos.height / 2) - ($tooltip.outerHeight() / 2) + this.config.settings.offsetTop,
            left: targetPos.left + targetPos.width + this.config.settings.offsetLeft
        })
        .addClass(this.config.coreClasses.active);
};

GS.Editor.Tooltip.prototype.hideTooltip = function () {
    $(this.config.el.tooltip).removeClass(this.config.coreClasses.active);
};
;/* -----------------------------------------
 Logo Editor Onboarding module

 @author Konstantinos Vasileiou <kostas@neverbland.com>
 @copyrights Neverbland 2014
 ----------------------------------------- */

/**
 * Helpers class for stages.
 * @param {string} event
 * @constructor
 */
var OnboardingStage = function (event) {
    this._event = event;
    this._setup = function () {
    };
    this._action = null;

    return this;
};

OnboardingStage.prototype.event = function () {
    return this._event;
};

OnboardingStage.prototype.setup = function (setup) {
    if (!setup) {
        this._setup();
    } else {
        this._setup = setup;
    }

    return this;
};

OnboardingStage.prototype.action = function (action) {
    if (!action) {
        return this._action;
    }

    this._action = action;

    return this;
};

/**
 * Onboarding constructor
 *
 * @param {Object}  options Sidebar initialization options
 * @param {Helpers} helpers Editor helpers
 * @param {Sidebar} sidebar Editor sidebar
 * @param {Core}    core    Editor core
 */
GS.Editor.Onboarding = function (options, helpers, sidebar, core) {
    this.options = options || {};

    this.sidebar = sidebar
    this.helpers = helpers;
    this.core = core;

    this.defaults = {
        el: {
            onboarding: '.onboarding',
            onboardingGuide: {
                main: '.onboarding__guide',
                stageSelector: '.onboarding__guide--step-',
                label: '.onboarding__guide__label',
                title: '.onboarding__guide__title',
                description: '.onboarding__guide__description',
                button: '.onboarding__guide__button'
            },
            mobileOnboardingGuide: {
                main: '.onboarding--mobile__guide',
                stageSelector: '.onboarding--mobile__guide--step-',
                label: '.onboarding__guide--mobile__label',
                title: '.onboarding__guide--mobile__title',
                description: '.onboarding--mobile__guide__description',
                button: '.onboarding--mobile__guide__button'
            },
            graphicTip: {
                main: '.graphic-tip',
                button: '.graphic-tip__button'
            }
        },
        coreClasses: {
            onboardingActive: 'onboarding--active',
            onboardingGuideActive: 'onboarding__guide--active',
            graphicTipActive: 'graphic-tip--active',
            onboardingStageOne: 'onboarding--stage-1',
            onboardingStageTwo: 'onboarding--stage-2',
            onboardingStageThree: 'onboarding--stage-3',
            onboardingDone: 'onboarding--finished'
        },
        attributes: {}
    };

    var self = this;

    this.stages = [
        (new OnboardingStage(GS.Editor.Events.GA.Stage1))
            .action(function () {
                var $business = $('[data-onboarding-input="identity-business"]');

                if ($business.val().length > 0) {
                    $(GSEditor.importer.config.el.triggers.importerBusiness).val($business.val());

                    var $tagline = $('[data-onboarding-input="identity-tagline"]');
                    if ($tagline.val().length > 0) {
                        self.sidebar.addNewTagline($tagline.val());
                    }

                    return true;
                }

                $business.focus();

                return false;
            }),
        (new OnboardingStage(GS.Editor.Events.GA.Stage2))
            .setup(function () {
                if (self.helpers.isDevice('phone')) {
                    $('body').on('change', '.categories', function() {
                        console.log('watpls');
                        self.finishStage(1);
                    });
                } else {
                    $('.' + self.config.coreClasses.onboardingActive).on('click.onboarding', '.categories__category', function (ev, onboarding) {
                        self.finishStage(1)
                    }.bind(this));
                }

                $('.menu--images').trigger('click', [true]);
            })
            .action(function () {
                console.log('finish');
                if (!self.helpers.isDevice('phone')) {
                    if ($('.categories__category--active').length === 0) {
                        $('[data-category-id="0"]').trigger('click', [true]);
                    }
                }

                return true;
            }),
        (new OnboardingStage(GS.Editor.Events.GA.Stage3))
            .action(function () {
                self.doEnd();
            })
    ];

    this.stageIndex = 0;

    // Merging configs
    this.config = $.extend(true, {}, this.defaults, this.options);
};

GS.Editor.Onboarding.prototype.initialize = function () {
    console.log('> Initialized onboarding');

    this.doStart();

    this.registerEvents();
};

/**
 * Initialize the onboarding process
 *
 * @return {Object} Onboarding instance
 */
GS.Editor.Onboarding.prototype.doStart = function () {
    $body
        .addClass(this.config.coreClasses.onboardingActive)
        .addClass(this.config.coreClasses.onboardingStageOne);

    if (this.helpers.isDevice('phone')) {
        $body.addClass('onboarding--active--mobile');
    }

    setTimeout(function () {
        this.doStage(0);

        setTimeout(function () {
            $('[data-onboarding-input="identity-business"]').focus();
        }.bind(this), 500);
    }.bind(this), 300);
};

/**
 *
 */
GS.Editor.Onboarding.prototype.registerEvents = function () {
    $('.onboarding__skip').one('click.onboarding', function (ev, onboarding) {
        this.skip();
    }.bind(this));

    $body.on('click', this.config.el.graphicTip.button, function (ev) {
        $(ev.target)
            .closest(this.config.el.graphicTip.main)
            .removeClass(this.config.coreClasses.graphicTipActive);
    }.bind(this));
};

/**
 * Execute the target stage
 *
 * @param  {Number} stageIndex Target stage index to execute
 * @return {Object}            Onboarding instance
 */
GS.Editor.Onboarding.prototype.doStage = function (stageIndex) {
    // Updating the current stage
    stageIndex = Number(stageIndex);

    var self = this;

    self.stageIndex = stageIndex;

    if (this.stageIndex === this.stages.length) {
        self.doEnd();

        return;
    }

    if (!this.stages[stageIndex]) {
        throw 'No such stage: ' + stageIndex;
    }

    $body
        .removeClass('onboarding--stage-' + stageIndex)
        .addClass('onboarding--stage-' + (stageIndex + 1));

    $('[data-onboarding-stage]').removeClass(self.config.coreClasses.onboardingGuideActive);
    $('[data-onboarding-stage="' + stageIndex + '"]').addClass(self.config.coreClasses.onboardingGuideActive);

    /** @var {OnboardingStage} stage */
    var stage = self.stages[stageIndex];
    stage.setup();

    var $trigger = $('[data-onboarding-finish-stage="' + stageIndex + '"]');

    $trigger.on('click.onboarding', function () {
        $trigger.off('click.onboarding');

        self.finishStage(stageIndex);
    })

    if (stage.event()) {
        self.helpers.submitGaEvent(stage.event());
    }
};

/**
 * Finish the target stage
 *
 * @param  {Number} stageIndex Target stage index to execute
 * @return {Object}            Onboarding instance
 */
GS.Editor.Onboarding.prototype.finishStage = function (stageIndex) {
    // Updating the current stage
    stageIndex = Number(stageIndex);

    var self = this;

    self.stageIndex = stageIndex;

    if (this.stageIndex === this.stages.length) {
        self.doEnd();

        return;
    }

    if (!this.stages[stageIndex]) {
        throw 'No such stage: ' + stageIndex;
    }

    /** @var {OnboardingStage} stage */
    var stage = this.stages[stageIndex];

    if (stage.action()() === true) {
        self.doStage(stageIndex + 1);
    }
};

/**
 * Initialize the onboarding process
 *
 * @return {Object} Onboarding instance
 */
GS.Editor.Onboarding.prototype.doHide = function () {
    $body
        .removeClass(this.config.coreClasses.onboardingActive)
        .removeClass(this.config.coreClasses.onboardingStageOne);
};

/**
 * End the onboarding process and cleanup the mess
 */
GS.Editor.Onboarding.prototype.doEnd = function () {
    var self = this;

    $('[data-onboarding-stage]').removeClass(self.config.coreClasses.onboardingGuideActive);

    var e = $.Event('keydown', { which: 13, keyCode: 13 });

    $(GSEditor.importer.config.el.triggers.importerBusiness).trigger(e);

    $(GSEditor.importer.config.el.triggers.importerTagline).each(function () {
        e = $.Event('keydown', { which: 13, keyCode: 13 });

        $(this).trigger(e);
    });

    // Removing the active onboarding class, only if
    // we're done selecting a graphic for our logo.
    $body.one('click', '.logo-listing__logo,.logo-listing--mobile__logo', function () {
        $body
            .removeClass(this.config.coreClasses.onboardingActive)
            .addClass(this.config.coreClasses.onboardingDone)
        ;

        setTimeout(function () {
            $body.trigger(GS.Editor.Events.Sidebar.Calculate);
        }.bind(this), 1000);
    }.bind(this));

    $(this.config.el.editor).trigger(GS.Editor.Events.History.Enable);

    setTimeout(function () {
        $(this.config.el.editor).trigger(GS.Editor.Events.History.Update);
        $(this.config.el.onboarding).remove();
        $(this.config.el.graphicTip.main).addClass(this.config.coreClasses.graphicTipActive);
    }.bind(this), 10);
};

/**
 * End the onboarding process, skipping any stages we haven't gone through yet.
 */
GS.Editor.Onboarding.prototype.skip = function () {
    $body
        .removeClass([
            this.config.coreClasses.onboardingActive,
            this.config.coreClasses.onboardingStageOne,
            this.config.coreClasses.onboardingStageTwo,
            this.config.coreClasses.onboardingStageThree
        ].join(' '))
        .addClass(this.config.coreClasses.onboardingDone)
    ;

    this.doEnd();

    setTimeout(function () {
        $body.trigger(GS.Editor.Events.Sidebar.Calculate);
    }.bind(this), 1500);
};
