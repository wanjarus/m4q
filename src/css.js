
m4q.fn.extend({
    css: function(o, v){
        var i, win, el;

        for(i = 0; i < this.length; i++) {
            el = this[i];
            if (typeof o === "object") {
                for (var key in o) {
                    el.style[key] = o[key];
                }
            } else if (typeof o === "string" && v !== undefined) {
                el.style[o] = v;
            } else if (typeof o === "string" && !v) {
                win = el.ownerDocument.defaultView;
                return  el.style[o] ?  el.style[o] : win.getComputedStyle(el, null)[o];
            }
        }

        return this;
    },

    addClass: function(){},
    removeClass: function(){},
    toggleClass: function(){},
    containsClass: function(){},

    clearClasses: function(){
        return this.each(function(){
            this.className = "";
        });
    }
});

['add', 'remove', 'toggle', 'contains'].forEach(function (method) {
    m4q.fn[method + "Class"] = function(cls){
        for(var i = 0 ; i < this.length; i++) {
            this[i].classList[method](cls);
        }
        return this;
    }
});
