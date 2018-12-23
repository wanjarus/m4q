;(function(win, doc) {
    "use strict";

    var mquery_version = "@VERSION";

    var mQuery = function(selector, context){
        return new mQuery.init(selector, context);
    };

    mQuery.fn = mQuery.prototype = {
        mquery: mquery_version,
        constructor: mQuery,
        length: 0,

        isArrayLike: function(target){
            return target instanceof Object && 'length' in target;
        },

        items: function(){
            var i, out = [];

            for (i = 0 ; i < this.length; i++ ) {
                out.push(this[i]);
            }

            return out;
        },

        find: function(selector){
            return this.length === 0 ? undefined : mQuery(selector, this[0]);
        },

        is: function(selector){
            var e = Element.prototype;
            var matches = e.matches || e.matchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector || e.oMatchesSelector;
            var el;

            if (this.length === 0) {
                return ;
            }

            el = this[0];

            return el.matches(selector);
        },

        each: function(callback){
            var i;

            [].forEach.call(this, function(el) {
                callback.apply(el, arguments);
            });

            return this;
        },

        attr: function(name, value){
            var el;

            if (this.length === 0) {
               return undefined;
            }

            el = this[0];

            if (!value) {
                return el.getAttribute(name);
            }

            el.setAttribute(name, value);

            return this;
        },

        html: function(value){
            var el;

            if (this.length === 0) {
                return ;
            }

            el = this[0];

            if (!value) {
                return el.innerHTML;
            }

            el.innerHTML = value;

            return this;
        },

        text: function(value){
            var el;

            if (this.length === 0) {
                return ;
            }

            el = this[0];

            if (!value) {
                return el.innerText;
            }

            el.innerText = value;

            return this;
        },

        css: function(o, v){

            [].forEach.call(this, function(el) {
                if (typeof o === "object") {
                    for (var key in o) {
                        el.style[key] = o[key];
                    }
                } else if (typeof o === "string" && v !== undefined) {
                    el.style[o] = v;
                }
            });

            return this;
        },

        addClass: function(){},
        removeClass: function(){},
        toggleClass: function(){},
        containsClass: function(){},

        on: function(){},
        off: function(){},

        push: [].push,
        sort: [].sort,
        splice: [].splice
    };

    ['add', 'remove', 'toggle', 'contains'].forEach(function (method) {
        mQuery.prototype[method + "Class"] = function(cls){
            for(var i = 0 ; i < this.length; i++) {
                this[i].classList[method](cls);
            }
            return this;
        }
    });

    mQuery.init = function(selector, context){
        var match;

        if (!selector) {
            return this;
        }

        if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
        }

        if (typeof selector === "string") {
            match = selector.match(/^<(.+?)\/?>$/);
            if (match) {
                return this.constructor(doc.createElement(match[1]));
            }

            selector = context ? context.querySelectorAll(selector) : doc.querySelectorAll(selector);
        }

        [].push.apply(this, selector);

        return this;
    };

    mQuery.init.prototype = mQuery.fn;

    win.mQuery = win.M = mQuery;

})(window, window.document);