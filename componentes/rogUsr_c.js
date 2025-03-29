/*
  Objeto para el manejo de Usuarios
*/
const _rogUsr = {
    observados: [],
  
    cambia: {}
  };
  
  class rogUsr extends HTMLElement {
    #value = {};
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
  
    get name() {
      return this.getAttribute("name");
    }

    get nb() {
      return this.value.nb;
    }

    set value(valor = {}) {
      this.#value = valor;
      this.dispatchEvent(new CustomEvent("change",{detail: valor}));
      this.render();
    }
  
    get value() {
      return this.#value;
    }
  
    get clase() {
      return Array.isArray(this.wClase) ? this.wClase.join(" ") : this.wClase;
    }
  
    set clase(valor) {
      if (this.wClase) {
        if (!(this.wClase instanceof Array)) this.wClase = [this.wClase];
        this.wClase.push(valor);
      } else this.wClase = valor;
    }

    valor(que) {
      return this.value[que];
    }

    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadow.innerHTML = tmpROGUsr(this);
    }
  
    static get observedAttributes() {
      return _rogUsr.observados;
    }
  
    attributeChangedCallback(att, viejo, nuevo) {
      if (_rogUsr.cambia[att]) _rogUsr.cambia[att](this, viejo, nuevo);
      this.render();
    }
  }
  
  customElements.define("rog-usr", rogUsr);
  
  function tmpROGUsr(obj) {
    return `<style>
      .marco {
        position: relative;
      }
          img {
              position: relative;
              top: -25%;
              left: 10%;
              height: 3em;
              aspect-ratio: 1;
              border-radius: 100%;
              border: 3px solid currentcolor;
              z-index: 10;
          }

          .menu {
            color: var(--clrTxtObj);
            background-color: var(--clrFndObj);

            padding-inline-start: 0;
            list-style-type: none;
            padding: .25em;
            border-radius: 5px;
            line-height: 2;

            width: max-content;

            position: absolute;
            top: 1em;
            left: -5.5em;
            opacity: .85;
          
            scale: 0;
            transition: scale .25s ease-out;
            z-index: 9;
        }
              
          .marco:hover .menu {
            scale: 1;
          }  
      </style>
      <div class="marco">
        <img src="${obj.valor("urlFoto")}" alt="🧑" title="${obj.nb}">
        <ul class="menu mnuFlotante">
          <slot></slot>
      </ul></div>`;
  }
