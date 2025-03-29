class rogTraza extends HTMLElement {
    #cont = 0;
    #pasos = [];
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    get titulo() {
        return this.getAttribute("label") || "Bienvenid@s";
    }

    get lista() {
        return this.shadow.querySelector("ol");
    }

    get vnt() {
        return this.shadow.querySelector("div");
    }

    get ultima() {
        return this.lista.lastElementChild
    }

    agrega(txt) {
        this.lista.innerHTML += `<li>${txt}</li>`;
    }

    complementa(txt, codigo) {
        this.ultima.innerHTML += "<br>" +(codigo ? txt.replace("<","%") : txt);
    }
    
    linea(txt) {
        return `${++this.#cont} ${txt}.`;
    }

    mst(txt,prms = {}) {
        this.vnt.innerHTML += this.linea(
            isNaN(txt) ? 
            prms.html ? txt.replace("<","%") : txt 
            : this.#pasos[txt]
        ) + (prms.nobrinca ? "" : "<br>");
    }

    connectedCallback() {
        this.render();
    }
    
    disconnectedCallBack() {}
    
    render() {
        this.shadow.innerHTML = `<style>
            div {
                font-family: courier, monospace;
                margin: 2em;
                padding: 2em;
                background-color: #c0c0c0;
                color: teal;
                outline: thick double currentcolor;
            }
            </style>
            <div class="rogTraza">
                <h1>${this.titulo}</h1>
                <ol>
                </ol>
            </div>`;
            this.vnt.addEventListener("dblclick", e => e.target.innerHTML="");
    }
    
    static get observedAttributes() {
        return ["pasos"];
    }
    
    attributeChangedCallback(att, viejo, nuevo) {
        this.#pasos = Array(isArray(nuevo)) ? nuevo : nuevo.split(", ");
    }
}
    
customElements.define("rog-traza", rogTraza);
    