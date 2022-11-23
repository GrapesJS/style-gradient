import type grapesjs from 'grapesjs';
import Grapick from 'grapick';
import { PluginOptions } from '.';

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
  const styleTypeId = config.styleType!;
  const defaultCpAttr = '[data-toggle="handler-color-wrap"]';
  const defDir = [ 'top', 'right', 'bottom', 'left' ];
  const defTypes = ['radial', 'linear', 'repeating-radial', 'repeating-linear'];

  const clearHandler = (handler: any) => {
    const el = handler.getEl().querySelector(defaultCpAttr);
    // @ts-ignore
    const $el = editor.$(el);
    $el.spectrum && $el.spectrum('destroy');
  };

  const getValidDir = (value: string) => {
    return defDir.filter(dir => value.indexOf(dir) > -1)[0];
  }

  Styles.addType(styleTypeId, {
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

  const getGrapickFromProperty = (property: any) => {
    const propGrad = property.getProperty(PROP_GRADIENT);
    return propGrad.view.gp;
  }

  Styles.addBuiltIn('background-image', {
    type: 'composite',
    fromStyle(style: any, { name }: any ) {
      const value = style[name] || '';
      const parsedGrad = parseGradient(value);
      return {
        [PROP_GRADIENT]: value,
        [PROP_DIR]: getValidDir(parsedGrad.direction),
        [PROP_TYPE]: parsedGrad.type,
      };
    },
    toStyle(values: any, { name, property }: any) {
      const gp = getGrapickFromProperty(property);
      const dirValue = property.getProperty(PROP_DIR).getValue();
      const typeValue = property.getProperty(PROP_TYPE).getValue();
      return { [name]: gp.getValue(typeValue, dirValue) };
    },
    properties: [
      {
        name: ' ',
        property: PROP_GRADIENT,
        type: styleTypeId,
        full: true,
        defaults: 'none',
      },
      {
        name: 'Direction',
        property: PROP_DIR,
        type: 'select',
        defaults: 'right',
        options: defDir.map(value => ({ value })),
        onChange({ property, to }: any) {
          if (to.value) {
            const gp = getGrapickFromProperty(property.getParent());
            const gdValue = gp.getValue();
            gdValue && gp.setDirection(to.value, { silent: true });
          }
        }
      },
      {
        name: 'Type',
        defaults: 'linear',
        type: 'select',
        property: PROP_TYPE,
        options: defTypes.map(value => ({ value })),
        onChange({ property, to }: any) {
          if (to.value) {
            const gp = getGrapickFromProperty(property.getParent());
            const gdValue = gp.getValue();
            gdValue && gp.setType(to.value, { silent: true });
          }
        }
      }
    ]
  });
}
