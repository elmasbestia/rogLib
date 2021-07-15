
class rogBlq {
    constructor(opciones) {
        this.w      = {}

        this.nb     = opciones.nb;
        this.titulo = opciones.titulo;
        this.dom    = opciones.dom;
        this.datos  = opciones.datos;

        this.xLi = -1;

        this.campos = opcs.stru;

        this.que = opcs.tabla ? "tabla" : "lista";
       
        this.vnt = new rogVnt({modal: true, tipo: "objeto"});
        this.frm = new rogForm(this.vnt.vnt,this.campos)
        this.frm.frm.lee = this.lee;
    }

    set dom(pDom) {
        this.w.dom = objDom(pDom) || document.querySelector(".rogBlq");
        this.w.dom.classList.add("rogBlq");
        this.w.dom.innerHTML = tmpDomDetalle();
        this.w.dom.querySelector("SUMMARY").innerHTML = this.titulo 
            +spanCant(0)
            +creaBtn("&#x2795","spanBtn",{ title: "Agregar "+this.titulo },true)
        this.w.dom.querySelector(".spanBtn").onclick = this.agrega;
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

    get tabla () {
        if(this.w.detalle) return this.w.detalle.tab;
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

    set campos(stru) {
        this.w.campos = desarma(this.w.stru).map(x => new rogCampo(x,this.w.stru[x]));
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
            Array.from(tabla.tabla.querySelectorAll("tr")).forEach(x => x.onclick= chxLi)
        } else mstLista(this.datos,this.domQue,null, {texto: opcs.texto}, chxLi);
        this.cant = this.datos.length;
    }

    mstFrm(i) {
        this.xLi = i;
        this.vnt.titulo = this.xLi === -1 ? "Agrega" : "Modifica";

        moveCorresponding(this.regActual,this.vnt.vnt.frm);
        this.vnt.mst();
    }
    
    lee(datos) {
        if(xLi === -1) {
            obj.datos.push(datos);
            xLi += obj.datos.length;
        } else obj.datos[xLi] = Object.assign(obj.datos[xLi], datos);
        this.mst();
        _vnt.mst()
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

function creaDetalle(obj,opcs) {
    let xLi = -1;
    let tabla;
    let _campos = desarma(opcs.stru).map(x => new rogCampo(x,opcs.stru[x]));

    function nbBtnAgrega() {
        return "btnAgrega"+opcs.nb
    }

    function hBlq() {
        return obj.titulo
            +spanCant(obj.datos.length)
            +creaBtn("&#x2795","spanBtn",{ onclick: agrega, title: "Agregar "+obj.titulo, id: nbBtnAgrega()},true)
    }

    function actLista() { 
        if(opcs.tabla) {
            tabla ? tabla.mst() : tabla = new rogTab(obj.datos,_lista,null,_campos);
            Array.from(tabla.tabla.querySelectorAll("tr")).forEach(x => x.onclick= chxLi)
        } else mstLista(obj.datos,_lista,null, {texto: opcs.texto}, chxLi);
        mstH();
    }

    function agrega() {
        mstForm(-1);
    }
    
    function chxLi(e) {
        mstForm(e.currentTarget.dataset.fila);
    }

    function mstH() {
        obj.h.innerHTML = hBlq(obj);
        rogAsigna("#"+nbBtnAgrega(),"onclick",agrega)
    }
    
    function mstForm(i) {
        xLi = i === undefined ? -1 : i;
        _vnt.titulo = xLi === -1 ? "Agrega" : "Modifica";

        moveCorresponding(obj.datos[xLi] || regVacio(_campos),_vnt.vnt.frm);
        _vnt.mst();
    }
    
    function lee(datos) {
        debugger
        if(xLi === -1) {
            obj.datos.push(datos);
            xLi += obj.datos.length;
        } else obj.datos[xLi] = Object.assign(obj.datos[xLi], datos);
        actLista();
        _vnt.mst()
    }
    
    let retorno   = document.createElement("DIV");
    let _lista    = document.createElement("DIV");
    let _vnt      = new rogVnt({modal: true, tipo: "objeto"});
    
    const forma = new rogForm(_vnt.vnt,_campos)
    forma.frm.lee = lee;
  
    retorno.className = "rogDetBloque";
    retorno.appendChild(_lista);

    actLista();
  
  return { dom: retorno, frm: forma.frm, vnt: _vnt, tab: tabla, mst: actLista };
}
