
m4q.fn.extend({
    attr: function(name, value){
        if (this.length === 0) {
            return ;
        }

        if (!value) {
            return this[0].getAttribute(name);
        }

        this.each(function(el){
            el.setAttribute(name, value);
        });

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