m4q.fn.extend({
    height: function(value, unit){
        return this._size('clientHeight', value, unit);
    },

    width: function(value, unit){
        return this._size('clientWidth', value, unit);
    }
});