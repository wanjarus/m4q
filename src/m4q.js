
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