import type grapesjs from 'grapesjs';
import Grapick from 'grapick';
import { PluginOptions } from '.';

const cpKey = 'data-cp';
let inputDirection, inputType;

const getColor = (color: any) => {
  let cl = color.getAlpha() == 1 ? color.toHexString() : color.toRgbString();
  return cl.replace(/ /g, '');
}

const typeName = (name: string) => `${name}-gradient(`;

const parseGradient = (value: string) => {
  const start = value.indexOf('(') + 1;
  const end = value.lastIndexOf(')');
  const gradients = value.substring(start, end);
  const values = gradients.split(/,(?![^(]*\)) /);
  const result = {
    direction: 'left',
    type: 'linear',
    gradients,
    values,
  };

  if (!gradients) {
    return result;
  }

  if (values.length > 2) {
    result.direction = values.shift()!;
  }

  let typeFound = false;
  const types = ['repeating-linear', 'repeating-radial', 'linear', 'radial'];
  types.forEach(name => {
    if (value.indexOf(typeName(name)) > -1 && !typeFound) {
      typeFound = true;
      result.type = name;
    }
  });

  return result;
}

export default (editor: grapesjs.Editor, config: PluginOptions = {}) => {
  // @ts-ignore
  const em = editor.getModel();
  const { Styles } = editor;
  let { colorPicker } = config;
  let lastOpts = {};
  const defaultCpAttr = '[data-toggle="handler-color-wrap"]';
  const defDir = [ 'top', 'right', 'bottom', 'left' ];
  const updateLastOpts = (opts: any) => {
    lastOpts = opts || { fromTarget: 1, avoidStore: 1 };
    setTimeout(() => lastOpts = {});
  };
  const clearHandler = (handler: any) => {
    const el = handler.getEl().querySelector(defaultCpAttr);
    // @ts-ignore
    const $el = editor.$(el);
    $el.spectrum && $el.spectrum('destroy');
  };

  Styles.addType('gradient', { // TODO change to 'gradient-picker'
    create({ change }: any) {
      const el = document.createElement('div');
      el.className = 'gp-container';
      el.style.width = '100%';
      const gp = new Grapick({ el, ...config.grapickOpts });
      gp.on('change', (complete: boolean) => change({ value: gp.getValue(), partial: !complete }));
      this.gp = gp;

      // Add the custom color picker, if requested
      if (colorPicker === 'default') {
        colorPicker = handler => {
          const handlerEl = handler.getEl();
          const el = handlerEl.querySelector(defaultCpAttr);
          const handlerInput = handlerEl.querySelector('input');
          handlerInput?.parentNode.removeChild(handlerInput)
          const elStyle = el.style;
          elStyle.backgroundColor = handler.getColor();
          const updateColor = (color: any, complete = 1) => {
            const cl = getColor(color);
            elStyle.backgroundColor = cl;
            handler.setColor(cl, complete);
          };
          em.initBaseColorPicker(el, {
            color: handler.getColor(),
            change(color: any) {
              updateColor(color);
            },
            move(color: any) {
              updateColor(color, 0);
            },
          });
        };

        gp.on('handler:remove', clearHandler);
      }

      colorPicker && gp.setColorPicker(colorPicker);

      return el;
    },
    emit({ updateStyle }: any, { partial, value }: any) {
      updateStyle(value, { partial });
    },
    update({ value }: any) {
      const { gp } = this;
      if (gp.getValue() === value) return;
      const handlers = gp.getHandlers();
      handlers.map(clearHandler);
      gp.setValue(value, { silent: true });

      if (config.selectEdgeStops) {
          [handlers[0], handlers[handlers.length - 1]].filter(Boolean)
            .map(h => h.select({ keepSelect: true }));
      }
    },
    destroy() {
      this.gp?.destroy();
    },
  });

  const PROP_GRADIENT = 'background-image-gradient';
  const PROP_DIR = `${PROP_GRADIENT}-dir`;
  const PROP_TYPE = `${PROP_GRADIENT}-type`;

  Styles.addBuiltIn('background-image', {
    type: 'composite',
    fromStyle(style: any, { property, name }: any ) {
      const value = style[name] || '';
      const parsedGrad = parseGradient(value);
      console.log('fromStyle', { value, name, property, parsedGrad });
      return {
        [PROP_GRADIENT]: value,
        [PROP_DIR]: parsedGrad.direction,
        [PROP_TYPE]: parsedGrad.type,
      };
    },
    toStyle(values: any, { name }: any) {
      // const parsedGrad = parseGradient(values[PROP_GRADIENT]);
      // console.log('toStyle', { values, name, parsedGrad });
      return { [name]: values[PROP_GRADIENT] };
    },
    properties: [
      {
        name: ' ',
        property: PROP_GRADIENT,
        type: 'gradient',
        full: true,
        defaults: 'none',
        // onChange({ property, to, ...rest }: any) {
        //   console.log('on gradient change', {
        //     property, to, rest,
        //   });
        //   if (to.value) {
        //     // const option = property.getOption();
        //     // const props = { ...(option.propValue || {}) };
        //     // const propToUp = property.getParent().getProperty('value');
        //     // const unit = propToUp.getUnit();
        //     // if (!unit || props?.units.indexOf(unit) < 0) {
        //     //   props.unit = props?.units[0] || '';
        //     // }
        //     // propToUp.up(props);
        //   }
        // }
      },
      {
        name: 'Direction',
        property: PROP_DIR,
        type: 'select',
        defaults: 'right',
        options: defDir.map(value => ({ value })),
        onChange({ property, to, ...rest }: any) {
          if (to.value) {
            const propGrad = property.getParent().getProperty(PROP_GRADIENT);
            const gp = propGrad.view.gp;
            gp.setDirection(to.value);
            console.log({ gp, value: to.value })
          }
        }
      },
      {
        name: 'Type',
        defaults: 'linear',
        type: 'select',
        property: PROP_TYPE,
        options: [
          {value: 'radial'},
          {value: 'linear'},
          {value: 'repeating-radial'},
          {value: 'repeating-linear'},
        ]
      }
    ]
  });
}
