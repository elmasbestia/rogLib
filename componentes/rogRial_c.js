/**
 * Objeto que maneja montos en varias monedas
 * Sobre la base de:
 * 1. Una serie de datos
 * 2. Una serie de divisas
 *
 * Para efectos de este material llamaremos "valor" a los montos a ser procesados, bien sea como propiedad en el arreglo de datos o como resultado de evaluar una funcion.
 * Asi mismo llamaremos "divisa" al valor que identifique al tipo de moneda en el arreglo de datos.
 *
 * Los datos deben responder a las siguientes premisas:
 * 1. Pueden ser un arreglo de objetos o un objeto
 * 1.1 El objeto debe contener:
 * 1.1.1 Una propiedad "monto" (opcional) que puede ser:
 * 1.1.1.1 El nombre del valor (Ej.: "precio") o
 * 1.1.1.2 Una funcion que aplicada sobre los elementos en el arreglo de datos, resulte en el valor (Ej.: "x => x.debe -x.haber").
 * 1.1.1.3 De no existir esta propiedad se asume que en el arreglo de datos el valor se llama "monto".
 * 1.1.2 Una propiedad "divisa" con el nombre de la divisa (Ej.: "moneda"). De no existir esta propiedad asumiremos que la divisa se llama "divisa".
 * 1.1.3 Un arreglo "datos" con la serie de datos. Estos deben:
 * 1.1.3.1 Contener las propiedades referenciadas en las propiedades anteriores.
 * 2. El arreglo de datos se corresponde con el analogo en el punto anterior.
 *
 * Las divisas deben obedecer a las siguientes premisas:
 * 1. El primer elemento de la serie se considerara la divisa base (Deberia tener tasa = 1).
 * 2. Deben tener por lo menos dos propiedades: "divisa" y "tasa".
 * 3. "divisa" debe corresponder a los valores en la serie de datos.
 * 4. "tasa" debe ser en relacion a la divisa base.
 * 5. La conversion entre las otras divisas se hara multiplicando por una tasa y dividiendo por la otra.
 */

const _rogRial = {
  observados: ["divisa"],

  cambia: {},

  cambio: {},

  calcula: (obj) => {
    obj.vnt.innerHTML = _rogRial.titulos;
    return obj.datos.reduce((total, dato) => {
      let alCambio = dato.monto;
      if (dato.divisa !== obj.divisa)
        alCambio = dato.monto * _rogRial.tasa(obj.divisa, dato.divisa);
      total += alCambio;
      _rogRial.mst(obj, dato.monto, dato.divisa, alCambio, total);
      return total;
    }, 0);
  },

  mst: (obj, ...datos) => {
    obj.vnt.innerHTML +=
      Array.from(datos).reduce(
        (linea, x) =>
          (linea += `<td ${
            isNaN(x) ? `class='divisa'>${x}` : `>${obj.fmt(x)}`
          }</td>`),
        "<tr>"
      ) + "</tr>";
  },

  tasa: (divisa, otraDivisa) => {
    let tasa = 1;
    if (divisa === "Bs.") tasa = _rogRial.cambio[otraDivisa];
    else if (otraDivisa === "Bs.") tasa = 1 / _rogRial.cambio[divisa];
    else tasa = _rogRial.cambio[otraDivisa] / _rogRial.cambio[divisa];
    return tasa;
  },

  chxDivisa: (e) => {
    e.target.obj.divisa = e.target.value;
  },

  titulos: `<tr class="titulos">
        <th>Monto</th>
        <th>Divisa</th>
        <th>Al cambio</th>
        <th>Acumulado</th>
      </tr>`,

  arreglaDatos: (obj, datos) => {
    if (Array.isArray(datos)) {
      return datos;
    } else {
      const fMonto = datos.monto
        ? typeof datos.monto === "string"
          ? (x) => ((nb) => (x) => x[nb])(datos.monto)
          : datos.monto
        : (x) => x.monto;
      return datos.datos.reduce((retorno, x) => {
        retorno.push({
          monto: fMonto(x),
          divisa: datos.divisa ? x[datos.divisa] : x.divisa
        });
        return retorno;
      }, []);
    }
  }
};

class rogRial extends HTMLElement {
  #datos = [];
  #valor = 0;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  set datos(datos) {
    this.#datos = _rogRial.arreglaDatos(this, datos);
    this.render();
  }

  get datos() {
    return this.#datos;
  }

  set divisas(datos) {
    if (Array.isArray(datos))
      datos.forEach((divisa) => {
        _rogRial.cambio[divisa.divisa] = divisa.tasa;
      });
    else _rogRial.cambio = datos;

    this.render();
  }

  set divisa(valor) {
    this.setAttribute("divisa", valor);
  }

  get divisa() {
    return this.getAttribute("divisa") || "Bs.";
  }

  get value() {
    return this.#valor;
  }

  get vnt() {
    return this.shadow.querySelector("TABLE");
  }

  get mnt() {
    return this.shadow.querySelector("INPUT");
  }

  fmt(valor = this.value) {
    return new Intl.NumberFormat("VES", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  }

  calcula() {
    this.#valor = _rogRial.calcula(this);
    this.mnt.value = this.fmt();
  }

  opcDivisas() {
    const lista = Array.from(Object.keys(_rogRial.cambio)).reduce(
      (lista, divisa) => (lista += `<option>${divisa}</option>`),
      ""
    );
    return lista || "<option>Bs.</option>";
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallBack() {}

  render() {
    this.shadow.innerHTML = tmpROGRial(this);
    this.calcula();
    this.shadow.querySelector("select").value = this.divisa;
    this.shadow.querySelector("select").obj = this;
  }

  static get observedAttributes() {
    return _rogRial.observados;
  }

  attributeChangedCallback(att, viejo, nuevo) {
    if (_rogRial.cambia[att]) _rogRial.cambia[att](this, viejo, nuevo);
    this.render();
  }
}

customElements.define("rog-rial", rogRial);

function tmpROGRial(obj) {
  return `<style>
      input {
        text-align: right;
      }
      .mnucito { 
        border-radius: 10px;
        padding: 1.25em 1.75em;
        box-shadow: 0 1px 3px 0 currentColor;
      }
      .vidrio {
        background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
      }

      .mnuFlotante {
        position: absolute;
        z-index: 2;
        scale: 0;
		    transform-origin: center;
        transition: scale 500ms ease-out;
      }

      table {
        opacity: 1;
        color: black;
        background-color: white;
      }

      INPUT:hover ~ .mnuFlotante {
        scale: 100%;
      }
    </style>
    <input type="text" readonly>
    <select onchange="_rogRial.chxDivisa(event)">
        ${obj.opcDivisas()}
    </select>
    <div class="mnuFlotante mnucito vidrio">
    <table>
      ${_rogRial.titulos}
    </table></div>`;
}
