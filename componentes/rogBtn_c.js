class rogBtn extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  get width() {
    return this.getAttribute("width") || "100px";
  }

  get height() {
    return this.getAttribute("height") || "60px";
  }

  get img() {
    return this.getAttribute("img");
  }
  get domImg() {
    return this.img ? `<img src="${this.img}" alt="">` : "";
  }

  set disabled(valor) {
    if (valor) this.setAttribute(valor);
    else this.removeAttribute();
  }
  get disabled() {
    return (
      this.hasAttribute("disabled") && this.getAttribute("disabled") !== "false"
    );
  }
  get domDisabled() {
    return this.disabled ? "disabled" : "";
  }

  set posicion(valor) {
    this.setAttribute("posicion", valor);
  }

  get posicion() {
    const posicion = this.getAttribute("posicion");
    const clases = ["derecha", "izquierda", "none", "fuera"];
    return clases.includes(posicion) ? posicion : "";
  }
  get domPosicion() {
    return this.posicion ? `class="${this.posicion}"` : "";
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallBack() {}

  render() {
    this.shadow.innerHTML = tmpROGBtn(this);
  }

  static get observedAttributes() {
    return _rogBtn.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    if (_rogBtn.cambia[att]) _rogBtn.cambia[att](this, viejo, nuevo);
    this.render();
  }
}

const _rogBtn = {
  observados: ["img", "disabled", "posicion"],

  cambia: {}
};

customElements.define("rog-btn", rogBtn);

function tmpROGBtn(obj) {
  return `<style>
        ${tmpROGCSS(obj)}
      </style>
        <button ${obj.domDisabled} 
          ${obj.domPosicion}>
          ${obj.domImg}
          <slot class="texto">
          </slot>
      </button>`;
}

function tmpROGCSS(obj) {
  return `:host {
        font-family: Arial;
        font-size: 10px;
        color: #666;
      }
      button {
        position: relative;
        
        display: flex;
        flex-direction: column;
        align-items: center;
        
        border: 1px solid #a1a1a1;
        padding: .25em;
        text-align: center;
        cursor: pointer;
  
        border-radius: 13px;
  
        box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
          7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
        outline: none;
  
        -webkit-perspective: 230px;
        perspective: 230px;
      }
  
      button:hover {
        background: linear-gradient(to bottom, #e6e6e6, #a1a1a1);
      }
  
      button:disabled {
        background: #a1a1a1;
        opacity: .6;
        cursor: not-allowed;
      }
  
      .host:active{
        box-shadow:  4px 4px 6px 0 rgba(255,255,255,.3),
                    -4px -4px 6px 0 rgba(116, 125, 136, .2), 
          inset -4px -4px 6px 0 rgba(255,255,255,.2),
          inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
      }
  
      img {
        height: ${obj.height};
        width: ${obj.width};
        transition: all 1500ms ease;
      }

      ::slotted(*) {
        font-family: Arial;
        font-size: 10px;
        color: #666;
        max-width: 40ch;
        transition: all 1500ms ease;
      }
  
      .none, .fuera {
        margin-bottom: 2em;
      }
      .none ::slotted(*) {
        top: 110%;
        position: absolute;
        transform: rotateX(90deg);
        color: transparent;
      }
      .none:hover img {
        opacity: 0.6;
      }
      .none:hover ::slotted(*) {
        color: currentColor;
        transform: rotateX(0deg);
      }

      .fuera ::slotted(*) {
        top: 110%;
        position: absolute;
      }
      .fuera:hover ::slotted(*) {
        color: #000;
        font-weigth: bolder;
      }
  
      .izquierda,
      .derecha {
        flex-direction: row;
      }
  
      .derecha {
        flex-direction: row-reverse;
      }`;
}
