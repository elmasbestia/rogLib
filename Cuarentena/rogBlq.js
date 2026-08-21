
class rogBlq {
    constructor(opciones) {
        this.w      = {}

        this.nb     = opciones.nb;
        this.titulo = opciones.titulo;
        this.dom    = opciones.dom;
        this.h      = document.createElement("SUMMARY");
        this.fmt    = opciones.fmt;

        this.dom.appendChild(this.h);
       
        this.w.detalle = creaDetalle(this,opciones);
        this.dom.appendChild(this.w.detalle.dom);

        this.alCambiar = opciones.alCambiar;
    }

    set dom(pDom) {
        this.w.dom = objDom(pDom) || document.querySelector(".rogBlq");
        this.w.dom.classList.add("rogBlq");
        this.w.dom.obj = this;
    }

    get dom () {
      return this.w.dom
    }
    
    get datos () {
        return this.tabla.datos;
    }
  
    set datos (valores = []) {
        this.tabla.datos = valores;
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
    
    get frm() {
        return this.w.detalle.frm;
    }
    
    get vnt() {
        return this.w.detalle.vnt;
    }

    set alCambiar(f) {
        if(f) {
            this.w.eventoCambio = new Event("cambia");
            this.dom.addEventListener("cambia",f)
        }
    }

    cambia() {
        if(this.w.eventoCambio) this.dom.dispatchEvent(this.w.eventoCambio)
    }
}

function creaDetalle(obj,opcs) {
    let xLi = -1;
    let tabla
    let _campos = desarma(opcs.stru).map(x => new rogCampo(x,opcs.stru[x]));

    function agrega() {
        xLi = -1;
        nea = regVacio(_campos);
        _vnt.titulo = "Agrega";
        mstForm(nea);
    }

    function actLista() { 
//        if(opcs.tabla) 
          if(tabla) tabla.render() 
          else tabla = creaTab(opcs.datos,obj.titulo,_campos);
//        else mstLista(obj.datos,_lista,null, {texto: opcs.texto}, chxLi);
        mstH();
        obj.cambia();
    }
    
    function creaTab(datos,titulo,campos) {
        const tab = document.createElement("rog-tab")
        tab.titulo = titulo;
        tab.fmt = opcs.fmt;
        tab.campos = campos;
        tab.datos = datos;
        tab.addEventListener("escogeFila",chxTr);
        return tab;
    }

    function chxTr(e) {
        const tr = e.detail.fila;
        if(tr) modifica(tr.dataset.fila);
    }
    
    function chxLi(e) {
        modifica(rogPrm(e));
    }

    function modifica(x) {
        xLi = x;
        _vnt.titulo = "Modifica";
        mstForm(obj.datos[xLi])
    }

    function mstLista() {
        alert("Sumatra!")
    }

    function mstH() {
        const caption = tabla.titulo;
        obj.h.innerHTML = caption.innerHTML;
        caption.innerHTML = "";

        obj.h.appendChild(creaBtn({etq: "+", fn: agrega, title: "Agregar "+obj.titulo}));
    }
    
    function mstForm(datos) {
        moveCorresponding(datos,_vnt.vnt.frm);
        _vnt.mst();
    }
    
    function lee(datos,btn) {
        console.log(btn)
        debugger
        if((xLi === -1) || (btn.title === "Duplica")) {
            obj.datos.push(datos);
            xLi = obj.datos.length;
        } else  if(btn.title === "Elimina") obj.datos.splice(xLi,1);
                else obj.datos[xLi] = Object.assign(obj.datos[xLi], datos);
        actLista();
        _vnt.mst();
    }
    
    const retorno = document.createElement("DIV");
    const _vnt    = new rogVnt({modal: true, tipo: "objeto"});
    
    const forma = new rogForm(_vnt.vnt,_campos,{cancela: _vnt.cierra.bind(_vnt)});
    forma.frm.lee = lee;
    _vnt.boton = _vnt.vnt.querySelector("[value=✘]");
  
    retorno.className = "rogDetBloque";
    actLista();
    retorno.appendChild(tabla);
  
  return { dom: retorno, frm: forma.frm, vnt: _vnt};
}
