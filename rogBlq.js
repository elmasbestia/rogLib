
class rogBlq {
    constructor(opciones) {
        this.w      = {}

        this.nb     = opciones.nb;
        this.titulo = opciones.titulo;
        this.dom    = opciones.dom;
        this.que    = opciones.tabla ? "tabla" : "lista";

        this.xLi = -1;
       
        this.campos = opciones.stru;

        this.vnt = new rogVnt({modal: true, tipo: "objeto"});
        this.frm = new rogForm(this.vnt.vnt,this.campos)
        this.frm.frm.lee = this.lee.bind(this);

        this.datos  = opciones.datos;
    }

    set dom(pDom) {
        this.w.dom = objDom(pDom) || document.querySelector(".rogBlq");
        this.w.dom.classList.add("rogBlq");
        this.w.dom.innerHTML = tmpDomDetalle();
        this.w.dom.querySelector("SUMMARY").innerHTML = this.titulo 
            +spanCant(0)
            +creaBtn("&#x2795","spanBtn",{ title: "Agregar "+this.titulo },true)
        this.w.dom.querySelector(".spanBtn").onclick = this.agrega.bind(this);
    }

    get dom () {
      return this.w.dom
    }

    get datos () {
        return this.w.datos;
    }

    set datos (valores = []) {
        // Se mantiene la identidad del arreglo usado para crear el bloque
        if(this.w.datos) this.w.datos.splice(0,this.w.datos.length, ...valores); 
        else this.w.datos = valores;
        this.mst();
    }

    get cambio () {
        return this.w.cambio;
    }
    
    get value() {
      return this.datos;
    }
    
    set value(datos) {
        this.datos = datos;
    }

    set xLi(valor) {
        this.w.xLi = isNaN(valor) ? -1 : valor;
    }

    get xLi() {
        return this.w.xLi;
    }
  
    set cant(n) {
        this.dom.querySelector(".badge").innerHTML = n;
    }

    get regActual() {
        return this.datos[this.xLi] || regVacio(this.campos)
    }

    set regActual(datos) {
        this.datos[this.xLi] = Object.assign(this.datos[this.xLi], datos)
    }

    set campos(stru) {
        this.w.campos = desarma(stru).map(x => new rogCampo(x,stru[x]));
    }

    get campos() {
        return this.w.campos;
    }

    get domQue() {
        return this.dom.querySelector(".rogDetBlq");
    }
    
    mst() {
        if(this.que === "tabla") {
            this.tabla ? this.tabla.mst() : this.tabla = new rogTab(this.datos,this.domQue,null,this.campos);
            Array.from(this.tabla.tabla.querySelectorAll("tr")).forEach(x => x.onclick= this.chxLi.bind(this))
        } else mstLista(this.datos,this.domQue,null, {texto: this.texto}, this.chxLi.bind(this));
        this.cant = this.datos.length;
    }

    mstFrm(i) {
        this.xLi = i;

        moveCorresponding(this.regActual,this.vnt.vnt.frm);
        this.vnt.mst();
    }

    agrega() {
        this.vnt.titulo = "Agrega";
        this.mstFrm(-1);
    }
    
    chxLi(e) {
        this.vnt.titulo = "Modifica";
        this.mstFrm(e.currentTarget.dataset.fila);
    }

    lee(datos) {
        if(this.xLi === -1) {
            this.datos.push(datos);
            this.xLi += this.datos.length;
        } else this.regActual = datos;
        this.mst();
        this.vnt.mst()
    }
}

function tmpDomDetalle() {
    return `<summary>
    </summary>
    <div class="rogDetBlq">
    </div>`
}
    
function mstLista() {
    alert("Sumatra!")
}
