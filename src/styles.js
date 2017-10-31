import Grapick from 'grapick';

const cpKey = 'data-cp';

const getColor = color => {
  let cl = color.getAlpha() == 1 ? color.toHexString() : color.toRgbString();
  return cl.replace(/ /g, '');
}

export default (editor, config = {}) => {
  const sm = editor.StyleManager;
  let colorPicker = config.colorPicker;

  sm.addType('gradient', {
    view: {

      // I don't need any event
      events: {},

      templateInput(model) {
        return ``;
      },

      // Indicate how to set the value (eg. when the component is changed)
      setValue(value) {
        const gp = this.gp;
        const defValue = this.model.getDefaultValue();
        value = value || defValue;
        gp && gp.setValue(value, {silent: 1});
      },


      onRender() {
        const ppfx = this.ppfx;
        const el = document.createElement('div');
        const colorEl = colorPicker && `<div class="grp-handler-cp-wrap">
          <div class="gjs-field-colorp-c">
            <div class="gjs-checker-bg"></div>
            <div class="gjs-field-color-picker" ${cpKey}></div>
          </div>
        </div>`;

        // Setup Grapick
        const gp = new Grapick({ ...{
            colorEl,
            direction: '90deg',
          },
          ...config.grapickOpts, el
        });
        const fields = this.el.querySelector(`.${ppfx}fields`);
        fields.appendChild(el.children[0]);
        this.gp = gp;

        // Do stuff on gradient change
        gp.on('change', complete => {
          const value = gp.getSafeValue();
          this.model.setValue(value, complete, { fromInput: 1 });
        });

        // Check for the custom color picker
        if (colorPicker == 'default') {
          colorPicker = handler => {
            const el = handler.getEl().querySelector(`[${cpKey}]`);
            const elStyle = el.style;
            elStyle.backgroundColor = handler.getColor();
            const updateColor = (color, complete = 1) => {
              const cl = getColor(color);
              elStyle.backgroundColor = cl;
              handler.setColor(cl, complete);
            };

            editor.$(el).spectrum({
              showAlpha: true,
              chooseText: 'Ok',
              cancelText: '⨯',
              color: handler.getColor(),
              change(color) {
                updateColor(color);
              },
              move(color) {
                updateColor(color, 0);
              }
            });
          };
        }

        colorPicker && gp.setColorPicker(colorPicker);
      },
    }
  })
}
