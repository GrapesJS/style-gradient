import type grapesjs from 'grapesjs';
import loadStyles from './styles';

export type PluginOptions = {
  /**
   * Grapick options.
   * https://github.com/artf/grapick#configurations
   * @default {}
   */
  grapickOpts?: Record<string, any>,

  /**
   * Custom color picker, check Grapick's repo to get more about it.
   * If you leave it empty the native color picker will be used.
   * You can use 'default' string to get the one used
   * by Grapesjs (which is spectrum at the moment of writing).
   */
  colorPicker?: '', // TODO

  /**
   * Show gradient direction input under picker, you can pass an object as a model.
   * @default true
   */
  inputDirection?: boolean,

  /**
   * Show gradient type input under picker, you can pass an object as a model.
   * @default true
   */
  inputType?: boolean,

  /**
   * Select, by default, the edge color stops of the gradient picker.
   * @default true
   */
  selectEdgeStops?: boolean,

  /**
   * Do something when inputDirection/inputType triggers a change.
   */
  onCustomInputChange?: () => void,
};

const plugin: grapesjs.Plugin<PluginOptions> =  (editor, opts = {}) => {
  const options: PluginOptions = {
    grapickOpts: {},
    colorPicker: '',
    inputDirection: true,
    inputType: true,
    selectEdgeStops: true,
    onCustomInputChange: () => 0,
    ...opts,
  };
  loadStyles(editor, options);
};

export default plugin;
