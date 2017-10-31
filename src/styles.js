import Grapick from 'grapick';

const cpKey = 'data-cp';

const getColor = color => {
  let cl = color.getAlpha() == 1 ? color.toHexString() : color.toRgbString();
  return cl.replace(/ /g, '');
}

export default (editor, config = {}) => {
  const sm = editor.StyleManager;
  const typeBase = sm.getType('base');
  let colorPicker = config.colorPicker;

  sm.addType('gradient', {
    view: {

      // I don't need any event
      events: {},

      templateInput(model) {
        return ``;
      },

      // Set the value to the input (eg. when the component is changed)
      setValue(value) {
        const gp = this.gp;
        const defValue = this.model.getDefaultValue();
        value = value || defValue;
        let start = value.indexOf('(') + 1;
        let end = value.lastIndexOf(')');
        value = value.substring(start, end);
        let direction = '45deg';
        const values = value.split(/,(?![^(]*\)) /);
        // this generates loop
        gp.clear();

        if (!value) {
          return;
        }

        if (values.length > 2) {
          direction = values.shift();
        }

        gp.setDirection(direction);
        values.forEach(value => {
          const hdlValues = value.split(' ');
          const position = parseFloat(hdlValues.pop());
          const color = hdlValues.join('');
          gp.addHandler(position, color, 0);
        })
      },

      onRender() {
        const model = this.model;
        const ppfx = this.ppfx;
        const el = document.createElement('div');
        const colorEl = colorPicker && `<div class="grp-handler-cp-wrap">
          <div class="gjs-field-colorp-c">
            <div class="gjs-checker-bg"></div>
            <div class="gjs-field-color-picker" ${cpKey}></div>
          </div>
        </div>`;
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
          model.set('value', value, {avoidStore: 1, fromInput: 1});
          complete && model.trigger('change:value', model, value, {fromInput: 1});
        });

        // Check for the custom color picker
        if (colorPicker == 'default') {
          colorPicker = handler => {
            const el = handler.getEl().querySelector(`[${cpKey}]`);
            const elStyle = el.style;
            elStyle.backgroundColor = handler.getColor();

            editor.$(el).spectrum({
              showAlpha: true,
              chooseText: 'Ok',
              cancelText: '⨯',
              color: handler.getColor(),
              change(color) {
                const cl = getColor(color);
                elStyle.backgroundColor = cl;
                handler.setColor(cl);
              },
              move(color) {
                const cl = getColor(color);
                elStyle.backgroundColor = cl;
                handler.setColor(cl, 0);
              }
            });
          };
        }

        colorPicker && gp.setColorPicker(colorPicker);
      },
    }
  })
}
