class rogBtnAlt extends HTMLElement {
  #valores = [];
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  set valores(valor) {
    this.setAttribute("valores", valor);
  }

  get valores() {
    return this.getAttribute("valores");
  }

  set value(valor) {
    this.setAttribute("value", valor);
  }

  get value() {
    return this.getAttribute("value");
  }

  get height() {
    return this.getAttribute("height") || "2em";
  }

  btns() {
    return this.valores.split("|").map((btn, i) => {
      let opcs = btn.split("/");
      return {
        txt: opcs[0] || `opcion ${i}`,
        title: opcs[2] || `opcion ${i}`,
        valor: opcs[1] || i
      };
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = tmprogBtnAlt(this);
    this.shadowRoot.querySelector(".marco").addEventListener("click", (e) => {
      e.stopPropagation();
      let obj = e.currentTarget.getRootNode().host;
      let btn = e.target.closest("button");

      obj.value = btn.dataset.valor == obj.value ? null : btn.dataset.valor;
      obj.dispatchEvent(new Event("click"));
    });
  }

  static get observedAttributes() {
    return ["value"];
  }

  attributeChangedCallback(att, viejo, nuevo) {
    this.render();
  }
}

customElements.define("rog-btn-alt", rogBtnAlt);

function tmprogBtnAlt(obj) {
  return `<style> 
    .marco {
      display: inline-block;
      border: 5px groove currentcolor;
      border-radius: 10px;
      background-color: var(--clrFndObj);
      color: var(--clrTxtObj);
      height: ${obj.height};
    }

    .marco button {
      border: none;
    }

    button {
        margin: 1px;
        aspect-ratio: 1;
        background-color: #fff;
        text-align: center;
        font-size: 1.2em;
        border-radius: 15%;
        color: #777;
        cursor: pointer;

        box-shadow:  0 6px 35px rgba(0, 0, 0, .7);
    }

    button[selected] {
        background-color: #eee;
        box-shadow: inset 0 6px 10px rgba(0, 0, 0, .5);
        color: rgba(0,255,0,.7);
    }
  </style>
  <div class="marco">
    ${obj
      .btns()
      .map(
        (btn) => `<button class="rogBtn" 
                title="${btn.title}" 
                data-valor="${btn.valor}"
                ${btn.valor == obj.value ? " selected" : ""}
                >
      ${btn.txt}
    </button>`
      )
      .join("")}
  </div>`;
}
