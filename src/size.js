
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