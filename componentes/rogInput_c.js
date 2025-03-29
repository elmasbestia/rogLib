const _rogInput = {
  patrones: {
    cedula: {
      fmt: rogFmt.Ent,
      type: "number",
      patron: "\d{6,8}",
      expr: /^\d{6,8}$/
    },
    tlf: {
      fmt: rogFmt.Tlf,
      type: "tel"
    },
    entero: {
      fmt: rogFmt.Ent,
      type: "number"
    },
    pwd: {
      type: "password"
      /*,
      patron: "(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
      */
    },
    nombre: {
      patron: "[a-zA-ZÀ-ÿ\s]{1,40}",
      expr: /^[a-zA-ZÀ-ÿ\s]{1,40}$/
    },
    alfa: {
      patron: "[A-Za-z]*"
    },
    number: {
      patron: "[0-9]*",
      fmt: rogFmt.Moneda
    },
    correo: {
      type: "email",
      patron: "^[w-.]+@([w-]+.)+[w-]{2,4}$"
    }
  },

  observados: ["valido", "value", "oninput"],

  valida: (obj) => obj._set("valido",_rogInput.esValido(obj.elemento, obj.validador)),

  esValido: (ele, fn) => {
    const valor = ele.type === "date" ? ele.valueAsDate : ele.value;
  
    return valor ? ele.checkValidity() && fn(valor) : !this.requerido;
  },

  cambia: {
    valido: (obj, viejo, nuevo) => {
      obj.estado = nuevo === "true" ? 1 : 2;
    },

    estado: (obj, viejo, nuevo) => {
      if (nuevo) {
        obj.classList.toggle("validado", nuevo == "1");
        obj.classList.toggle("invalidado", nuevo == "2");
      }
    },

    oninput: (obj, viejo, nuevo) => {
      obj.validador = nuevo ? _rogInput.extraeFn(nuevo) : (e) => true;
    },

    value: (obj, viejo, nuevo) => {
      //obj.dispatchEvent(new Event("change", { bubbles: true }));
      obj.render();
    }
  },

  cambio: (e) => {
    const obj = e.target.getRootNode().host
    if(obj.estado) {
      obj.setAttribute("value", obj.estado == 1 ? obj.elemento.value : null)
      obj.dispatchEvent(new Event("change", { bubbles: true }))
    }
  },

  getType: (obj) => {
    let type = obj._get("type");
    if (!type) {
      const tipo = obj._get("tipo");
      if (tipo) type = _rogInput.patrones[tipo]?.type;
    }

    return type || "text";
  },

  getFmt: (obj) => {
    let fmt = obj._get("fmt");
    if (fmt) {
      fmt = rogFmt[fmt];
    } else {
      const tipo = obj._get("tipo");
      if (tipo) fmt = _rogInput.patrones[tipo]?.fmt;
      if (!fmt) {
        fmt = _rogInput.patrones[obj.type]?.fmt;
      }
    }
    return fmt;
  },

  getPatron: (obj) => {
    let patron = obj.getAttribute("pattern");
    if (!patron) {
      patron =
        _rogInput.patrones[obj.getAttribute("tipo")]?.patron ||
        _rogInput.patrones[obj.type]?.patron;
    }
    return patron;
  },

  formatea: (ele) => {
    const _ele = ele instanceof Event ? ele.target : ele;

    if (_ele.type !== "password") {
      const obj = _ele.getRootNode().host
      if (_ele.type === "number") _ele.style["text-align"] = "right";
      _ele.type = "Text";
      _ele.value = _rogInput.fmt(obj.fmt, obj.value);
    }
  },

  fmt: (fmt, valor) => (fmt ? fmt(valor) : valor),

  extraeFn: (valor) => (valor ? window[valor.split("(").shift()] : valor),

  lee: (e) => _rogInput.valida(e.target.getRootNode().host
  ),

  attOpcionales: (obj, att) => {
    return Array.isArray(att)
      ? att.map((x) => _rogInput.attOpcionales(obj, x)).join("")
      : obj._get(att)
      ? `${att}="${obj._get(att)}"`
      : "";
  },

  chxOjo: e => {
    const btn = e.target
    const input = btn.parentElement.querySelector("INPUT")
    input.type = input.type === "password" ? "text" : "password"
  }
};

class rogInput extends HTMLElement {
  #estado;
  constructor() {
    super();
    this.estado = 0; // Estado inicial
    this.shadow = this.attachShadow({ mode: "open" });
    this.validador = () => true;
  }

  get name() {
    return this.getAttribute("name");
  }

  get value() {
    return this.getAttribute("value")
  }

  set value(valor) {
    this.setAttribute("value",valor)
  }

  get tipo() {
    return this.getAttribute("tipo") || this.type;
  }

  set tipo(value) {
    return this.setAttribute("tipo",value);
  }

  _get(que) {
    return this.getAttribute(que);
  }

  _set(que, valor) {
    this.setAttribute(que, valor);
  }

  get type() {
    return _rogInput.getType(this);
  }

  get fmt() {
    return _rogInput.getFmt(this);
  }

  get patron() {
    return _rogInput.getPatron(this);
  }

  get requerido() {
    return this.required === "true";
  }

  get required() {
    return (this.hasAttribute("required") && this.getAttribute("required") != "false");
  }

  get valido() {
    if(!this.estado) _rogInput.valida(this);
    return (this.hasAttribute("valido") && (this.getAttribute("valido") !== "true"));
  }

  set estado(valor) {
    _rogInput.cambia.estado(this,this.#estado,valor);
    this.#estado = valor;
  }

  get estado() {
    return this.#estado;
  }

  get elemento() {
    return this.shadow.querySelector("INPUT");
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = tmpROGInput(this);
    if(this.patron) this.elemento.pattern = this.patron;

    this.elemento.onfocus = (e) => {
      this.elemento.type = this.type;
      this.elemento.value = this._get("value");
    };
    
    this.elemento.addEventListener("beforeinput", e => {
      const ele = e.target
      if(((ele.type === "number")||(ele.type === "date")) && isNaN(e.data)) e.preventDefault();
    })

    this.elemento.onblur = _rogInput.formatea;

    _rogInput.formatea(this.elemento);
  }

  static get observedAttributes() {
    return _rogInput.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    _rogInput.cambia[att](this, viejo, nuevo);
  }
}

customElements.define("rog-input", rogInput);

// Plantilla
function tmpROGInput(obj) {
  return `<style>
      :host {
        --clrBorde: currentColor;
        --clrRelleno: lightgrey;
      }
      .validado {
        --clrBorde: green;
        --clrRelleno: lightgreen;      
      }
      .invalidado {
        --clrBorde: red;
        --clrRelleno: pink;      
      }
      input {
        border: none;
      }
      .marco {
        position: relative;
        width: max-content;
        border: 1px solid var(--clrBorde);
      }
      input:required::after {
        content: "*";
      }
      input::invalid {
        color: red;
      }
      [type=number] {
        text-align: right;
      }
      input:required:invalid::after,
      input:focus:invalid::after {
        content: "✘";
        color: red;
      }
    </style>
    <div class="marco">
      <input type="${obj.type}"
        oninput="_rogInput.lee(event)"
        ${_rogInput.attOpcionales(obj, [
          "placeholder",
          "value",
          "max",
          "min",
          "title"
        ])}
        onchange="_rogInput.cambio(event)"
      >
      ${obj.tipo === "pwd" ? '<button onclick="_rogInput.chxOjo(event)">👁</button>' : ""}
    </div>`
}
