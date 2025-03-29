
class rogBadge extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
  
    get opcional() {
      return this.hasAttribute("opcional") && (this.getAttribute("opcional") !== "false");
    }

    set value(valor) {
      return this.setAttribute("value",valor);
    }

    get value() {
      return this.getAttribute("value") || 0;
    }

    set cant(valor) {
      this.value = valor;
    }
  
    get cant() {
      return this.value;
    }
  
    connectedCallback() {
      this.render();
    }
  
    disconnectedCallBack() {}
  
    render() {
      this.shadow.innerHTML = `<style>
            :host {
                display: inline-block;
                vertical-align: super;
                border-radius: 100%;
                font-size: 75%;
                padding: .3em;
                color: var(--clrTxtObj, currentColor);
                background-color: var(--clrFndObj, black);
                border: 1px solid var(--clrTxtObj, currentColor);
            }
        </style>
        ${
            this.opcional && !this.value ? 
                "" : 
                `<sup>${this.value}</sup>`
        }
        `;
    }
  
    static get observedAttributes() {
      return ["value","opcional"];
    }
  
    attributeChangedCallback(att, viejo, nuevo) {
      this.render();
    }
}

customElements.define("rog-badge",rogBadge);
