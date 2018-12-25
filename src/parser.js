
// TODO add scripts support
m4q.parseHTML = function(data, context){
    var base, singleTag;

    if (typeof data !== "string") {
        return [];
    }

    if (!context) {
        context = document.implementation.createHTMLDocument();
        base = context.createElement( "base" );
        base.href = document.location.href;
        context.head.appendChild( base );
    }

    singleTag = regexpSingleTag.exec(data);

    if (singleTag) {
        return [context.createElement(singleTag[1])];
    }

    context = context.body ? context.body : context;

    context.innerHTML = data;

    return m4q.merge([], context.childNodes);
};
