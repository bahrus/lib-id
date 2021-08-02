# li-bid

li-bid provides a repeating web component.  It extends [i-bid](https://github.com/bahrus/ib-id).  Whereas i-bid has [no support for light children](https://github.com/bahrus/ib-id#what-if-i-want-to-repeat-some-web-components-that-require-non-shadow-light-children), li-bid does.  Both i-bid and li-bid deviate from traditional repeating elements, in that the rendered content they produce is inserted adjacent to the i-bid/li-bid element.

The question is where to get the light children from for a repeating element?  Most repeating elements allow us / force us to define the structure of the light children from within the tag.  li-bid supports this as well, but we need to be explicit that that is our intent, since other alternative locations to pull in the light children from are also provided by li-bid.

li-bid provides basic support for dynamically setting attributes and interpolating inside tags.  It uses a fork of github's [template parts library](https://github.com/github/template-parts/) for this moustache-style binding.

li-bid borrows similar syntax and even the "reverse binding" function library (discussed later) used by [d-fine](https://github.com/bahrus/d-fine).  So as far as locating the template (or HTML Element) which needs repeated appending / binding, we can use the attribute/property from-child-template/fromChildTemplate, or fct/fct for short.

## Sample syntax I

The special template-id value of "innerTemplate" means just search inside for the template to use:

```html
<ul>
    <li>header</li>
    <li-bid from-child-template list='[{"msg": "hello 1"}, {"msg": "hello 2"}]'>
        <li>
            <template>
                <span>{{msg}}</span>
            </template>
        </li>
    </li-bid>
    <li>footer</li>
</ul>
```

produces:

```html
<ul>
    <li>header</li>
    <li-bid template-id=innerTemplate list='[{"msg": "hello 1"}, {"msg": "hello 2"}]' style="display:none;">
        <template>
            <span>{{msg}}</span>
        </template>
    </li-bid>
    <li>
        <span>hello 1</span>
    </li>
    <li>
        <span>hello 2</span>
    </li>    
    <li>footer</li>
</ul>
```

## Sample syntax II [TODO]

```html
<template id=message>
    <span>{{msg}}</span>
</template>
<ul>
    <li>header</li>
    <li-bid from=message list='[{"msg": "hello 1"}, {"msg": "hello 2"}]'></li-bid>
    <li>footer</li>
</ul>
```

Same results as before.

## Sample syntax III [TODO]

```html
<ul>
    <li><span id=message><a href="messages/all" data-bind='{"TextContent": "msg", "href": "messages/{{msgId}}"}'>Message of the day</a></span></li>
    <li-bid from=message bind-to=data-src bind-href-to= list='[{"msg": "hello 1", "msgId": 402203}, {"msg": "hello 2", "msgId": 204452}]'></li-bid>
    <li>Brought to you by Foot Blocker</li>
</ul>
```

produces:

```html
<ul>
    <li>Message of the day</li>
    <li-bid from=message bind-textContent-to=data-target list='[{"msg": "hello 1"}, {"msg": "hello 2"}]' style="display:none;"></li-bid>
    <li>
        <span>hello 1</span>
    </li>
    <li>
        <span>hello 2</span>
    </li>    
    <li>Brought to you by Foot Blocker</li>
</ul>
```



In this case, we've used the "from" attribute, which we treat as an ID / property to "UpShadowSearch" for.  Because the id matches a span element, not an HTML Template Element, the span element is "templified" in memory:

```html
<template>
    <span>{{msg}}</span>
</template>
```

The bind-to attribute indicates to find all matching attributes, and replace the inner content with a moustache placeholder.





## Sample syntax III

```html
<template id=light-children>
    <span>{{msg}}</span>
</template>
<ul>
    <li>header</li>
    <li-bid id=libid template-map-ids='{"li":"/light-children"}'></li-bid>
    <li>footer</li>
</ul>


<script>
    libid.list = [
        {msg: 'hello 1'},
        {msg: 'hello 2'},
        {msg: 'hello 3'},
        {msg: 'hello 4'}
    ];
    setTimeout(() => {
        libid.list = [
            {msg: 'hello 3'},
            {msg: 'hello 4'}
        ];
        setTimeout(() => {
            libid.list = [
                {msg: 'hello 1'},
                {msg: 'hello 2'},
                {msg: 'hello 3'},
                {msg: 'hello 4'}
            ];
        }, 10000);
    }, 10000);
</script>
```

## Sample syntax III [TODO]

### Binding to a server-rendered / editable datastream.

```html
<template id=light-children>
    <span>{{msg}}</span>
</template>
<ul>
    <li>header</li>
    <li-bid id=libid template-map-ids='{"li":"/light-children"}'>
        <templ-model>
            <obj-ml name=msg>hello 1</obj-ml>
            <obj-ml name=msg>hello 2</obj-ml>
            <obj-ml name=msg>hello 3</obj-ml>
            <obj-ml name=msg>hello 4</obj-ml>
        </templ-model>
        <p-u on=value-changed to=libid prop=list val=target.value clone></p-u>
    </li-bid>
    <li>footer</li>
</ul>
```


## Viewing the component locally

1.  Install git
2.  Clone or fork repo https://github.com/bahrus/repetir
3.  Install node
4.  Open command window from cloned location of step 2.
5.  Run command "npm run install"
6.  Run command "npm run serve"
7.  Open browser to http://localhost:3030/demo/dev

