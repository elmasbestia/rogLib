
class rogVisAtr extends HTMLElement {
  #for;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  set for(valor) {
    if (typeof valor === "string") this.setAttribute("for", valor);
    else {
      this.#for = valor;
      this.render();
    }
  }

  get for() {
    return this.#for;
  }

  get atributos() {
    return this.for
      ? this.for
          .getAttributeNames()
          .map(
            (x, i) => `<tr>
              <td>${i + 1}</td>
              <td><strong>${x}</strong></td>
              <td>${this.for.getAttribute(x)}</td>
            </tr>`
          )
          .join("<br>")
      : "";
  }

  get marco() {
    return this.shadow.querySelector(".atributos");
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallBack() {}

  render() {
    this.shadow.innerHTML = tmpROGVisAtr(this);

    const estilo = this.getAttribute("style");
    this.marco.style = estilo;
  }

  static get observedAttributes() {
    return ["for"];
  }

  attributeChangedCallback(att, viejo, nuevo) {
    this.#for =
      typeof nuevo === "string" ? document.querySelector(nuevo) : nuevo;

    this.render();
  }
}

customElements.define("rog-visor-atr", rogVisAtr);

function tmpROGVisAtr(obj) {
  return `<style>
    .atributos {
      background-color: #f0f0f0;
      color: black;
      border: 1px solid black;
      padding: 1em;
      border-radius: 3px;
    }
  </style>
  <div class="atributos">
    <table>
      <tr>
        <th>#</th>
        <th>Atr.</th>
        <th>Valor</th>
      </tr>
      ${obj.atributos}
    </table>  
  </div>`;
}
