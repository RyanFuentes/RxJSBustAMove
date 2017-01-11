export default class Stage {
  constructor(el) {
    this.canvas = document.getElementById(el);
    this.ctx = this.canvas.getContext('2d');
  }

  properties() {
    return {
      height: this.canvas.height,
      width: this.canvas.width
    }
  }

  draw(element, props) {
    element.render(this.ctx, this.properties, props);
  }
}
