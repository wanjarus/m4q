
m4q.init = function(selector, context){
    var parsed, singleTag, elem;

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

    if (typeof selector === "string") {

        selector = selector.trim();

        // singleTag = regexpSingleTag.exec(selector);
        //
        // console.log(selector, singleTag);
        //
        // if (singleTag) {
        //     elem = (context && !isPlainObject(context) ? context : document).createElement(singleTag[1]);
        //     if (isPlainObject(context)) {
        //         for(var name in context) {
        //             if (context.hasOwnProperty(name))
        //                 elem.setAttribute(name, context[name]);
        //         }
        //     }
        //     return m4q(elem);
        // }

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
