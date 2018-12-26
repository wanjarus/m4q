
// TODO add scripts support
m4q.parseHTML = function(data, context){
    var base, singleTag, result = [], ctx, _context;

    if (typeof data !== "string") {
        return [];
    }

    data = data.trim();

    if (!context) {
        ctx = document.implementation.createHTMLDocument("");
        base = ctx.createElement( "base" );
        base.href = document.location.href;
        ctx.head.appendChild( base );
        _context = ctx.body;
    } else {
        if (!isPlainObject(context)) {
            _context = context;
        } else {
            _context = document;
        }
    }

    singleTag = regexpSingleTag.exec(data);

    if (singleTag) {
        result.push(document.createElement(singleTag[1]));
    } else {
        _context.innerHTML = data;
        for(var i = 0; i < _context.childNodes.length; i++) {
            result.push(_context.childNodes[i]);
        }
    }

    if (context && isPlainObject(context)) {
        m4q.each(result,function(el){
            for(var name in context) {
                if (context.hasOwnProperty(name))
                    el.setAttribute(name, context[name]);
            }
        });
    }

    // console.log("---", data, singleTag, result);

    return result;
};
