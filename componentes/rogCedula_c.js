const _rogCI = {
  observados: ["value"],

  cambia: {
    value: (obj, viejo, nuevo) => {
      obj.value = nuevo;
      obj.dispatchEvent(new Event("onchange", { bubbles: true }));
    }
  },

  cambio: (e) => {
    const obj = e.target.obj;
    obj._set("value", { nro: e.target.value });
  },

  opcionales: (obj, lista) => {
    return lista.map((x) => (obj[x] ? `${x}="${obj[x]}"` : "")).join(" ");
  },

  anal(valor) {
    let retorno = {};
    if (typeof valor === "string") {
      if (isNaN(valor)) {
        if(valor.startsWith("{")) retorno = Object.assign(JSON.parse(valor));
        else {
          retorno.nac = valor.slice(0, 1);
          retorno.nro = parseInt(valor.slice(1));
        }
      } else {
        retorno.nro = parseInt(valor);
      }
    } else if (typeof valor === "number") retorno.nro = valor;
    else retorno = valor;

    return retorno;
  },

  iniCmbs: (obj) => {
    obj.shadow
      .querySelectorAll("SELECT")
      .forEach((x) => (x.value = x.dataset.valor));
  }
};

class rogCI extends HTMLElement {
  #nac;
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

  set nac(valor) {
    this.#nac = valor
      ? isNaN(valor)
        ? valor.toUpperCase() === "V"
          ? "1"
          : "2"
        : valor
      : "1";
  }

  get nac() {
    return this.#nac;
  }

  /*
  set nro(valor) {
    this.nro.value = valor || "1";
  }

  get nro() {
    return this.shadow.querySelector("[name=nro]");
  }
  */

  set value(valor) {
    const valores = _rogCI.anal(valor);
    this.nac = valores.nac;
    this.nro = valores.nro || 0;
  }

  get value() {
    return { nac: this.nac, nro: this.nro };
  }

  get valido() {
    return this.nro.checkValidity();
  }

  get label() {
    return this.getAttribute("label") || "Cédula";
  }

  toString() {
    return `${this.nac} ${this.nro}`;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallBack() {}

  render() {
    this.shadow.innerHTML = tmpROGCI(this);
    this.shadow.querySelector("[name=nro]").obj = this;

    // Asignar valor al combo no basta
    _rogCI.iniCmbs(this);
  }

  static get observedAttributes() {
    return _rogCI.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    _rogCI.cambia[att](this, viejo, nuevo);
    this.render();
  }
}

customElements.define("rog-cedula", rogCI);

function tmpROGCI(obj) {
  return `<style>
      .marco {
        width: max-content;
      }
      input {
        align-text: right;
      }
    </style>
    <fieldset class="marco">
      <label for="cedula">${obj.label}</label>
      <div>
        <select name="nac" value="${obj.nac}" data-valor="${obj.nac}">
          <option value="1">V</option>
          <option value="2">E</option>
        </select>
        <input type="text" name="nro" 
          value="${obj.nro}"
          onchange="_rogCI.cambio(event)"
          ${_rogCI.opcionales(obj, ["required"])}>
      </div>
    </fieldset>`;
}

function chxCedula(e) {
  alert(`La cedula: ${e.target}`);
}
