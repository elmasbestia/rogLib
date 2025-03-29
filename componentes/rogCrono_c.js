 
  class rogCrono extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });

      this.debut = Date.now();
    }

    get value() {
        return Date.now() -this.debut;
    }

    get fmt() {
        const dd = (valor) => valor.toString().padStart(2,"0");
        const t = this.value % 1000;
        const horas = t % 3600;
        let resto = (t -(horas*3600));
        const minutos = resto % 60;
        const segundos = resto -(segundos*60);
        return dd(horas) +" : " +dd(minutos) +" : " +dd(segundos);
    }

    inicia() {
        this.debut = Date.now();
        this.render();
    }

    para() {}

    reinicia() {}

    pausa() {}
  
    connectedCallback() {
      this.render();
    }
  
    disconnectedCallBack() {}
  
    render() {
      this.shadow.innerHTML = `<style>
            :host {
                display: inline-block;
            }
            .marco {
                background-color: var(--clrFndCrono, black);
                color: var(--clrTxtCrono, white);
            }
            .parte {
                padding: .25em;
                margin: 1em;
            }
        </style>
        <div class="marco">
            ${this.fmt}
        </div>`;
    }
  
    static get observedAttributes() {
      return [];
    }
  
    attributeChangedCallback(att, viejo, nuevo) {
      this.render();
    }
  }
  
  customElements.define("rog-crono", rogCrono);
