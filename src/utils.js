
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

    isArrayLike: function(target){
        return target instanceof Object && 'length' in target;
    },

    type: function(obj){
        return Object.prototype.toString.call(obj).replace(/^\[object (.+)]$/, '$1').toLowerCase();
    },

    isEmptyObject: function( obj ) {
        for (var name in obj ) {
            if (obj.hasOwnProperty(name)) return false;
        }
        return true;
    },

    isPlainObject: function( obj ) {
        var proto;

        if ( !obj || toString.call( obj ) !== "[object Object]" ) {
            return false;
        }

        proto = obj.prototype !== undefined;

        if ( !proto ) {
            return true;
        }

        return proto.constructor && typeof proto.constructor === "function";
    }
});

