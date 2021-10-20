/*
    Manejo de los Elementos HTML del Objeto DPT
*/

import DPT from "./DPT";

class cmbDPT {
    constructor (props) {
        this.w = {};

        this.DPT = props.DPT;

        this.nivel = props.nivel;
        this.fijo = props.fijo;

        this.dom = props.dom;
        this.pae = props.pae;
        this.filho = props.filho;

        this.codigo = props.codigo;
    }

    set dom (dom) {
        let _dom = objDom(dom);
        if(_dom.tagName === "SELECT") this.w.dom = _dom;
        else {
            this.w.dom = document.createElement("SELECT");
            _dom.appendChild(this.w.dom);
        }
        this.w.dom.classList.add("data-nivel-"+this.nivel);
        this.w.dom.addEventListener("change",this.cambia.bind(this));
    }

    get dom () {
        return this.w.dom;
    }

    set codigo (valor) {
        this.revisaCambio(valor);
        this.w.dom.value = valor;
    }

    get codigo () {
        return this.w.dom.value;
    }

    set pae(dom) {
        if(dom) this.w.pae = objDom(dom);
    }

    get pae() {
        return this.w.pae;
    }

    set filho(dom) {
        if(dom) this.w.filho = objDom(dom);
    }

    get filho() {
        return this.w.filho;
    }

    get datos() {
        DPT.datos(this.codigo,this.nivel)
    }

    llena() {
        this.datos.map(cmbOpcion)
    }

    cambia(e) {
        this.codigo = e.target.value;
    }

    revisaCambio() {
        if(this.filho)  return true
    }
}

class lstDPT {}

export default class DPTDOM {
    constructor(props) {
        this.DPT = new DPT();

    }
}

class inpDPT {}

function cmbOpcion(x,nivel) {
    return txtDom(x.nombre,"OPTION",{value: x.codigo})
}
