const _rogBlq = {
    chxTr: (e) => {
        obj = e.currentTarget.getRootNode().host;
        const tr = e.detail.fila;
        if(tr) _rogBlq.modifica(obj, tr.dataset.fila);
    },

    agrega: (e) => {
        obj = e instanceof Event ? 
            e.currentTarget.getRootNode().host : e;
        obj.xLi = -1;
        nea = regVacio(obj.tabla.campos);
        _rogBlq.mstForm(obj, nea);
    },

    modifica: (obj,x) => {
        obj.xLi = x;
        _rogBlq.mstForm(obj, obj.datos[x])
    },
   
    mstForm: (obj,datos) => {
        if(obj.hayCampos) {
            if(obj.frm) {
                obj.vnt.titulo = obj.xLi === -1 ? "Agrega" : "Modifica";
                moveCorresponding(datos,obj.frm);
                obj.vnt.mst();
            } else {
                /*
                obj.vnt = new rogVntFrm(
                    {modal: true, tipo: "objeto", visible: false},
                    {stru: obj.campos}
                );
                obj.frm = obj.vnt.frm;
                */

                obj.frm = new rogForm(obj.vnt.vnt, obj.campos);
                obj.frm.cancela = obj.vnt.mst.bind(obj.vnt);
                obj.frm.lee = _rogBlq.lee.bind(obj);
                obj.vnt.boton = obj.vnt.vnt.querySelector("[value=✘]");    
                    
                _rogBlq.mstForm(obj,datos);
            }
        }
    },

    lee: function (datos,btn) {
        if((this.xLi === -1) || btn.es("duplica")) {
            this.datos.push(datos);
            this.xLi = this.datos.length;
        } else  if(btn.es("elimina")) obj.datos.splice(this.xLi,1);
        else this.datos[obj.xLi] = Object.assign(this.datos[this.xLi], datos);
        this.cambia()
        this.vnt.mst();
    }
}

class rogBlq extends HTMLElement {
    #campos = {};
    #datos  = [];
    #cambios = 0;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });    
    }

    get titulo() {
        return this.getAttribute("titulo") || "Registro";
    }

    set titulo(valor) {
        this.setAttribute("titulo",valor);
    }

    get datos () {
        return this.#datos;
    }
  
    set datos (valor = []) {
        this.#datos = valor;
        this.render();
    }
    
    get campos () {
        return this.#campos;
    }
  
    set campos (valor = []) {
        this.#campos = valor
        this.frm = null;
        this.render();
    }

    get hayCampos() {
        return Boolean(this.tabla.campos.length)
    }

    get cambios() {
        return this.#cambios;
    }

    get auto() {
        return this.hasAttribute("auto") && (this.getAttribute("auto") !== "false");
    }

    set auto(valor) {
        this.setAttribute("auto", valor)
    }

    get fmt() {
        return this.getAttribute("fmt");
    }

    set fmt(valor) {
        this.setAttribute("fmt", valor)
    }

    get value() {
      return this.datos;
    }
    
    set value(datos) {
        this.datos = datos;
    }

    cambia() {
        this.#cambios++;
        this.tabla.datos = this.datos;
        this.cant.innerHTML = this.datos.length;
        this.dispatchEvent(new Event("change"))
    }
  
    connectedCallback() {
        this.render();
    }
  
    render() {
        this.shadowRoot.innerHTML = `<details class="rogBlq">
            <summary>
                <span id="cant">${this.datos.length}</span> ${this.titulo}
                <button value="+" title="Agregar" class="rogBtn" onclick="_rogBlq.agrega(event)">+</button>
            </summary>
            <rog-tab titulo="${this.titulo}"
                ${this.fmt ? `fmt="${this.fmt}"` : ""}
            ></rog-tab>
            <rog-vnt modal></rog-vnt>
        </details>`
        this.cant  = this.shadowRoot.querySelector("#cant");
        this.vnt = this.shadowRoot.querySelector("rog-vnt");
        this.tabla = this.shadowRoot.querySelector("rog-tab");
        this.tabla.campos = this.campos;
        this.tabla.datos  = this.datos;
        this.tabla.addEventListener("escogeFila",_rogBlq.chxTr);

        if(this.auto && this.hayCampos && !this.datos.length) _rogBlq.agrega(this)
    }
  
    static get observedAttributes() {
        return ["titulo", "fmt"];
    }
    
    attributeChangedCallback(att, viejo, nuevo) {
        this.render();
    }
  }

customElements.define("rog-blq", rogBlq);
