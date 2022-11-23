# GrapesJS Style Gradient

This plugins adds a new `gradient` property to the GrapesJS's StyleManager by using [Grapick](https://github.com/artf/grapick)

[Demo](https://codepen.io/artf/full/bYwdQG/)

## Summary

* Plugin name: `grapesjs-style-gradient`
* Style type: `gradient` (the gradient picker input)
* Built-in Style property: `background-image` (composite type with gradient picker and direction/type selectors )





## Options

| Option | Description | Default |
|-|-|-
| `grapickOpts` | [Grapick options](https://github.com/artf/grapick#configurations). | `{}` |
| `colorPicker` |  Custom color picker, check [Grapick's repo](https://github.com/artf/grapick#add-custom-color-picker) to get more about it. | `undefined` |
| `selectEdgeStops` | Select, by default, the edge color stops of the gradient picker. | `true` |
| `styleType` | The id to assign for the gradient picker type. | `'gradient'` |
| `builtInType` | Built-in property name to use for the composite type with the gradient picker and direction/type selectors. | `'background-image'` |





## Download

* CDN
  * `https://unpkg.com/grapesjs-style-gradient`
* NPM
  * `npm i grapesjs-style-gradient`
* GIT
  * `git clone https://github.com/artf/grapesjs-style-gradient.git`





## Usage

Directly in the browser.
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<link href="https://unpkg.com/grapick/dist/grapick.min.css" rel="stylesheet">
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/grapesjs-style-gradient"></script>

<div id="gjs"></div>

<script type="text/javascript">
  const editor = grapesjs.init({
      container : '#gjs',
      // ...
      plugins: ['grapesjs-style-gradient'],
      pluginsOpts: {
        'grapesjs-style-gradient': {}
      }
  });
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import plugin from 'grapesjs-style-gradient';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  pluginsOpts: {
    [plugin]: { /* options */ }
  }
});

// Usage via API

// Add gradient picker as a single input
editor.StyleManager.addProperty('decorations', {
  type: 'gradient', // <- new type
  name: 'Gradient',
  property: 'background-image',
  defaults: 'none'
  full: true,
});

// Add the new background-image bulti-in type
editor.StyleManager.addProperty('decorations', {
  extend: 'background-image', // <- extend the built-in type
  name: 'Gradient Background',
});
```





## Development

Clone the repository

```sh
$ git clone https://github.com/artf/grapesjs-style-gradient.git
$ cd grapesjs-style-gradient
```

Install dependencies

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```



## License

BSD 3-Clause
