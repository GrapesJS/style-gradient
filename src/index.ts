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
  colorPicker?: 'default' | ((handler: any) => void),

  /**
   * Select, by default, the edge color stops of the gradient picker.
   * @default true
   */
  selectEdgeStops?: boolean,

  /**
   * The id to assign for the gradient picker type.
   * @default 'gradient'
   */
  styleType?: string,

  /**
   * Built-in property name to use for the composite type with the gradient
   * picker and direction/type selectors.
   * @default 'background-image'
   */
  builtInType?: string | false,
};

const plugin: grapesjs.Plugin<PluginOptions> =  (editor, opts = {}) => {
  const options: PluginOptions = {
    grapickOpts: {},
    selectEdgeStops: true,
    styleType: 'gradient',
    builtInType: 'background-image',
    ...opts,
  };
  loadStyles(editor, options);
};

export default plugin;
