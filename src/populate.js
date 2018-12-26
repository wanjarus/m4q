if (!noGlobal) {
    window.m4q = window.$M = window.$ = m4q;
}

var _$ = window.$, _$M = window.$M;

m4q.noConflict = function() {
    if ( window.$ === m4q ) {window.$ = _$;}
    if ( window.$M === m4q ) {window.$M = _$M;}
    return m4q;
};