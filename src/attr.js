
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