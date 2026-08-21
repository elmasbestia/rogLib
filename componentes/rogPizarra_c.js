/*
    Espacio para mostrar mensajes
*/

const _rogPizarra = {}

class rogPizarra extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "closed"}); // { mode: "open" }
    }

    get vnt() {
        return this.shadow.querySelector("#vnt")
    }

    set texto(valor) {
        this.vnt.innerHTML = valor;
    }
    get texto() {
        return this.vnt.innerHTML;
    }

    set alverre(valor) {
        this.setAttribute("alverre",valor);
    }
    get alverre() {
        return this.hasAttribute("alverre") && (this.getAttribute("alverre") !== "false");
    }

    msj(valor) {
        this.texto = this.alverre ?
        valor +"<br/>" +this.texto :
        this.texto + valor +"<br/>";
    }

    limpia() {
        this.texto = "";
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                #vnt {
                    background-color: white;
                    color: black;
                    font-family: courier, sans-serif;
                }
            </style>
            <div id="vnt"></div>`
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(att, viejo, nuevo) {
        this.render();
    }  
}
  
customElements.define("rog-pizarra", rogPizarra);
