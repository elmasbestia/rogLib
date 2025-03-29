const _rogGenero = {
  observados: ["value", "presentacion"],

  cambia: {
    value: (obj, viejo, nuevo) => {
      obj.dispatchEvent(new Event("onchange", { bubbles: true }));
    },

    presentacion: (obj, viejo, nuevo) => {
      obj.dispatchEvent(new Event("onchange", { bubbles: true }));
    }
  },

  tmpOpciones: (obj) => {
    return Object.entries(_rogGenero.opciones)
      .map(
        ([opcion, valores], i) =>
          `<li class="opcion" data-valor="${i}">${
            valores[obj.presentacion]
          }</li>`
      )
      .join("");
  },

  chxOpcion: (e) => {
    const opcion = e.target;
    if (opcion.matches(".opcion")) opcion.obj.value = opcion.dataset.valor;
  },

  opciones: [
    {
      simbolo: "♂",
      numero: 1,
      letra: "M",
      abrev: "Masc."
    },
    {
      simbolo: "♀",
      numero: 2,
      letra: "F",
      abrev: "Fem."
    }
  ]
};

class rogGenero extends HTMLElement {
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
    return this._get("value") || 1;
  }

  set presentacion(valor) {
    this._set("presentacion", valor);
  }

  get presentacion() {
    return this._get("presentacion") || "simbolo";
  }

  valor(presentacion = this.presentacion) {
    return _rogGenero.opciones[this.value][presentacion];
  }

  get presentaciones() {
    return ["simbolo", "numero", "letra", "abrev"];
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallBack() {}

  render() {
    this.shadow.innerHTML = tmpROGGenero(this);
    this.shadow.querySelectorAll(".opcion").forEach((x) => {
      x.obj = this;
      x.onclick = _rogGenero.chxOpcion;
    });
  }

  static get observedAttributes() {
    return _rogGenero.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    _rogGenero.cambia[att](this, viejo, nuevo);
    this.render();
  }
}

customElements.define("rog-genero", rogGenero);

function tmpROGGenero(obj) {
  return `<style>
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
        text-align: center;
        width: max-content;
      }

      .marco:hover .mnuFlotante {
        scale: 1;
      }
    </style>
    <fieldset class="marco">
      <label for="genero">Género</label>
      <div id="valor">${obj.valor()}</div>
      <ul id="mnucito" class="vidrio mnuFlotante" onblur="escondeMnu(event)">
        ${_rogGenero.tmpOpciones(obj)}
      </ul>
  </fieldset>`;
}
