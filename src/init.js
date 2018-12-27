
m4q.init = function(selector, context){
    var parsed;

    if (!selector) {
        return this;
    }

    if (selector === "body") {
        selector = document.body;
    }

    if (selector.nodeType || selector === window) {
        this[0] = selector;
        this.length = 1;
        return this;
    }

    if (selector instanceof m4q) {
        return selector;
    }

    if (typeof selector === "string") {

        selector = selector.trim();

        if (selector === "#" || selector === ".") {
            throw new Error("Selector can't be # or .") ;
        }

        parsed = m4q.parseHTML(selector, context);

        if (parsed.length === 1 && parsed[0].nodeType === 3) {
            selector = context ? context.querySelectorAll(selector) : document.querySelectorAll(selector);
            [].push.apply(this, selector);
        } else {
            m4q.merge(this, parsed);
        }
    }

    return this;
};

m4q.init.prototype = m4q.fn;
