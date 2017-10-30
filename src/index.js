import loadComponents from './components';
import loadBlocks from './blocks';
//import grapick from 'grapick';
import gjs from 'grapesjs';
const g = grapesjs || gjs;

export default g.plugins.add('gjs-style-gradient', (editor, opts = {}) => {
  let config = opts;

  let defaults = {
    // default options
  };

  // Load defaults
  for (let name in defaults) {
    if (!(name in config))
      config[name] = defaults[name];
  }

  // Add components
  loadComponents(editor, config);

  // Add blocks
  loadBlocks(editor, config);

  // REMOVE THIS
  editor.on('load', () =>
    editor.setComponents('<div style="text-align:center">This is a content from the plugin</div>'))
});
