const _rogCierra = {
  observados: ["icono", "onclick"],

  cambia: {},

  cierra(e) {
    const vnt = _rogCierra.closest(".rogVnt");
    if (vnt) {
      if(vnt.hasAttribute("open")) vnt.open = false;
      else vnt.classList.remove("activa");
    } else alert("¡No sé qué hacer!");
  }
};

class rogCierra extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  _get(que) {
    return this.getAttribute(que);
  }

  _set(que, valor) {
    this.setAttribute(que, valor);
  }

  get icono() {
    return this._get("icono") || "cierra";
  }

  connectedCallback() {
    this.render();
    this.marco.obj = this;
  }

  get marco() {
    return this.shadow.querySelector(".cierra");
  }

  set onclick(valor) {
    this._set("onclick", valor);
  }

  get onclick() {
    return this._get("onclick");
  }

  disconnectedCallBack() {}

  render() {
    this.shadow.innerHTML = tmpROGCierra(this);
    if (!this.onclick) this.onclick = _rogCierra.cierra;
  }

  static get observedAttributes() {
    return _rogCierra.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    if (_rogCierra.cambia[att]) _rogCierra.cambia[att](this, viejo, nuevo);
    this.render();
  }
}

customElements.define("rog-cierra", rogCierra);

function tmpROGCierra(obj) {
  return `<style>  
    .cierra {
      position: absolute;
      top: 0.5px;
      right: 0.75px;
      height: 1em;

      text-align: right;
      cursor: pointer;
      opacity: 0.3;
      transition: opacity 0.85s ease-in-out;
    }

    .cierra:hover,
    .cierra:focus {
      opacity: 1;
      rotate: 45deg;
    }

    .cierra svg {
      height: 100%;
    }
  </style>
  
  <div class="cierra"><rog-icn icono="${obj.icono}"></rog-icn></div>`;
}

function segunda(e) {
  alert("Segunda!");
}

document.querySelector("rog-cierra").onclick = (e) => alert("La de arriba");

function activa(e) {
  e.currentTarget.parentElement.classList.toggle("activa");
}
