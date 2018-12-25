
function camelCase(string){
    return string.replace( /-([a-z])/g, function(all, letter){
        return letter.toUpperCase();
    });
}

function isPlainObject( obj ) {
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

function isEmptyObject( obj ) {
    for (var name in obj ) {
        if (obj.hasOwnProperty(name)) return false;
    }
    return true;
}

function isArrayLike (target){
    return target instanceof Object && 'length' in target;
}
