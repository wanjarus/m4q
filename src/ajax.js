
m4q.ajax = function(params){
    var xhr = new XMLHttpRequest();

    xhr.onload = function(){
        if (xhr.status >= 200 && xhr.status < 300) {
            if (typeof params.success === "function") params.success(xhr.response, xhr.statusText, xhr);
        } else {
            if (typeof params.error === "function") params.error(xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function(){
        if (typeof params.error === "function") params.error(xhr.status, xhr.statusText);
    };

    if (params.headers) {
        m4q.each(function(name, value){
            xhr.setRequestHeader(name, value);
        });
    }

    xhr.open(params.method || 'GET', params.url, true);
    xhr.send(params.data);
};

['get', 'post', 'put', 'patch', 'delete'].forEach(function(method){
    m4q[method] = function(url, data, success, error, dataType){
        return m4q.ajax({
            method: method.toUpperCase(),
            url: url,
            data: data,
            success: success,
            error: error,
            dataType: dataType
        });
    }
});
