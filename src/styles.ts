import type grapesjs from 'grapesjs';
import Grapick from 'grapick';
import { PluginOptions } from '.';

const cpKey = 'data-cp';
let inputDirection, inputType;

const getColor = (color: any) => {
  let cl = color.getAlpha() == 1 ? color.toHexString() : color.toRgbString();
  return cl.replace(/ /g, '');
}

export default (editor: grapesjs.Editor, config: PluginOptions = {}) => {
  const { StyleManager } = editor;
  let colorPicker = config.colorPicker;
  let lastOpts = {};
  const defDir = [ 'top', 'right', 'bottom', 'left' ];
  const updateLastOpts = (opts: any) => {
    lastOpts = opts || { fromTarget: 1, avoidStore: 1 };
    setTimeout(() => lastOpts = {});
  }

  StyleManager.addType('gradient', { // TODO change to 'gradient-picker'
    create({ change }: any) {
      const el = document.createElement('div');
      el.className = 'gp-container';
      el.style.width = '100%';
      const gp = new Grapick({
        el,
        // colorEl,
        ...config.grapickOpts,
      });
      gp.on('change', (complete: boolean) => {
        change({ value: gp.getValue(), partial: !complete });
      });
      this.gp = gp;

      return el;
    },
    emit({ updateStyle }: any, { partial, value }: any) {
      updateStyle(value, { partial });
    },
    update({ value }: any) {
      const { gp } = this;
      if (gp.getValue() === value) return;
      gp.setValue(value, { silent: true });

      if (config.selectEdgeStops) {
        const handlers = gp.getHandlers();
          [handlers[0], handlers[handlers.length - 1]].filter(Boolean)
            .map(h => h.select({ keepSelect: true }));
      }
    },
    destroy() {
      this.gp?.destroy();
    },
  });

  /*

  sm.addType('gradient', {
    view: {

      // I don't need any event
      events: {
        'click [data-clear-style]': 'clear',
      },


      // Don't need a template as the input will be created by Grapick
      templateInput: () => '',


      // With `setValue` I should indicate how to update the custom input,
      // in our case Grapick instance.
      // The `value` in this case might be something like:
      // `linear-gradient(90deg, red 1%, blue 99%)`
      setValue(value) {
        const { gp } = this;
        if (!gp) return;
        const defValue = this.model.getDefaultValue();
        value = value || defValue;
        updateLastOpts();
        gp.setValue(value);
        // Update also our optional inputs for the type and the
        // direction of a gradient color
        const dir = gp.getDirection();
        const valueDir = defDir.filter(i => dir.indexOf(i) >= 0)[0] || dir;
        gp.setDirection(valueDir); // Ensure the new value
        inputType && inputType.setValue(gp.getType());
        inputDirection && inputDirection.setValue(valueDir);
        const handlers = gp.getHandlers();
        selectEdgeStops &&
          [handlers[0], handlers[handlers.length - 1]].filter(i => i)
            .map(h => h.select({ keepSelect: 1 }));
      },

      destroy() {
        const { gp } = this;
        gp && gp.destroy();
      },


      // Here all I need is to setup the Grapick input and append it somewhere
      // on the property
      onRender() {
        const { ppfx, em, model } = this;
        const conf = {
          ...config,
          ...(model.get('gradientConfig') || {}),
        };
        const { onCustomInputChange } = conf;
        const el = document.createElement('div');
        const colorEl = colorPicker && `<div class="grp-handler-cp-wrap">
          <div class="${ppfx}field-colorp-c">
            <div class="${ppfx}checker-bg"></div>
            <div class="${ppfx}field-color-picker" ${cpKey}></div>
          </div>
        </div>`;

        // Setup Grapick
        const gp = new Grapick({
          el,
          colorEl,
          ...conf.grapickOpts,
        });
        const fields = this.el.querySelector(`.${ppfx}fields`);
        fields.style.flexWrap = 'wrap';
        fields.appendChild(el.children[0]);
        this.gp = gp;

        // Do stuff on gradient change
        gp.on('change', complete => {
          // You should use `model.setValue` when you expect to reflect changes
          // on the input, `model.setValueFromInput` is to used when the change comes
          // from the input itself, like in this case
          model.setValueFromInput(gp.getValue(), complete, lastOpts);
        });

        // Add custom inputs, if requested
        [
          ['inputDirection', 'select', 'setDirection', {
            name: 'Direction',
            property: '__gradient-direction',
            defaults: 'right',
            options: defDir.map(value => ({ value }))
          }],
          ['inputType', 'select', 'setType', {
            name: 'Type',
            defaults: 'linear',
            property: '__gradient-type',
            options: [
              {value: 'radial'},
              {value: 'linear'},
              {value: 'repeating-radial'},
              {value: 'repeating-linear'},
            ]
          }]
        ].forEach(input => {
            const inputName = input[0];
            const inputConfig = conf[inputName];
            if (inputConfig) {
              const { parent } = model;
              const type = input[1];
              const inputObj = typeof inputConfig == 'object' ? inputConfig : {};
              const propInput = sm.createType(inputObj.type || type, {
                model: { ...input[3], ...inputObj },
                view: { propTarget: this.propTarget },
              });
              parent && (propInput.model.parent = parent);
              propInput.render();
              propInput.model.on('change:value', (model, val, opts = {}) => {
                updateLastOpts(opts);
                gp.el && gp[input[2]](model.getFullValue() || model.getDefaultValue(), { complete: !opts.avoidStore });
                onCustomInputChange({ model, input, inputDirection, inputType, opts });
              });
              fields.appendChild(propInput.el);
              inputName == 'inputDirection' && (inputDirection = propInput);
              inputName == 'inputType' && (inputType = propInput);
            }
        })

        // Add the custom color picker, if requested
        if (colorPicker == 'default') {
          colorPicker = handler => {
            const el = handler.getEl().querySelector(`[${cpKey}]`);
            const elStyle = el.style;
            elStyle.backgroundColor = handler.getColor();
            const emConf = em && em.getConfig() || {};
            const colorPickerConfig = emConf.colorPicker || {};
            const elToAppend = emConf.el;
            const updateColor = (color, complete = 1) => {
              const cl = getColor(color);
              elStyle.backgroundColor = cl;
              handler.setColor(cl, complete);
            };
            const cpOpts = {
              color: handler.getColor(),
              change(color) {
                updateColor(color);
              },
              move(color) {
                updateColor(color, 0);
              },
            }
            const baseCp = em && em.initBaseColorPicker;
            baseCp ? baseCp(el, cpOpts) : editor.$(el).spectrum({
              containerClassName: `${ppfx}one-bg ${ppfx}two-color`,
              appendTo: elToAppend || 'body',
              maxSelectionSize: 8,
              showPalette: true,
              palette: [],
              showAlpha: true,
              chooseText: 'Ok',
              cancelText: '⨯',
              ...cpOpts,
              ...colorPickerConfig,
            });
          };

          gp.on('handler:remove', handler => {
            const el = handler.getEl().querySelector(`[${cpKey}]`);
            const $el = editor.$(el);
            $el.spectrum && $el.spectrum('destroy');
          })
        }

        colorPicker && gp.setColorPicker(colorPicker);
      },
    }
  })

  */
}
