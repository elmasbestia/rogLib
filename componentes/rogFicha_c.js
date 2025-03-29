//import "./rogFoto_c";

class rogFicha extends HTMLElement {
  #mnu;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  set mnu(valor) {
    this.mnu = typeof valor === "string" ? window[valor.split("(")[0]] : valor;
  }

  get mnu() {
    return this.#mnu
      ? this.#mnu
      : (() => {
          let mnu = this.getAttribute("menu");
          if (mnu) this.mnu = mnu;

          return this.#mnu;
        })();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallBack() {}

  render() {
    this.shadow.innerHTML = tmpROGFicha(this);
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(att, viejo, nuevo) {
    this.render();
  }
}

customElements.define("rog-ficha", rogFicha);

function tmpROGFicha(obj) {
  return `<style>
          .ficha {
              height: 100%;
              display: flex;
              gap: .25em;
              margin: 1.25em;
          }
          
          main {
            height: 100%;
              background-color: var(--clrFndFicha, #fcfcfc);
              color: var(--clrTxtFicha, black);
              display: flex;
              justify-content: center;
              align-items: center;
          
              border-radius: 10px;
              padding: 10px;
              gap: 10px;
          }
                   
          [name=detalles] {
              background-color: limegreen;
              display: flex;
              flex-direction: column;
              justify-content: center;
          }
          
          [name=titulo] {
              font-weight: 600;
              line-height: 1.1em;
          }
          
          [name=subtitulo] {
              font-weight: 500;
              font-size: 0.8em;
              color: rgba(0, 0, 0, 0.6);
          }
          
          [name=masDetalles] {
              max-width: 40ch;
              display: none;
              overflow: scroll;
          }
          
          .ficha:hover {
            height: 150%;
          }
          .ficha:hover [name=masDetalles] {
              display: block;
          }
          
          menu {
              all: unset;
          
              padding: 1em;
              background-color: var(--clrFndFicha, #fcfcfc);
              color: var(--clrTxtFicha, #fcfcfc);
              border-radius: 10px;
              cursor: pointer;
              transition: 0.5s;
          
              display: flex;
              gap: .5em;
              justify-content: center;
              align-items: center;
              flex-direction: column;
          }
          </style>
          <div class="ficha">
              <main>
                  <rog-foto class="blanco" label="${obj.getAttribute(
                    "foto"
                  )}" alt="Foto">
                  </rog-foto>
                  <div class="detalles blanco">
                      <slot name="titulo"></slot>
                      <slot name="subtitulo"></slot>
                      <slot name="masDetalles"></slot>
                  </div>
              </main>
              ${
                obj.mnu
                  ? `<menu onmouseover="${obj.getAttribute(
                      "menu"
                    )}"><slot name="menu"></slot></menu>`
                  : ""
              }
          </div>`;
}
