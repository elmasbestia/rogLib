const _rogPai = {
  observados: ["value", "height", "label", "carga"],

  cambia: {},

  colores: ["red", "orange", "yellow", "lightgreen", "lightblue", "pink"],

  mstLeyenda: (e) => {
    _rogPai.componente(e.target).leyenda.classList.add("activa");
  },

  cierra: (e) => {
    _rogPai.componente(e.target).leyenda.classList.remove("activa");
  },

  componente: (ele) => ele.getRootNode().host,

  clkPai: (e) => {
    // ShadowRoot.host
    e.stopPropagation();
    const blanco = e.target;
    if (blanco.matches(".pai")) _rogPai.mstLeyenda(e);
    else if (blanco.matches(".etiqueta")) {
      _rogPai.componente(blanco).dispatchEvent(
        new CustomEvent("click", {
          detail: { serie: blanco.textContent }
        })
      );
    } else _rogPai.cierra(e);
  },

  Prc: new Intl.NumberFormat("VES", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format,

  creaSeries: (_datos) => {
    /*
          Los datos pueden ser:
          1. Un arreglo de valores
          2. Un arreglo de objetos
          3. Un Objeto
          4. Una cadena de caracteres que representa cualquiera de los tres anteriores
        */
    const cnvJson = (datos) => {
      try {
        return JSON.parse(_datos);
      } catch {
        return desarma(datos);
      }
    };
    const datos = typeof _datos === "string" ? cnvJson(_datos) : _datos;
    const etiquetas =
      datos instanceof Array
        ? datos.map((x, i) => "Serie " + (i + 1))
        : desarma(datos);

    const arreglo = (datos instanceof Array
      ? datos
      : Object.values(datos)
    ).map((valor, i) => ({ etiqueta: etiquetas[i], valor: +valor }));

    return arreglo.map((x, i) => {
      return new rogSerie({
        indice: i,
        color: _rogPai.colores[i],
        etiqueta: x.etiqueta,
        valor: x.valor
      });
    });
  },

  extraeFn: (valor) => (valor ? window[valor.split("(").shift()] : valor)
};

class rogPai extends HTMLElement {
  #series = {
    series: []
  };

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  get name() {
    return this.getAttribute("name");
  }

  set value(datos) {
    this.setAttribute("value", JSON.stringify(datos));
  }

  get value() {
    let retorno = this.getAttribute("value");
    if(!retorno) if (this.carga) retorno = this.carga();
    return retorno || [];
  }

  set carga(valor) {
    if(typeof valor === "string") this.setAttribute("carga", valor);
    else this.value = valor();
  }

  get carga() {
    return this.hasAttribute("carga") ? _rogPai.extraeFn(this.getAttribute("carga")) : null; 
  }

  get series() {
    return this.#series.series;
  }

  get presentables() {
    return this.#series.presentables;
  }

  get total() {
    return this.#series.total;
  }

  set label(valor) {
    this._set("label", valor);
  }

  get label() {
    return this._get("label");
  }

  get height() {
    return this._get("height") || "3rem";
  }

  get borde() {
    return this._get("borde") || "black";
  }

  _get(que) {
    return this.getAttribute(que);
  }

  _set(que, valor) {
    this.setAttribute(que, valor);
  }

  get leyenda() {
    return this.shadow.querySelector(".leyenda");
  }

  TRsLeyenda() {
    return this.presentables.map((serie) => serie.leyenda(this.total)).join("");
  }

  gradiente(total) {
    const fmt = (valor) => (valor * 100).toFixed(2) + "%";
    let retorno = [];
    this.presentables.reduce((van, serie) => {
      let pc = van + serie.valor / total;
      retorno.push(`${serie.color} ${fmt(van)} ${fmt(pc)}`);
      return (van = pc);
    }, 0);
    return retorno.join();
  }

  toString() {
    return this.series.map((x) => x.toString());
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallBack() {}

  render() {
    this.#series = new Series(this.value);
    this.shadow.innerHTML = tmpROGPai(this);
  }

  static get observedAttributes() {
    return _rogPai.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    if (_rogPai.cambia[att]) _rogPai.cambia[att](this, viejo, nuevo);
    this.render();
  }
}

class Series {
  constructor(datos) {
    this.series = _rogPai.creaSeries(datos || []);
  }

  get presentables() {
    const series = this.series.slice(0, this.limite);
    if (this.sobran()) series.push(this.ultima);
    return series;
  }

  get total() {
    return this.series.reduce((total, serie) => (total += serie.valor), 0);
  }

  sobran() {
    return this.series.length > _rogPai.colores.length;
  }

  get limite() {
    return this.sobran() ? _rogPai.colores.length - 1 : this.series.length;
  }

  get ultima() {
    return new rogSerie({
      indice: this.limite,
      color: _rogPai.colores[this.limite],
      etiqueta: "Resto ...",
      valor: this.series
        .slice(this.limite)
        .reduce((resto, x) => (resto += x.valor || 0), 0)
    });
  }
}

class rogSerie {
  constructor(datos) {
    this.indice = datos.indice;
    this.color = _rogPai.colores[this.indice];
    this.etiqueta = datos.etiqueta || "Serie " + datos.indice;
    this.valor = datos.valor;
  }

  leyenda(total) {
    return `<tr>
       <td>${this.indice + 1}.</td>
       <td class="etiqueta" style="background-color: ${this.color}">${
      this.etiqueta
    }</td>
        <td class="tdValor">${this.valor}</td>
        <td class="tdPc">${_rogPai.Prc(this.valor / total)}</td>
    </tr>`;
  }

  toString() {
    return `<span class="etqColor" style="background-color: ${this.color}">${this.color}</span>
      ${this.etiqueta}:  
      ${this.valor} `;
  }
}

customElements.define("rog-pai", rogPai);

function tmpROGPai(obj) {
  return `<style>
          .marco {
              position: relative;
              min-height: ${obj.height};
              aspect-ratio: 1;
              display: inline-block;
          }
          .pai {
              background: conic-gradient(${obj.gradiente(obj.total)});
              min-height: 100%;
              border: 1px solid ${obj.borde};
              border-radius: 50%;
          }
          .leyenda {
              color: black;
              position: absolute;
              top: -2em;
              padding: .5em;
              scale: 0;
              transition: scale 250ms ease-out;
          }
          .leyenda.activa {
              scale: 1;
              z-index: 100;
          }
          .leyenda div {
            opacity: 1;
            background-color: lightgray;
            padding: .5em;
          }
          .leyenda .titulo {
            color: white;
            background-color: black;
          }
          .leyenda header {
            padding: .25em;
          }
          .etiqueta:hover {
            cursor: pointer;
            box-shadow: var(--sombra);
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
          .trTotal {
            font-weight: bold;
          }
          .tdValor {
            text-align: right;
          }
          .tdPc {
            text-align: right;          
          }
      </style>
      <div class="marco" title="${obj._get("label")}" onclick="_rogPai.clkPai(event)">
          <div class="pai"></div>
          <div class="leyenda vidrio">
          <div>
              <header class="titulo">
                  ${obj._get("label")}
                  <rog-cierra></rog-cierra>
              </header>
              <table>
                  <tr class="titulo">
                      <th>#</th>
                      <th>Serie</th>
                      <th>Valor</th>
                      <th>%</th>
                  </tr>
                  <tr class="trTotal titulo">
                    <td></td>
                    <td>Total</td>
                    <td class="tdValor">${obj.total}</td>
                    <td class="tdPc"></td>
                  </tr>
                  ${obj.TRsLeyenda()}
              </table>
              </div>
          </div>
      </div>`;
}
