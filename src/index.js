import loadStyles from './styles';
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

  // Add styles
  loadStyles(editor, config);
});
