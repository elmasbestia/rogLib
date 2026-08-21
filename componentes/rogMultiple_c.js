const _rogMultiple = {
  observados: ["value", "opciones", "genero"],

  cambia: {
    value: (obj, viejo, nuevo) => {},

    opciones: (obj, viejo, nuevo) => {
      obj.opciones = nuevo;
    },

    genero: (obj, viejo, nuevo) => {
      obj.sufijo = nuevo ? ["o", "a"][nuevo] : nuevo;
    }
  },

  tmpOpciones: (obj) => {
    return obj.opciones
      .map((opcion, i) => `<li class="opcion" data-valor="${i}">${_rogMultiple.sexo(obj,opcion)}</li>`)
      .join("");
  },

  chxOpcion: (e) => {
    const opcion = e.target;
    if (opcion.matches(".opcion"))
      opcion.obj.value = opcion.obj._get("indice")
        ? opcion.dataset.valor
        : opcion.obj.opciones[opcion.dataset.valor];
  },

  sexo: (obj, valor) => {
    return obj.sufijo ? valor.replace("@", obj.sufijo) : valor;
  }
};

class rogMultiple extends HTMLElement {
  #opciones = [];
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

  set value(valor) {
    this._set("value", valor);
  }

  get value() {
    return this._get("value") || this.opciones[0];
  }

  get valor() {
    return _rogMultiple.sexo(this, this.value);
  }

  get label() {
    return this._get("label") || "Opción";
  }

  set opciones(lista) {
    this.#opciones = lista.split(", ");
  }

  get opciones() {
    return this.#opciones;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallBack() {}

  render() {
    this.shadow.innerHTML = tmpROGMultiple(this);
    this.shadow.querySelectorAll(".opcion").forEach((x) => {
      x.obj = this;
      x.onclick = _rogMultiple.chxOpcion;
    });
  }

  static get observedAttributes() {
    return _rogMultiple.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    _rogMultiple.cambia[att](this, viejo, nuevo);
    this.dispatchEvent(new Event("onchange", { bubbles: true }));
    this.render();
  }
}

customElements.define("rog-multiple", rogMultiple);

function tmpROGMultiple(obj) {
  return `<style>
      :host {
        display: inline-block;
      }

      #mnucito {
        display: flex;
        gap: 1em;
        list-style-type: none;
      }

      .vidrio {
        opacity: 0.7;
        background-image: linear-gradient(
          to right bottom,
          rgba(255, 255, 255, 0.7),
          rgba(255, 255, 255, 0.3)
        );
        backdrop-filter: blur(2rem);
      }

      .mnuFlotante {
        position: absolute;
        z-index: 2;

        top: .5em;

        border-radius: 5px;
        padding: 1em;
        shadow-box: 2px 3px 5px black;

        scale: 0;
        transition: scale 150ms ease-out;
      }

      .mnuFlotante li:hover {
        font-weight: bolder;
      }

      .marco {
        position: relative;
        width: max-content;
      }

      input:hover ~ .mnuFlotante {
        scale: 1;
      }
    </style>
      <label>${obj.label}</label>
      <input type="text" value="${obj.valor}" readonly>
      <ul id="mnucito" class="vidrio mnuFlotante" onblur="escondeMnu(event)">
        ${_rogMultiple.tmpOpciones(obj)}
      </ul>`;
}
