const _rogInputIcn = {
  observados: ["estado", "value"],

  cambia: {
    estado: (obj, viejo, nuevo) => {
      if (nuevo) {
        obj.marco.classList.toggle("validado", nuevo == "1");
        obj.marco.classList.toggle("invalidado", nuevo == "2");
      }
    },

    value: (obj, viejo, nuevo) => {
      obj.dispatchEvent(new Event("onchange", { bubbles: true }));
    }
  },

}

class rogInputIcn extends HTMLElement {
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

  get value() {
    return this.elemento.value;
  }

  get valido() {
    return this.elemento.valido;
  }

  get type() {
    return this.elemento?.type;
  }

  get label() {
    return this.getAttribute("label") || this.tipo || this.type || "";
  }

  connectedCallback() {
    this.render();
  }

  get marco() {
    return this.shadow.querySelector("#input");
  }

  get elemento() {
    return this.shadow.querySelector("rog-input");
  }

  disconnectedCallBack() {
    this.campo.removeEventListener("validacion");
  }

  render() {
    this.shadow.innerHTML = tmpROGInputIcn(this);
    this.obj = this;

    this.getAttributeNames().forEach((x) => {
      this.elemento._set(x, this._get(x));
    });

    this.elemento.addEventListener("alCambiarValue", e => {
        this._set("estado", e.target._get("estado"));
    });
  }

  static get observedAttributes() {
    return _rogInputIcn.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    _rogInputIcn.cambia[att](this, viejo, nuevo);
  }
}

customElements.define("rog-input-icn", rogInputIcn);

// Plantilla
function tmpROGInputIcn(obj) {
  return `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" />

  <style>
      #input {
        --clrBorde: currentColor;
        --clrRelleno: lightgrey;

        display: flex;
      }
      .validado {
        --clrBorde: green;
        --clrRelleno: lightgreen;      
      }
      .invalidado {
        --clrBorde: red;
        --clrRelleno: pink;      
      }
      i {
        border: 1px solid var(--clrBorde);
        background-color: var(--clrRelleno);
        padding: 2px;
      }
      #label {
        min-width: 10ch;
      }
      #input {
        width: max-content;
        border: 1px solid var(--clrBorde);
        margin-bottom: .2em;
      }
      .requerido {
        color: red;
      }
    </style>
  
    <section id="label">
      <label>${obj.label}<label>
    </section>
    <section id="input">
      <i class="fas fa-${obj._get("icono")}"></i>
      <rog-input></rog-input>
      ${obj.requerido ? `<span class="requerido">*</span>` : ""}
    </section>`;
}

/*
<slot name="equis" />

<div slot="name">Fulanito</div>

disconnectCallback() {
  x.removeEventListener()
}
*/
