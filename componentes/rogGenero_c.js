const _rogGenero = {
  observados: ["value", "presentacion"],
﻿
  cambia: {
    value: (obj, viejo, nuevo) => {
      obj.dispatchEvent(new Event("onchange", { bubbles: true }));
    },
﻿
    presentacion: (obj, viejo, nuevo) => {
      obj.dispatchEvent(new Event("onchange", { bubbles: true }));
    }
  },
﻿
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
﻿
  chxOpcion: (e) => {
    const opcion = e.target;
    if (opcion.matches(".opcion")) opcion.obj.value = opcion.dataset.valor;
  },
﻿
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

  set value(valor) {
    this.setAttribute("value", valor);
  }

  get value() {
    return this.getAttribute("value") || 1;
  }

  set presentacion(valor) {
    this.setAttribute("presentacion", isNaN(valor) ? valor : this.presentaciones[valor]);
  }

  get presentacion() {
    return this.getAttribute("presentacion") || "simbolo";
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
      ul {
        opacity: 1;
        display: flex;
        gap: 1em;
        
        list-style-type: none;

        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
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
        box-shadow: 2px 3px 5px black;

        scale: 0;
        transition: scale 150ms ease-out;
      }

      .mnuFlotante li {
        padding: .5em;
      }

      .mnuFlotante li:hover {
        font-weight: bolder;
        box-shadow: 1px 1.5px 2px black;
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
      <div class="vidrio mnuFlotante">
        <ul onblur="escondeMnu(event)">
          ${_rogGenero.tmpOpciones(obj)}
        </ul>
      </div>
  </fieldset>`;
}
