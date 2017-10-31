import Grapick from 'grapick';

const cpKey = 'data-cp';

export default (editor, config = {}) => {
  const sm = editor.StyleManager;
  const typeBase = sm.getType('base');

  sm.addType('gradient', {
    view: {
      events: {},

      templateInput(model) {
        return ``;
      },

      //
      setValue(value) {
        const val = value || this.model.getDefaultValue();
        console.log('Gradient value is ', value);
      },

      onRender() {
        console.log('Gradient rendered');
        const model = this.model;
        const ppfx = this.ppfx;
        const el = document.createElement('div');
        const gp = new Grapick({el, colorEl: `<input ${cpKey}/>`});
        const fields = this.el.querySelector(`.${ppfx}fields`);
        fields.appendChild(el.children[0]);
        this.input = gp;

        // Do stuff on gradient change
        gp.on('change', complete => {
          const value = gp.getSafeValue();
          model.set('value', value, {avoidStore: 1});
          complete && model.trigger('change:value', model, value, {});
        });

        // Setup
        gp.setColorPicker(handler => {
          const el = handler.getEl().querySelector(`[${cpKey}]`);

          editor.$(el).spectrum({
            showAlpha: true,
            color: handler.getColor(),
            change(color) {
              handler.setColor(color.toRgbString());
            },
            move(color) {
              handler.setColor(color.toRgbString(), 0);
            }
          });
        });
      },
    }
  })
}
