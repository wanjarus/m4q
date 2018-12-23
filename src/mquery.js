;(function(win, doc) {
    "use strict";

    var mquery_version = "@VERSION";

    var matches = Element.prototype.matches
        || Element.prototype.matchesSelector
        || Element.prototype.webkitMatchesSelector
        || Element.prototype.mozMatchesSelector
        || Element.prototype.msMatchesSelector
        || Element.prototype.oMatchesSelector;

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

        merge: function( first, second ) {
            var len = +second.length,
                j = 0,
                i = first.length;

            for ( ; j < len; j++ ) {
                first[ i++ ] = second[ j ];
            }

            first.length = i;

            return first;
        },

        items: function(){
            var i, out = [];

            for (i = 0 ; i < this.length; i++ ) {
                out.push(this[i]);
            }

            return out;
        },

        get: function(index){
            if (!index) {
                return this.items();
            }

            return index < 0 ? this[ index + this.length ] : this[ index ];
        },

        find: function(selector){
            var that = this;
            var i, out = mQuery();

            if (this.length === 0) {
                return ;
            }

            this.items().forEach(function(el){
                that.merge(out, mQuery(selector, el.children[i]));
            });
            return out;
        },

        children: function(selector){
            var that = this;
            var i, out = mQuery();
            this.items().forEach(function(el){
                for(i = 0; i < el.children.length; i++) {
                    if (matches.call(el.children[i], selector)) {
                        that.merge(out, mQuery(el.children[i]));
                    }
                }
            });
            return out;
        },

        is: function(selector){
            var el;

            if (this.length === 0) {
                return ;
            }
            el = this[0];

            return matches.call(el, selector);
        },

        each: function(callback){
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

        on: function(event, delegate, callback){},
        off: function(event, delegate){},

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

    mQuery.each = function(context, callback){
        [].forEach.call(context, function(el) {
            callback.apply(el, arguments);
        });

        return context;
    };

    mQuery.ajax = function(params){
        var xhr = new XMLHttpRequest();

        xhr.onload = params.onsuccess;
        xhr.onerror = params.onerror;
        xhr.open(params.type, params.url);
        xhr.send(params.data);

        return this;
    };

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

    win.mQuery = win.$ = mQuery;

})(window, window.document);