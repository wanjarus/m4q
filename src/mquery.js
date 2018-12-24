;(function() {
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
                    that.merge(out, mQuery(el.children[i]));
                }
            });
            return selector ? out.filter(function(el){
                return matches.call(el, selector);
            }) : out;
        },

        contains: function(selector){
            return this.find(selector).length > 0;
        },

        is: function(selector){
            return this.length === 0 ? undefined : matches.call(this[0], selector);
        },

        parent: function(selector){
            var that = this;
            var i, out = mQuery();
            if (this.length === 0) {
                return;
            }
            this.items().forEach(function(el){
                if (el.parentNode) {
                    that.merge(out, mQuery(el.parentNode));
                }
            });
            return selector ? out.filter(function(el){
                return matches.call(el, selector);
            }) : out;
        },

        siblings: function(selector){
            var that = this;
            var i, out = mQuery();

            if (this.length === 0) {
                return ;
            }

            out = mQuery();

            this.items().forEach(function(el){
                var elements = [].filter.call(el.parentNode.children, function(child){
                    return child !== el && (selector ? matches.call(child, selector) : true);
                });

                elements.forEach(function(el){
                    that.merge(out, mQuery(el));
                })
            });
            return out;
        },

        prev: function(selector){
            var that = this;
            var i, out = mQuery();

            if (this.length === 0) {
                return ;
            }

            out = mQuery();

            this.items().forEach(function(el){
                while (el) {
                    el = el.previousElementSibling;
                    if (!el) break;
                    if (!selector) {
                        that.merge(out, mQuery(el));
                    } else {
                        if (matches.call(el, selector)) {
                            that.merge(out, mQuery(el));
                        }
                    }
                }
            });
            return out;
        },

        next: function(selector){
            var that = this;
            var i, out = mQuery();

            if (this.length === 0) {
                return ;
            }

            out = mQuery();

            this.items().forEach(function(el){
                while (el) {
                    el = el.nextElementSibling;
                    if (!el) break;
                    if (!selector) {
                        that.merge(out, mQuery(el));
                    } else {
                        if (matches.call(el, selector)) {
                            that.merge(out, mQuery(el));
                        }
                    }
                }
            });
            return out;
        },

        closest: function(selector){
            var that = this;
            var i, out = mQuery();

            if (this.length === 0) {
                return ;
            }

            if (!selector) {
                return this.parent(selector);
            }

            out = mQuery();

            this.items().forEach(function(el){
                while (el) {
                    el = el.parentElement;
                    if (!el) break;
                    if (matches.call(el, selector)) {
                        that.merge(out, mQuery(el));
                        return ;
                    }
                }
            });

            return out;
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

        _property: function(property, value){
            if (this.length === 0) {
                return ;
            }
            if (!value) {
                return this[0][property];
            }

            this[0][property] = value;

            return this;
        },

        outerHTML: function(){
            return this._property('outerHTML');
        },

        html: function(value){
            return this._property('innerHTML', value);
        },

        text: function(value){
            return this._property('innerText', value);
        },

        empty: function(){
            if (this.length === 0) {
                return ;
            }

            return this[0].innerHTML === "";
        },

        filter: function(filterFunc){
            return [].filter.call(this, filterFunc);
        },

        css: function(o, v){
            var i, win, el;

            for(i = 0; i < this.length; i++) {
                el = this[i];
                if (typeof o === "object") {
                    for (var key in o) {
                        el.style[key] = o[key];
                    }
                } else if (typeof o === "string" && v !== undefined) {
                    el.style[o] = v;
                } else if (typeof o === "string" && !v) {
                    win = el.ownerDocument.defaultView;
                    return  el.style[o] ?  el.style[o] : win.getComputedStyle(el, null)[o];
                }
            }

            return this;
        },

        addClass: function(){},
        removeClass: function(){},
        toggleClass: function(){},
        containsClass: function(){},

        on: function(event, selector, handler){
            if (this.length === 0) {
                return;
            }
            if (typeof selector === "function") {
                handler = selector;
                this.items().forEach(function(el){
                    el.addEventListener(event, handler);
                });
            } else {
                this.find(selector).on(event, handler);
            }

            return this;
        },

        off: function(event, selector){
            if (this.length === 0) {
                return;
            }
            if (!selector) {
                this[0].removeEventListener(event);
            } else {
                this.find(selector).off(event);
            }

            return this;
        },

        trigger: function(name, data){
            var e;
            if (this.length === 0) {
                return ;
            }
            e = new CustomEvent(name, data || {});
            this.items().forEach(function(el){
                el.dispatchEvent(e);
            });
            return this;
        },

        val: function(value){
            if (this.length === 0) {
                return ;
            }

            if (!value) {
                return this[0].value;
            }

            this.items().forEach(function(el){
                if (el.value) {
                    el.value = value;
                }
            });

            return this;
        },

        parseHTML: function(str){
            var doc = document.implementation.createHTMLDocument();
            doc.body.innerHTML = str;
            return doc.body.children;
        },

        remove: function(selector){
            var i = 0, node, out = [];

            if (this.length === 0) {
                return ;
            }

            for ( ; ( node = this[ i ] ) != null; i++ ) {
                if (node.parentNode) {
                    out.push(node.parentNode.removeChild(node));
                }
            }

            return selector ? out.filter(function(el){
                return matches.call(el, selector);
            }) : out;
        },

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
        var index = 0;
        if (context instanceof Object && 'length' in context) {
            [].forEach.call(context, function(el) {
                callback.apply(el, arguments);
            });
        } else {
            for(var el in context) {
                callback.apply(context[el], [el, context[el], index++]);
            }
        }

        return context;
    };

    mQuery.ajax = function(params){
        var xhr = new XMLHttpRequest();

        xhr.onload = function(){
            if (xhr.status >= 200 && xhr.status < 300) {
                if (typeof params.success === "function") params.success(xhr.response, xhr.statusText, xhr);
            } else {
                if (typeof params.error === "function") params.error(xhr.status, xhr.statusText);
            }
        };

        xhr.onerror = function(){
            if (typeof params.error === "function") params.error(xhr.status, xhr.statusText);
        };

        if (params.headers) {
            mQuery.each(function(name, value){
                xhr.setRequestHeader(name, value);
            });
        }

        xhr.open(params.method || 'GET', params.url, true);
        xhr.send(params.data);
    };

    ['get', 'post', 'put', 'patch', 'delete'].forEach(function(method){
        mQuery[method] = function(url, data, success, error, dataType){
            return mQuery.ajax({
                method: method.toUpperCase(),
                url: url,
                data: data,
                success: success,
                error: error,
                dataType: dataType
            });
        }
    });

    mQuery.ready = function(fn){
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
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
                return this.constructor(document.createElement(match[1]));
            }

            selector = context ? context.querySelectorAll(selector) : document.querySelectorAll(selector);
        }

        [].push.apply(this, selector);

        return this;
    };

    mQuery.init.prototype = mQuery.fn;

    window.mQuery = window.$ = mQuery;

})();