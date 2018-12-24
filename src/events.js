
m4q.fn.extend({
    on: function(event, selector, handler){
        if (this.length === 0) {
            return;
        }
        if (typeof selector === "function") {
            handler = selector;
            this.items().forEach(function(el){
                el.addEventListener(event, handler);
            });
        } else {
            this.find(selector).on(event, handler);
        }

        return this;
    },

    off: function(event, selector){
        if (this.length === 0) {
            return;
        }
        if (!selector) {
            this[0].removeEventListener(event);
        } else {
            this.find(selector).off(event);
        }

        return this;
    },

    trigger: function(name, data){
        var e;
        if (this.length === 0) {
            return ;
        }
        e = new CustomEvent(name, data || {});
        this.items().forEach(function(el){
            el.dispatchEvent(e);
        });
        return this;
    }
});

m4q.ready = function(fn){
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
