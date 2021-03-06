/*
 * m4q v1.0.0 (https://github.com/olton/m4q.git)
 * Copyright 2018 - 2018 by Sergey Pimenov
 * Helper for DOM manipulation for Metro 4 library
 * Licensed under MIT
 */

( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "m4q requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

	"use strict";
	

	function camelCase(string){
	    return string.replace( /-([a-z])/g, function(all, letter){
	        return letter.toUpperCase();
	    });
	}
	
	function isPlainObject( obj ) {
	    var proto;
	    if ( !obj || Object.prototype.toString.call( obj ) !== "[object Object]" ) {
	        return false;
	    }
	    proto = obj.prototype !== undefined;
	    if ( !proto ) {
	        return true;
	    }
	    return proto.constructor && typeof proto.constructor === "function";
	}
	
	function isEmptyObject( obj ) {
	    for (var name in obj ) {
	        if (obj.hasOwnProperty(name)) return false;
	    }
	    return true;
	}
	
	function isArrayLike (target){
	    return target instanceof Object && 'length' in target;
	}
	

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
	        if (index === undefined) {
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
	
	    _property: function(property, value){
	        if (this.length === 0) {
	            return ;
	        }
	        if (value === undefined) {
	            return this[0][property];
	        }
	
	        this.each(function(el){
	            el[property] = value;
	        });
	
	        return this;
	    },
	
	    empty: function(){
	        if (this.length === 0) {
	            return ;
	        }
	
	        this.each(function(el){
	            el.innerHTML = "";
	        });
	
	        return this;
	    },
	
	    filter: function(filterFunc){
	        return [].filter.call(this, filterFunc);
	    },
	
	    val: function(value){
	        return this._property("value", value);
	    },
	
	    hide: function(){
	        return this.each(function(el){
	            if (!!el.style.display) {
	                m4q(el).data('display', el.style.display);
	            }
	            el.style.display = 'none';
	        });
	    },
	
	    show: function(){
	        return this.each(function(el){
	            var display = m4q(el).data('display');
	            el.style.display = display ? display : '';
	        });
	    },
	
	    visible: function(mode){
	        if (mode === undefined) {
	            mode = true;
	        }
	        return this.each(function(el){
	            el.style.visibility = mode ? 'visible' : 'hidden';
	        });
	    },
	
	    push: [].push,
	    sort: [].sort,
	    splice: [].splice
	};
	
	m4q.extend = m4q.fn.extend = function(){
	    var options, name,
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
	                if (options.hasOwnProperty(name)) target[ name ] = options[ name ];
	            }
	        }
	    }
	
	    return target;
	};
	

	m4q.each = function(context, callback){
	    var index = 0;
	    if (isArrayLike(context)) {
	        [].forEach.call(context, function(el) {
	            callback.apply(el, arguments);
	        });
	    } else {
	        for(var el in context) {
	            if (context.hasOwnProperty(el))
	                callback.apply(context[el], [context[el], el,  index++]);
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
	

	function acceptData(owner){
	    return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	}
	
	function getData(data){
	    if (data === "true") return true;
	    if (data === "false") return false;
	    if (data === "null") return null;
	    if (data === +data + "") return +data;
	    if (/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(data)) return JSON.parse(data);
	    return data;
	}
	
	function dataAttr(elem, key, data){
	    var name;
	
	    if ( data === undefined && elem.nodeType === 1 ) {
	        name = "data-" + key.replace( /[A-Z]/g, "-$&" ).toLowerCase();
	        data = elem.getAttribute( name );
	
	        if ( typeof data === "string" ) {
	            try {
	                data = getData( data );
	            } catch ( e ) {}
	
	            dataSet.set( elem, key, data );
	        } else {
	            data = undefined;
	        }
	    }
	    return data;
	}
	
	var Data = function(ns){
	    this.expando = "DATASET:UID:" + ns.toUpperCase();
	    Data.uid++;
	};
	
	Data.uid = 1;
	
	Data.prototype = {
	    cache: function(owner){
	        var value = owner[this.expando];
	        if (!value) {
	            value = {};
	            if (acceptData(owner)) {
	                if (owner.nodeType) {
	                    owner[this.expando] = value;
	                } else {
	                    Object.defineProperty(owner, this.expando, {
	                        value: value,
	                        configurable: true
	                    });
	                }
	            }
	        }
	        return value;
	    },
	
	    set: function(owner, data, value){
	        var prop, cache = this.cache(owner);
	
	        if (typeof data === "string") {
	            cache[camelCase(data)] = value;
	        } else {
	            for (prop in data) {
	                if (data.hasOwnProperty(prop))
	                    cache[camelCase(prop)] = data[prop];
	            }
	        }
	        return cache;
	    },
	
	    get: function(owner, key){
	        return key === undefined ? this.cache(owner) : owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	    },
	
	    access: function(owner, key, value){
	        if (key === undefined || ((key && typeof key === "string") && value === undefined) ) {
	            return this.get(owner, key);
	        }
	        this.set(owner, key, value);
	        return value !== undefined ? value : key;
	    },
	
	    remove: function(owner, key){
	        var i, cache = owner[this.expando];
	        if (cache === undefined) {
	            return ;
	        }
	        if (key !== undefined) {
	            if ( Array.isArray( key ) ) {
	                key = key.map( camelCase );
	            } else {
	                key = camelCase( key );
	
	                key = key in cache ? [ key ] : ( key.match( /[^\x20\t\r\n\f]+/g ) || [] ); // ???
	            }
	
	            i = key.length;
	
	            while ( i-- ) {
	                delete cache[ key[ i ] ];
	            }
	        }
	        if ( key === undefined || isEmptyObject( cache ) ) {
	            if ( owner.nodeType ) {
	                owner[ this.expando ] = undefined;
	            } else {
	                delete owner[ this.expando ];
	            }
	        }
	        return true;
	    },
	
	    hasData: function(owner){
	        var cache = owner[ this.expando ];
	        return cache !== undefined && !isEmptyObject( cache );
	    }
	};
	
	var dataSet = new Data('Internal');
	
	m4q.extend({
	    Data: new Data('m4q'),
	
	    hasData: function(elem){
	        return dataSet.hasData(elem);
	    },
	
	    data: function(elem, name, data){
	        return dataSet.access(elem, name, data);
	    },
	
	    removeData: function(elem, name){
	        return dataSet.remove(elem, name);
	    }
	});
	
	m4q.fn.extend({
	    data: function(key, val){
	        var i, name, data,
	            elem = this[ 0 ],
	            attrs = elem && elem.attributes;
	
	        if ( key === undefined ) {
	            if ( this.length ) {
	                data = dataSet.get( elem );
	
	                if ( elem.nodeType === 1) {
	                    i = attrs.length;
	                    while ( i-- ) {
	                        if ( attrs[ i ] ) {
	                            name = attrs[ i ].name;
	                            if ( name.indexOf( "data-" ) === 0 ) {
	                                name = camelCase( name.slice( 5 ) );
	                                dataAttr( elem, name, data[ name ] );
	                            }
	                        }
	                    }
	                }
	            }
	
	            return data;
	        }
	
	        if (val === undefined) {
	            return dataSet.get(elem, key);
	        }
	
	        return this.each( function() {
	            dataSet.set( this, key, val );
	        } );
	    },
	
	    removeData: function( key ) {
	        return this.each( function() {
	            dataSet.remove( this, key );
	        } );
	    }
	});

	m4q.extend({
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
	
	    type: function(obj){
	        return Object.prototype.toString.call(obj).replace(/^\[object (.+)]$/, '$1').toLowerCase();
	    },
	
	    camelCase: function(string){return camelCase(string);},
	    isPlainObject: function(obj){return isPlainObject(obj);},
	    isEmptyObject: function(obj){return isEmptyObject(obj);},
	    isArrayLike: function(obj){return isArrayLike(obj);},
	    acceptData: function(owner){return acceptData(owner);},
	
	    dataSet: function(ns){
	        if (['INTERNAL', 'M4Q'].indexOf(ns.toUpperCase()) > -1) {
	            throw Error("You can not use reserved name for your dataset");
	        }
	        return new Data(ns);
	    }
	});
	
	

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
	        if (selector === undefined) {
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
	
	( "blur focus resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu load" )
	    .split( " " )
	    .forEach(
	    function( name ) {
	        m4q.fn[ name ] = function( data, fn ) {
	            return arguments.length > 0 ?
	                this.on( name, data, fn ) :
	                this.trigger( name );
	        };
	});
	
	m4q.fn.extend( {
	    hover: function( fnOver, fnOut ) {
	        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
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
	        var win;
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        if (typeof o === "string" && v === undefined) {
	            win = this[0].ownerDocument.defaultView;
	            return  this[0].style[o] ?  this[0].style[o] : win.getComputedStyle(this[0], null)[o];
	        }
	
	        this.each(function(el){
	            if (typeof o === "object") {
	                for (var key in o) {
	                    el.style[key] = o[key];
	                }
	            } else if (typeof o === "string") {
	                el.style[o] = v;
	            }
	        });
	
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
	        this.each(function(el){
	            el.classList[method](cls);
	        });
	
	        return this;
	    }
	});
	

	// TODO add scripts support
	m4q.parseHTML = function(data, context){
	    var base, singleTag, result = [], ctx, _context;
	
	    if (typeof data !== "string") {
	        return [];
	    }
	
	    data = data.trim();
	
	    if (!context) {
	        ctx = document.implementation.createHTMLDocument("");
	        base = ctx.createElement( "base" );
	        base.href = document.location.href;
	        ctx.head.appendChild( base );
	        _context = ctx.body;
	    } else {
	        if (!isPlainObject(context)) {
	            _context = context;
	        } else {
	            _context = document;
	        }
	    }
	
	    singleTag = regexpSingleTag.exec(data);
	
	    if (singleTag) {
	        result.push(document.createElement(singleTag[1]));
	    } else {
	        _context.innerHTML = data;
	        for(var i = 0; i < _context.childNodes.length; i++) {
	            result.push(_context.childNodes[i]);
	        }
	    }
	
	    if (context && isPlainObject(context)) {
	        m4q.each(result,function(el){
	            for(var name in context) {
	                if (context.hasOwnProperty(name))
	                    el.setAttribute(name, context[name]);
	            }
	        });
	    }
	
	    // console.log("---", data, singleTag, result);
	
	    return result;
	};
	

	m4q.fn.extend({
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
	
	    height: function(value, unit){
	        return this._size.call(this, 'clientHeight', value, unit);
	    },
	
	    width: function(value, unit){
	        return this._size.call(this, 'clientWidth', value, unit);
	    },
	
	    outerWidth: function(){
	        var el, size, style, result, value, unit = "px";
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        if (arguments.length > 0) {
	            value = arguments[0];
	        }
	
	        if (value !== undefined && typeof value !== "boolean") {
	            if (arguments[1]) {
	                unit = arguments[1];
	            }
	            return this.width(value, unit);
	        }
	
	        el = this[0];
	        size = el.offsetWidth;
	        style = getComputedStyle(el);
	        result = size + parseInt(style.marginLeft) + parseInt(style.marginRight);
	        return value === true ? result : size;
	    },
	
	    outerHeight: function(){
	        var el, size, style, result, value, unit = "px";
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        if (arguments.length > 0) {
	            value = arguments[0];
	        }
	
	        if (value !== undefined && typeof value !== "boolean") {
	            if (arguments[1]) {
	                unit = arguments[1];
	            }
	            return this.height(value, unit);
	        }
	
	        el = this[0];
	        size = el.offsetHeight;
	        style = getComputedStyle(el);
	        result = size + parseInt(style.marginTop) + parseInt(style.marginBottom);
	        return value === true ? result : size;
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
	    }
	});

	m4q.fn.extend({
	    attr: function(name, value){
	        var attributes = {};
	
	        if (this.length === 0) {
	            return ;
	        }
	
	        if (arguments.length === 0) {
	            m4q.each(this[0].attributes, function(a){
	                attributes[a.nodeName] = a.nodeValue;
	            });
	            return attributes;
	        }
	
	        if (name === undefined) {
	            return undefined;
	        }
	        if (name === null) {
	            return null;
	        }
	
	        if (name && !isPlainObject(name) && value === undefined) {
	            return this[0].getAttribute(name);
	        }
	
	        if (isPlainObject(name)) {
	            this.each(function(el){
	                for (var key in name) {
	                    if (name.hasOwnProperty(key))
	                        el.setAttribute(key, name[key]);
	                }
	            });
	        } else {
	            this.each(function(el){
	                el.setAttribute(name, value);
	            });
	        }
	
	        return this;
	    },
	
	    removeAttr: function(name){
	        if (this.length === 0) {
	            return ;
	        }
	        this.each(function(el){
	            if (el.hasAttribute(name)) el.removeAttribute(name);
	        });
	
	        return this;
	    },
	
	    toggleAttr: function(name, value){
	        if (this.length === 0) {
	            return ;
	        }
	        this.each(function(el){
	            if (value && !el.hasAttribute(name) || !el.getAttribute(name)) {
	                el.setAttribute(name, value);
	            } else {
	                el.removeAttribute(name);
	            }
	        });
	        return this;
	    }
	});

	m4q.extend({
	    proxy: function(fn, context){
	        if (typeof fn !== "function") {
	            return ;
	        }
	        if (context === undefined || context === null) {
	            context = this;
	        }
	        return fn.bind(context);
	    }
	});
	

	m4q.fn.extend({
	    append: function(elements){
	        return this.each(function(el){
	            m4q.each(elements, function(element){
	                el.appendChild(element);
	            });
	        })
	    },
	
	    appendTo: function(elements){
	        m4q.each(elements, function(element){
	            this.each(function(el){
	                element.appendChild(el);
	            });
	        });
	        return this;
	    },
	
	    prepend: function(elements){
	
	    },
	
	    prependTo: function(elements){
	
	    },
	
	    insertBefore: function(element){
	
	    },
	
	    insertAfter: function(element){
	
	    },
	
	    after: function(html){
	        return this.each(function(el){
	            el.insertAdjacentHTML('afterend', html);
	        })
	    },
	
	    before: function(html){
	        return this.each(function(el){
	            el.insertAdjacentHTML('beforebegin', html);
	        })
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
	    }
	});

	m4q.init = function(selector, context){
	    var parsed;
	
	    if (!selector) {
	        return this;
	    }
	
	    if (selector === "body") {
	        selector = document.body;
	    }
	
	    if (selector.nodeType || selector === window) {
	        this[0] = selector;
	        this.length = 1;
	        return this;
	    }
	
	    if (selector instanceof m4q) {
	        return selector;
	    }
	
	    if (typeof selector === "string") {
	
	        selector = selector.trim();
	
	        if (selector === "#" || selector === ".") {
	            throw new Error("Selector can't be # or .") ;
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
	
if (!noGlobal) {
	    window.m4q = window.$M = window.$ = m4q;
	}
	
	var _$ = window.$, _$M = window.$M;
	
	m4q.noConflict = function() {
	    if ( window.$ === m4q ) {window.$ = _$;}
	    if ( window.$M === m4q ) {window.$M = _$M;}
	    return m4q;
	};
	return m4q; 
});
