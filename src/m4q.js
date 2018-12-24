;(function() {
    "use strict";

    var m4qVersion = "@VERSION";
    var regexpSingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

    var matches = Element.prototype.matches
        || Element.prototype.matchesSelector
        || Element.prototype.webkitMatchesSelector
        || Element.prototype.mozMatchesSelector
        || Element.prototype.msMatchesSelector
        || Element.prototype.oMatchesSelector;

    var m4q = function(selector, context){
        return new m4q.init(selector, context);
    };

    m4q.fn = m4q.prototype = {
        m4q: m4qVersion,
        constructor: m4q,
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
            var i, out = m4q();

            if (this.length === 0) {
                return ;
            }

            this.items().forEach(function(el){
                that.merge(out, m4q(selector, el.children[i]));
            });
            return out;
        },

        children: function(selector){
            var that = this;
            var i, out = m4q();
            this.items().forEach(function(el){
                for(i = 0; i < el.children.length; i++) {
                    that.merge(out, m4q(el.children[i]));
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
            var i, out = m4q();
            if (this.length === 0) {
                return;
            }
            this.items().forEach(function(el){
                if (el.parentNode) {
                    that.merge(out, m4q(el.parentNode));
                }
            });
            return selector ? out.filter(function(el){
                return matches.call(el, selector);
            }) : out;
        },

        siblings: function(selector){
            var that = this;
            var i, out = m4q();

            if (this.length === 0) {
                return ;
            }

            out = m4q();

            this.items().forEach(function(el){
                var elements = [].filter.call(el.parentNode.children, function(child){
                    return child !== el && (selector ? matches.call(child, selector) : true);
                });

                elements.forEach(function(el){
                    that.merge(out, m4q(el));
                })
            });
            return out;
        },

        prev: function(selector){
            var that = this;
            var i, out = m4q();

            if (this.length === 0) {
                return ;
            }

            out = m4q();

            this.items().forEach(function(el){
                while (el) {
                    el = el.previousElementSibling;
                    if (!el) break;
                    if (!selector) {
                        that.merge(out, m4q(el));
                    } else {
                        if (matches.call(el, selector)) {
                            that.merge(out, m4q(el));
                        }
                    }
                }
            });
            return out;
        },

        next: function(selector){
            var that = this;
            var i, out = m4q();

            if (this.length === 0) {
                return ;
            }

            out = m4q();

            this.items().forEach(function(el){
                while (el) {
                    el = el.nextElementSibling;
                    if (!el) break;
                    if (!selector) {
                        that.merge(out, m4q(el));
                    } else {
                        if (matches.call(el, selector)) {
                            that.merge(out, m4q(el));
                        }
                    }
                }
            });
            return out;
        },

        closest: function(selector){
            var that = this;
            var i, out = m4q();

            if (this.length === 0) {
                return ;
            }

            if (!selector) {
                return this.parent(selector);
            }

            out = m4q();

            this.items().forEach(function(el){
                while (el) {
                    el = el.parentElement;
                    if (!el) break;
                    if (matches.call(el, selector)) {
                        that.merge(out, m4q(el));
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
        m4q.prototype[method + "Class"] = function(cls){
            for(var i = 0 ; i < this.length; i++) {
                this[i].classList[method](cls);
            }
            return this;
        }
    });

    // TODO add scripts support
    m4q.parseHTML = function(data, context){
        var base, singleTag;

        if (typeof data !== "string") {
            return [];
        }

        if (!context) {
            context = document.implementation.createHTMLDocument();
            base = context.createElement( "base" );
            base.href = document.location.href;
            context.head.appendChild( base );
        }

        singleTag = regexpSingleTag.exec(data);

        if (singleTag) {
            return [context.createElement(singleTag[1])];
        }

        context = context.body ? context.body : context;

        context.innerHTML = data;

        return m4q().merge([], context.childNodes);
    };

    m4q.each = function(context, callback){
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

    m4q.ajax = function(params){
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
            m4q.each(function(name, value){
                xhr.setRequestHeader(name, value);
            });
        }

        xhr.open(params.method || 'GET', params.url, true);
        xhr.send(params.data);
    };

    ['get', 'post', 'put', 'patch', 'delete'].forEach(function(method){
        m4q[method] = function(url, data, success, error, dataType){
            return m4q.ajax({
                method: method.toUpperCase(),
                url: url,
                data: data,
                success: success,
                error: error,
                dataType: dataType
            });
        }
    });

    m4q.ready = function(fn){
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };

    m4q.init = function(selector, context){
        var parsed, singleTag;

        if (!selector) {
            return this;
        }

        if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
        }

        if (typeof selector === "string") {

            singleTag = regexpSingleTag.exec(selector);

            if (singleTag) {
                return m4q((context ? context : document).createElement(singleTag[1]));
            }

            parsed = m4q.parseHTML(selector, context);

            if (parsed[0].nodeType === 3) {
                selector = context ? context.querySelectorAll(selector) : document.querySelectorAll(selector);
                [].push.apply(this, selector);
            } else {
                m4q().merge(this, parsed);
            }
        }

        return this;
    };

    m4q.init.prototype = m4q.fn;

    window.m4q = window.$M = m4q;

})();