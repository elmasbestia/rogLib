const _rogFirma = {
    observados: []
  };
  
  class rogFirma extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
  
    get padding() {
      return this.getAttribute("padding") || 0;
    }
    get top() {
      return this.getAttribute("top") || "-3em";
    }
    get left() {
      return this.getAttribute("left") || "50";
    }
    get width() {
      return this.getAttribute("width") || "30%";
    }
  
    connectedCallback() {
      this.render();
    }
  
    disconnectedCallBack() {}
  
    render() {
      this.shadow.innerHTML = tmpROGFirma(this);
    }
  
    static get observedAttributes() {
      return _rogFirma.observados;
    }
  
    attributeChangedCallback(att, viejo, nuevo) {
      if (_rogFirma.cambia[att]) _rogFirma.cambia[att](this, viejo, nuevo);
      this.render();
    }
  }
  
  customElements.define("rog-firma", rogFirma);
  
  function tmpROGFirma(obj) {
    return `<style>
          :host {
              margin-top: 3em;
              border-top: 1px solid currentColor;
              padding-top: 1em;
              width: 30ch;
              text-align: center;
              position: relative;
              display: inline-block;
          }
          img {
              position: absolute;
              padding: ${obj.padding};
              top: ${obj.top};
              left: ${obj.left};
              width: ${obj.width};
          }
      </style>
      <div class="marco">
          <img src="${obj.getAttribute("img")}">
          <slot></slot>
      </div>`;
  }
  