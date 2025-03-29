class rogAguaita extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    get titulo() {
        return this.getAttribute("titulo");
    }

    set titulo(valor) {
        this.setAttribute("titulo",valor);
    }

    get subtitulo() {
        return this.getAttribute("subtitulo");
    }

    set subtitulo(valor) {
        this.setAttribute("subtitulo",valor);
    }

    get cant() {
        return this.getAttribute("cant");
    }

    set cant(valor) {
        this.setAttribute("cant",valor);
    }

    get dialogo() {
        return this.shadow.querySelector("dialog");
    }

    get open() {
        const open = this.getAttribute("open");
        return open ? open !== "false" : open === '';
    }

    cierra() {
        this.dialogo.open = false;
        this.setAttribute("open",false);
    }
    
    mst() {
        this.setAttribute("open",true);
    }
  
    connectedCallback() {
        this.render();
    }
    
    disconnectedCallBack() {}

    render() {
        this.shadow.innerHTML = tmpROGAguaita(this);
    }
  
    static get observedAttributes() {
        return ["open","cant","titulo","subtitulo"];
    }
    
    attributeChangedCallback(att, viejo, nuevo) {
        this.render();
    }    
}

customElements.define("rog-aguaita",rogAguaita);

function tmpROGAguaita(obj) {
    return `<style>
            .vidrio {
                background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
                backdrop-filter: blur(2rem);
            }

            dialog {
                text-align: center;
                border-radius: 10px;
            }
            div {
                background: linear-gradient(to left bottom, var(--clrFndObj), var(--clrTxtObj));
                padding: 3em;
            }
            p {
                font-size: .8em;
            }
        </style>
        ${obj.open ? 
            `<dialog open class="vidrio">
                <h1>${obj.titulo}</h1>
                ${
                    obj.subtitulo ? `<h2>${obj.subtitulo}</h2>` : ""
                }
                ${
                    obj.cant ? `<div>Procesando ${obj.cant} Registros</div>` : ""
                }
                <p><em>Falta mucho por hacer, pero estamos trabajando</em></p>
                <div id="fondo">
                    <img src="https://rafagomez.neocities.org/rogLib/Imagenes/Espera 3.gif" alt="Espera, espera, porque ketchup Heinz">
                </div>
            </dialog>`
            : ""
        }`;
}