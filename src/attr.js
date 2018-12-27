
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