/*
 * m4q v1.0.0 (https://github.com/olton/m4q.git)
 * Copyright 2018 - 2018 by Sergey Pimenov
 * Helper for DOM manipulation for Metro 4 library
 * Licensed under MIT
 */

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
	
	    contains: function(selector){
	        return this.find(selector).length > 0;
	    },
	
	    is: function(selector){
	        return this.length === 0 ? undefined : matches.call(this[0], selector);
	    },
	
	    _size: function(property, value, unit){
	        if (this.length === 0) {
	            return ;
	        }
	
	        if (!value) {
	            return this[0][property];
	        }
	
	        if (!unit) {
	            unit = 'px';
	        }
	
	        this[0].style[property ===  'clientHeight' ? 'height' : 'width'] = parseInt(value)+unit;
	
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
	
	    empty: function(){
	        if (this.length === 0) {
	            return ;
	        }
	
	        return this[0].innerHTML === "";
	    },
	
	    filter: function(filterFunc){
	        return [].filter.call(this, filterFunc);
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
	
	m4q.extend = m4q.fn.extend = function(){
	    var options, name, copy,
	        target = arguments[ 0 ] || {},
	        i = 1,
	        length = arguments.length;
	
	    if ( typeof target !== "object" && typeof target !== "function" ) {
	        target = {};
	    }
	
	    if ( i === length ) {
	        target = this;
	        i--;
	    }
	
	    for ( ; i < length; i++ ) {
	
	        if ( ( options = arguments[ i ] ) != null ) {
	
	            for ( name in options ) {
	                target[ name ] = options[ name ];
	            }
	        }
	    }
	
	    return target;
	};
	
	m4q.merge = function( first, second ) {
	    var len = +second.length,
	        j = 0,
	        i = first.length;
	
	    for ( ; j < len; j++ ) {
	        first[ i++ ] = second[ j ];
	    }
	
	    first.length = i;
	
	    return first;
	};
	
	m4q.isArrayLike = function(target){
	    return target instanceof Object && 'length' in target;
	};
	
	m4q.type = function(obj){
	    return Object.prototype.toString.call(obj).replace(/^\[object (.+)]$/, '$1').toLowerCase();
	};
	
	m4q.isEmptyObject = function( obj ) {
	    for (var name in obj ) {
	        return false;
	    }
	    return true;
	};
	
	m4q.isPlainObject = function( obj ) {
	    var proto;
	
	    if ( !obj || toString.call( obj ) !== "[object Object]" ) {
	        return false;
	    }
	
	    proto = obj.prototype !== undefined;
	
	    if ( !proto ) {
	        return true;
	    }
	
	    return proto.constructor && typeof proto.constructor === "function";
	};
	
	m4q.proxy = function(fn, context){
	    fn.bind(context);
	};

	m4q.fn.extend({
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
	    }
	});
	
	m4q.ready = function(fn){
	    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
	        fn();
	    } else {
	        document.addEventListener('DOMContentLoaded', fn);
	    }
	};
	

	m4q.fn.extend({
	    html: function(value){
	        return this._property('innerHTML', value);
	    },
	
	    outerHTML: function(){
	        return this._property('outerHTML');
	    },
	
	    text: function(value){
	        return this._property('textContent', value);
	    },
	
	    innerText: function(value){
	        return this._property('innerText', value);
	    }
	});
	
	

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
	

	m4q.fn.extend({
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
	
	    clearClasses: function(){
	        return this.each(function(){
	            this.className = "";
	        });
	    }
	});
	
	['add', 'remove', 'toggle', 'contains'].forEach(function (method) {
	    m4q.fn[method + "Class"] = function(cls){
	        for(var i = 0 ; i < this.length; i++) {
	            this[i].classList[method](cls);
	        }
	        return this;
	    }
	});
	

	m4q.each = function(context, callback){
	    var index = 0;
	    if (m4q.isArrayLike(context)) {
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
	
	m4q.fn.extend({
	    each: function(callback){
	        [].forEach.call(this, function(el) {
	            callback.apply(el, arguments);
	        });
	
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
	
	    return m4q.merge([], context.childNodes);
	};
	

	m4q.fn.extend({
	    height: function(value, unit){
	        return this._size('clientHeight', value, unit);
	    },
	
	    width: function(value, unit){
	        return this._size('clientWidth', value, unit);
	    }
	});

	m4q.fn.extend({
	    find: function(selector){
	        var i, out = m4q();
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        this.items().forEach(function(el){
	            m4q.merge(out, m4q(selector, el.children[i]));
	        });
	        return out;
	    },
	
	    children: function(selector){
	        var i, out = m4q();
	        this.items().forEach(function(el){
	            for(i = 0; i < el.children.length; i++) {
	                m4q.merge(out, m4q(el.children[i]));
	            }
	        });
	        return selector ? out.filter(function(el){
	            return matches.call(el, selector);
	        }) : out;
	    },
	
	    parent: function(selector){
	        var out = m4q();
	        if (this.length === 0) {
	            return;
	        }
	        this.items().forEach(function(el){
	            if (el.parentNode) {
	                m4q.merge(out, m4q(el.parentNode));
	            }
	        });
	        return selector ? out.filter(function(el){
	            return matches.call(el, selector);
	        }) : out;
	    },
	
	    siblings: function(selector){
	        var out = m4q();
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        out = m4q();
	
	        this.items().forEach(function(el){
	            var elements = [].filter.call(el.parentNode.children, function(child){
	                return child !== el && (selector ? matches.call(child, selector) : true);
	            });
	
	            elements.forEach(function(el){
	                m4q.merge(out, m4q(el));
	            })
	        });
	        return out;
	    },
	
	    _siblings: function(direction, selector){
	        var out = m4q();
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        out = m4q();
	
	        this.items().forEach(function(el){
	            while (el) {
	                el = el[direction];
	                if (!el) break;
	                if (!selector) {
	                    m4q.merge(out, m4q(el));
	                } else {
	                    if (matches.call(el, selector)) {
	                        m4q.merge(out, m4q(el));
	                    }
	                }
	            }
	        });
	        return out;
	    },
	
	    prev: function(selector){
	        return this._siblings('previousElementSibling', selector);
	    },
	
	    next: function(selector){
	        return this._siblings('nextElementSibling', selector);
	    },
	
	    closest: function(selector){
	        var out = m4q();
	
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
	                    m4q.merge(out, m4q(el));
	                    return ;
	                }
	            }
	        });
	
	        return out;
	    },
	});

	m4q.fn.extend({
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
	
	    toggleAttr: function(a, v){
	        return this.each(function(){
	            var el = $(this);
	            if (v !== undefined) {
	                el.attr(a, v);
	            } else {
	                if (el.attr(a) !== undefined) {
	                    el.removeAttr(a);
	                } else {
	                    el.attr(a, ""+a);
	                }
	            }
	        });
	    }
	});

	m4q.init = function(selector, context){
	    var parsed, singleTag, elem;
	
	    if (!selector) {
	        return this;
	    }
	
	    if (selector.nodeType || selector === window) {
	        this[0] = selector;
	        this.length = 1;
	        return this;
	    }
	
	    if (typeof selector === "string") {
	
	        selector = selector.trim();
	
	        singleTag = regexpSingleTag.exec(selector);
	
	        if (singleTag) {
	            elem = (context && !m4q.isPlainObject(context) ? context : document).createElement(singleTag[1]);
	            if (m4q.isPlainObject(context)) {
	                for(var name in context) {
	                    elem.setAttribute(name, context[name]);
	                }
	            }
	            return m4q(elem);
	        }
	
	        parsed = m4q.parseHTML(selector, context);
	
	        if (parsed.length === 1 && parsed[0].nodeType === 3) {
	            selector = context ? context.querySelectorAll(selector) : document.querySelectorAll(selector);
	            [].push.apply(this, selector);
	        } else {
	            m4q.merge(this, parsed);
	        }
	    }
	
	    return this;
	};
	
	m4q.init.prototype = m4q.fn;
	

	window.m4q = window.$M = window.$ = m4q;
	
	return m4q; 
})();
