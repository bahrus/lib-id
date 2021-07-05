# li-bid

li-bid provides a repeating web component.  It extends [i-bid](https://github.com/bahrus/ib-id).  Whereas i-bid has [no support for light children](https://github.com/bahrus/ib-id#what-if-i-want-to-repeat-some-web-components-that-require-non-shadow-light-children), li-bid does.  It uses github's [template parts library](https://github.com/github/template-parts/) to populate the light children.

## Sample syntax I

```html
<ul>
    <li>header</li>
    <li-bid template-id=./message list='[{"msg": "hello 1"}, {"msg": "hello 2"}]'>
        <li>
            <template id=message>
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
    <li-bid template-id=./message list='[{"msg": "hello 1"}, {"msg": "hello 2"}]' style="display:none;">
        <template id=message>
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

## Sample syntax II

The special template-id value of "innerTemplate" means just search inside for the template to use:

```html
<ul>
    <li>header</li>
    <li-bid template-id=innerTemplate list='[{"msg": "hello 1"}, {"msg": "hello 2"}]'>
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

## Sample syntax II

```html
<template id=message>
    <span>{{msg}}</span>
</template>
<ul>
    <li>header</li>
    <li-bid template-id=./message list='[{"msg": "hello 1"}, {"msg": "hello 2"}]'></li-bid>
    <li>footer</li>
</ul>
```

Same results as before.

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

