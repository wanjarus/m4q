
m4q.each = function(context, callback){
    var index = 0;
    if (isArrayLike(context)) {
        [].forEach.call(context, function(el) {
            callback.apply(el, arguments);
        });
    } else {
        for(var el in context) {
            if (context.hasOwnProperty(el))
                callback.apply(context[el], [context[el], el,  index++]);
        }
    }

    return context;
};

m4q.fn.extend({
    each: function(callback){
        [].forEach.call(this, function(el) {
            callback.apply(el, arguments);
        });

        return this;
    }
});
