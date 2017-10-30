import Grapick from 'grapick';

export default (editor, config = {}) => {
  const sm = editor.StyleManager;
  const typeBase = sm.getType('base');

  sm.addType('gradient', {
    view: {
      templateInput(model) {
        return ``;
      },

      onRender() {
        const ppfx = this.ppfx;

        if (!this.input) {
          const el = document.createElement('div');
          const gradient = new Grapick({
            el
          });
          this.input = gradient;
          const fields = this.el.querySelector(`.${ppfx}fields`);
          fields.appendChild(el.children[0]);
        }
      },
    }
  })
}
