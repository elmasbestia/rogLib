const _rogNombre = {
  observados: ["value", "orden"],

  cambia: {
    orden: (obj, viejo, nuevo) => obj.mst(),
    value: (obj, viejo, nuevo) => {
      if(obj.estado !== "leyendo") _rogNombre.iniPartes(obj);
      obj.mst();
    }
  },

  val2Txt(valor) {
    let retorno = valor;

    let conf = valor.hasOwnProperty("nombre1")
      ? ["nombre1", "nombre2", "apellido1", "apellido2"]
      : valor.hasOwnProperty("primernombre")
      ? ["primernombre", "segundonombre", "primerapellido", "segundoapellido"]
      : "";
    if (conf) retorno = conf.map((x) => valor[x]);

    return JSON.stringify(retorno);
  },

  iniPartes: (obj) => {
    const valores = _rogNombre.divide(obj.value);
    obj.partes.forEach((x, i) => {
      x.obj = obj;
      x.value = valores[i];
    });
  },

  divide: (valor) => {
    return valor.startsWith("[") ? JSON.parse(valor) : valor.split(" ");
  },

  lee(e) {
    const estado = this.estado;
    e.target.obj.act("leyendo");
    this.estado = estado;
  }
};

class rogNombre extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    this.estado = "";
  }

  set value(valor) {
    this.setAttribute("value", _rogNombre.val2Txt(valor));
  }

  get value() {
    return this.getAttribute("value") || '["","","",""]';
  }

  set orden(valor) {
    this.setAttribute("orden", valor);
  }

  get orden() {
    return this.getAttribute("orden") || "apellido";
  }

  get valor() {
    return {
      nbCompleto: this.nbCompleto,
      nb: [this.parte(0), this.parte(1), this.parte(2), this.parte(3)]
    };
  }

  get partes() {
    return this.shadow.querySelectorAll("input");
  }

  xParte(n) {
    return this.orden === "apellido" ? [2, 3, 0, 1][n] : n;
  }

  get separador() {
    return this.orden === "apellido" ? ", " : " ";
  }

  get nbCompleto() {
    return (
      (this.parte(this.xParte(0)) + " " + this.parte(this.xParte(1))).trim() +
      this.separador +
      (this.parte(this.xParte(2)) + " " + this.parte(this.xParte(3))).trim()
    );
  }

  parte(n) {
    return this.partes[n].value;
  }

  _get(que) {
    return this.getAttribute(que);
  }

  _set(que, valor) {
    this.setAttribute(que, valor);
  }

  act(estado = "") {
    this.estado = estado;
    this.value = Array.from(this.partes).map((x) => x.value);
  }

  mst() {
    const marco = this.marco;
    if (marco) marco.querySelector("legend").textContent = this.nbCompleto;
  }

  connectedCallback() {
    this.render();
  }

  get marco() {
    return this.shadow.querySelector(".marco");
  }

  disconnectedCallBack() {}

  render() {
    debugger;
    this.shadow.innerHTML = tmpROGNombre(this);
    _rogNombre.iniPartes(this);
    this.mst();
  }

  static get observedAttributes() {
    return _rogNombre.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    if (_rogNombre.cambia[att]) _rogNombre.cambia[att](this, viejo, nuevo);
  }
}

customElements.define("rog-nombre", rogNombre);

function tmpROGNombre(obj) {
  return `<style>
  fieldset {
    display: flex;
    justify-content: space-around;
  }
  section {
    display: flex;
    flex-direction: column;
  }
  </style>
  <fieldset oninput="_rogNombre.lee(event)" class="marco">
  <legend></legend>
  <section>
    <label>Primer nombre</label>
    <input type="text" pattern="[A-Z]{3,}">
  </section>
  <section>
    <label>Segundo nombre</label>
    <input type="text" pattern="[A-Z]{3,}">
  </section>
  <section>
    <label>Primer apellido</label>
    <input type="text" pattern="[A-Z]{3,}">
  </section>
  <section>
    <label>Segundo apellido</label>
    <input type="text" pattern="[A-Z]{3,}">
  </section>
</fieldset>`;
}
