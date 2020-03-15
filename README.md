# GrapesJS Style Gradient

This plugins adds a new `gradient` property to the GrapesJS's StyleManager by using [Grapick](https://github.com/artf/grapick)

[Demo](https://codepen.io/artf/full/bYwdQG/)

## Summary

* Plugin name: `grapesjs-style-gradient`
* Style properties: `gradient`





## Options

* `grapickOpts` - Grapick option, default: `{}`
* `colorPicker` - Custom color picker, check Grapick's repo to get more about it
  If you leave it empty the native color picker will be used. You can use 'default'
  string to get the one used by GrapesJS (which is spectrum at the moment of writing)
* `inputDirection` - Add the gradient direction input under the picker
  (you can pass an object as a Property Model), default: 1
* `inputType` - Add the gradient type input under the picker
  (you can pass an object as a Property Model), default: 1





## Download

* CDN
  * `https://unpkg.com/grapesjs-style-gradient`
* NPM
  * `npm i grapesjs-style-gradient`





## Usage

```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<link href="https://unpkg.com/grapick/dist/grapick.min.css" rel="stylesheet">
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/grapesjs-style-gradient"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container : '#gjs',
      ...
      plugins: ['grapesjs-style-gradient'],
      pluginsOpts: {
        'grapesjs-style-gradient': {}
      }
  });
</script>
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
