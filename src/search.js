
m4q.fn.extend({
    find: function(selector){
        var i, out = m4q();

        if (this.length === 0) {
            return ;
        }

        this.items().forEach(function(el){
            m4q.merge(out, m4q(selector, el.children[i]));
        });
        return out;
    },

    children: function(selector){
        var i, out = m4q();
        this.items().forEach(function(el){
            for(i = 0; i < el.children.length; i++) {
                m4q.merge(out, m4q(el.children[i]));
            }
        });
        return selector ? out.filter(function(el){
            return matches.call(el, selector);
        }) : out;
    },

    parent: function(selector){
        var out = m4q();
        if (this.length === 0) {
            return;
        }
        this.items().forEach(function(el){
            if (el.parentNode) {
                m4q.merge(out, m4q(el.parentNode));
            }
        });
        return selector ? out.filter(function(el){
            return matches.call(el, selector);
        }) : out;
    },

    siblings: function(selector){
        var out = m4q();

        if (this.length === 0) {
            return ;
        }

        out = m4q();

        this.items().forEach(function(el){
            var elements = [].filter.call(el.parentNode.children, function(child){
                return child !== el && (selector ? matches.call(child, selector) : true);
            });

            elements.forEach(function(el){
                m4q.merge(out, m4q(el));
            })
        });
        return out;
    },

    _siblings: function(direction, selector){
        var out = m4q();

        if (this.length === 0) {
            return ;
        }

        out = m4q();

        this.items().forEach(function(el){
            while (el) {
                el = el[direction];
                if (!el) break;
                if (!selector) {
                    m4q.merge(out, m4q(el));
                } else {
                    if (matches.call(el, selector)) {
                        m4q.merge(out, m4q(el));
                    }
                }
            }
        });
        return out;
    },

    prev: function(selector){
        return this._siblings('previousElementSibling', selector);
    },

    next: function(selector){
        return this._siblings('nextElementSibling', selector);
    },

    closest: function(selector){
        var out = m4q();

        if (this.length === 0) {
            return ;
        }

        if (!selector) {
            return this.parent(selector);
        }

        out = m4q();

        this.items().forEach(function(el){
            while (el) {
                el = el.parentElement;
                if (!el) break;
                if (matches.call(el, selector)) {
                    m4q.merge(out, m4q(el));
                    return ;
                }
            }
        });

        return out;
    },
});