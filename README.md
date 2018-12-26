# m4q - DOM manipulation helper

The m4q is a small library for DOM manipulation. 
This helper designed for [Metro 4](https://metroui.org.ua) project to replace jQuery.
 
## Version 1.0.0 

#### Status
[![dependencies Status](https://david-dm.org/olton/m4q/status.svg)](https://david-dm.org/olton/m4q)
[![devDependencies Status](https://david-dm.org/olton/m4q/dev-status.svg)](https://david-dm.org/olton/m4q?type=dev)
[![JS gzip size](http://img.badgesize.io/olton/m4q/master/build/m4q.min.js?compression=gzip&label=JS+gzip)](https://github.com/olton/m4q/blob/master/build/m4q.min.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](https://github.com/olton/m4q/blob/master/LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/github/olton/m4q/badge.svg?targetFile=package.json)](https://snyk.io/test/github/olton/m4q?targetFile=package.json)
[![Maintainability](https://api.codeclimate.com/v1/badges/4201551c70bc4ee030b5/maintainability)](https://codeclimate.com/github/olton/m4q/maintainability)

### Features

#### Population
- `m4q()` - main
- `$M()` - shorten alias can be canceled via `m4q.noConflict()`
- `$()` - short alias can be canceled via `m4q.noConflict()`

#### Constructor
- `$("div")` - select by `tag name`
- `$(".div")` - select by `class name`
- `$("#div")` - select by `id`
- `$("<div>")` - create by `tag name`
- `$("<div>", context)` - create in context
- `$("<div>any_text_or_html</div>")` - create by `html`
- `$("<div>...</div><div>...</div>")` - create by `tags`
- `$("<div>", {...})` - create by tag with attributes as object
- `$($(...))` - create by `m4q` as argument

#### Finding
- `$(...).get(index)`
- `$(...).contains(selector)`
- `$(...).is(selector)`
- `$(...).find(selector)`
- `$(...).children(selector)`
- `$(...).parent(selector)`
- `$(...).closest(selector)`
- `$(...).siblings(selector)`
- `$(...).prev(selector)`
- `$(...).next(selector)`

#### Html and text
- `$(...).html()` - get `innerHTML`
- `$(...).html(value)` - set `innerHTML`
- `$(...).text()` - get `textContent`
- `$(...).text(value)` - set `textContent`
- `$(...).innerText()` - get `innerText`
- `$(...).innerText(value)` - set `innerText`
- `$(...).outerHTML()` - get `innerText`

#### CSS and classes
- `$(...).css(name)`
- `$(...).css(name, value)`
- `$(...).css({...})`
- `$(...).addClass(...)`
- `$(...).removeClass(...)`
- `$(...).toggleClass(...)`
- `$(...).containsClass(...)`
- `$(...).clearClasses()`

#### Events
- `$(...).on(event, selector, handler)`
- `$(...).off(event, selector)`
- `$(...).trigger(event, data)`
- `$(...).ready(callback)`

##### Event aliases
- `$(...).blur(selector, handler)`
- `$(...).focus(selector, handler)`
- `$(...).resize(selector, handler)`
- `$(...).scroll(selector, handler)`
- `$(...).click(selector, handler)`
- `$(...).dblclick(selector, handler)`
- `$(...).mousedown(selector, handler)`
- `$(...).mouseup(selector, handler)`
- `$(...).mousemove(selector, handler)`
- `$(...).mouseover(selector, handler)`
- `$(...).mouseout(selector, handler)`
- `$(...).mouseenter(selector, handler)`
- `$(...).mouseleave(selector, handler)`
- `$(...).change(selector, handler)`
- `$(...).select(selector, handler)`
- `$(...).submit(selector, handler)`
- `$(...).keydown(selector, handler)`
- `$(...).keypress(selector, handler)`
- `$(...).keyup(selector, handler)`
- `$(...).contextmenu(selector, handler)`

#### Ajax
- `$.ajax({...})`
- `$.get(url, data, success, error, dataType)` - alias for `$.ajax` for `GET` method
- `$.post(url, data, success, error, dataType)` - alias for `$.ajax` for `POST` method
- `$.put(url, data, success, error, dataType)` - alias for `$.ajax` for `PUT` method
- `$.patch(url, data, success, error, dataType)` - alias for `$.ajax` for `PATCH` method

#### Data
- `$.hasData(el)`
- `$.data(el, name, data)`
- `$.removeData(el, name)`
- `$(...).data()`
- `$(...).data(key, value)`
- `$(...).removeData(key)`