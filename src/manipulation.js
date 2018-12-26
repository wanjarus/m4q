
m4q.fn.extend({
    append: function(elements){
        return this.each(function(el){
            m4q.each(elements, function(element){
                el.appendChild(element);
            });
        })
    },

    appendTo: function(elements){
        m4q.each(elements, function(element){
            this.each(function(el){
                element.appendChild(el);
            });
        });
        return this;
    },

    prepend: function(elements){

    },

    prependTo: function(elements){

    },

    insertBefore: function(element){

    },

    insertAfter: function(element){

    },

    after: function(html){
        return this.each(function(el){
            el.insertAdjacentHTML('afterend', html);
        })
    },

    before: function(html){
        return this.each(function(el){
            el.insertAdjacentHTML('beforebegin', html);
        })
    },

    remove: function(selector){
        var i = 0, node, out = [];

        if (this.length === 0) {
            return ;
        }

        for ( ; ( node = this[ i ] ) != null; i++ ) {
            if (node.parentNode) {
                out.push(node.parentNode.removeChild(node));
            }
        }

        return selector ? out.filter(function(el){
            return matches.call(el, selector);
        }) : out;
    }
});