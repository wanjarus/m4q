
m4q.init = function(selector, context){
    var parsed, singleTag;

    if (!selector) {
        return this;
    }

    if (selector.nodeType) {
        this[0] = selector;
        this.length = 1;
        return this;
    }

    if (typeof selector === "string") {

        singleTag = regexpSingleTag.exec(selector);

        if (singleTag) {
            return m4q((context ? context : document).createElement(singleTag[1]));
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
