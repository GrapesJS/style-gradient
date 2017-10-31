import loadComponents from './components';
import loadStyles from './styles';
import loadBlocks from './blocks';
import gjs from 'grapesjs';
const g = grapesjs || gjs;

export default g.plugins.add('gjs-style-gradient', (editor, opts = {}) => {
  let config = opts;

  let defaults = {
    // Grapick options
    grapickOpts: {},

    // Custom color picker, check Grapick's repo to get more about it
    // If you leave it empty the native color picker will be used.
    // You can use 'default' string to get the one used by Grapesjs (which
    // is spectrum at the moment of writing)
    colorPicker: '',
  };

  // Load defaults
  config = { ...defaults, ...config };

  // Add components
  loadComponents(editor, config);

  // Add blocks
  loadBlocks(editor, config);

  // Add styles
  loadStyles(editor, config);

  // REMOVE THIS
  editor.on('load', () =>
    editor.addComponents('<div style="text-align:center">This is a content from the plugin</div>'))
});
