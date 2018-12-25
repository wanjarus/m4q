
m4q.fn.extend({
    attr: function(name, value){
        var el;

        if (this.length === 0) {
            return ;
        }
        el = this[0];
        if (!value) {
            return el.getAttribute(name);
        }

        el.setAttribute(name, value);

        return this;
    },

    removeAttr: function(name){
        if (this.length === 0) {
            return ;
        }
        this.items().forEach(function(el){
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