const _rogF = {
    observados: ["value","fmt"],

    cambia: {},

    difGMT: Date.prototype.getTimeZoneOffset * 1000
}

class rogF extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });  
    }

    get name() {
        return this.getAttribute("name");
    }

    set value(valor) {
        this.setAttribute("value",valor) 
    }
    
    get value() {
        return this.getAttribute("value") ? new Date(this.getAttribute("value")) : new Date();
    }

    set fmt(valor) {
        this.setAttribute("fmt",valor);
    }

    get fmt() {
        return this.getAttribute("fmt") || "serio";
    }

    get clase() {
      let f = new rogFecha(this.value);
      return f.clase();
    }

    toString(valor = this.value,fmt = this.fmt) {
        return rogFmtFecha(valor)[fmt]();
    }

    connectedCallback() {
        this.render();
    }
  
    render() {
        this.shadow.innerHTML = tmprogF(this);
    }
    
    static get observedAttributes() {
        return _rogF.observados;
    }
    
    attributeChangedCallback(att, viejo, nuevo) {
        if (_rogF.cambia[att]) _rogF.cambia[att](this, viejo, nuevo);
        this.render();
    }
}
  
customElements.define("rog-fecha", rogF);

function tmprogF(obj) {
    return `<style>
        </style>
        <time class="${obj.clase}" datetime='${obj.toString(obj.value,"amd")}'>${obj.toString()}</datetime>`;
}
