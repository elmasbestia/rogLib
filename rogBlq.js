class rogBlq {
    constructor(opciones) {
        this.w      = {}

        this.nb     = opciones.nb;
        this.dom    = opciones.dom;
        this.h      = document.createElement("SUMMARY");
        this.dom.appendChild(this.h);
        this.datos  = opciones.datos;
        this.detalle = creaDetalle(this,opciones);

        this.dom.appendChild(this.detalle.dom);
		
		this.lee = opciones.lee;
        
        this.mst = this.detalle.mst;
    }

    set dom(pDom) {
        this.w.dom = objDom(pDom) || document.querySelector("rogBloque") 
        if(!((this.w.dom) && (this.w.dom.tagName === "DETAILS"))) {
            let _dom = document.createElement("DETAILS");
            this.w.dom.appendChild(_dom);
            this.w.dom = _dom;
        }
        this.w.dom.classList.add("rogBloque");
    }

    get dom () {
      return this.w.dom
    }
    
    get datos () {
        return this.w.datos;
    }
  
    set datos (valores) {
        this.w.datos = valores || [];
    }
    
    get value() {
      return this.datos;
    }
    
    set value(datos) {
        this.datos = datos;
    }

	set lee(lee) {
    	this.w.lee = {};
        if(lee !== undefined) {
            if(lee instanceof Function) this.w.lee.post = lee;
            else {
                this.w.lee = Object.assign(lee);
            }
		}
	}

    agrega(datos) {
        this.datos.push(datos);
        this.mst();
    }
}

function creaDetalle(obj,opcs) {
    let xLi = -1;
    let tabla
    let _campos = desarma(opcs.stru).map(x => new rogCampo(x,opcs.stru[x]));

    function hBlq() {
        return obj.nb
            +spanCant(obj.datos.length)
            +creaBtn("&#x2795","spanBtn btnAgrega",{ onclick: agrega, title: "Agregar "+obj.nb},true)
    }

    function agrega() {
        xLi = -1;
        nea = regVacio(_campos);
        _vnt.titulo = "Agrega";
        mstForm(nea);
    }

    function mst() { 
        tabla ? tabla.mst() : tabla = new rogTab(obj.datos,_lista,opcs.nb,_campos);
        mstH();
    }
    
    function chxLi(e) {
        xLi = rogPrm(e);
        _vnt.titulo = "Modifica";
        mstForm(opcs.datos[xLi])
    }

    function mstH() {
        obj.h.innerHTML = hBlq(obj);
        obj.h.querySelector(".btnAgrega").onclick = agrega;
    }
    
    function mstForm(datos) {
        moveCorresponding(datos,_vnt.vnt.frm);
        _vnt.mst();
    }
    
    function lee(datos) {
		let retorno = true;
        debugger
		if (obj.w.lee.pre) retorno = obj.w.lee.pre(datos);
		if(retorno) {
			if(xLi === -1) {
                tabla.agrega(datos); //	obj.datos.push(datos);
				xLi += obj.datos.length;
			} else obj.datos[xLi] = Object.assign(obj.datos[xLi], datos);
			if (obj.w.lee.post) retorno = obj.w.lee.post(datos);
		}
        mst();
        _vnt.mst()
    }
    
    function cancela() {
        alert("Cancela")
    }
    
    let _dom   = document.createElement("DIV");
    let _lista    = document.createElement("DIV");
    let _vnt      = new rogVnt({modal: true, tipo: "objeto"});
    
    const forma = new rogForm(_vnt.vnt,_campos)
    forma.frm.lee = lee;
  
    _dom.className = "rogDetBloque";
    _dom.appendChild(_lista);

    mst();
  
    return {dom: _dom, frm: forma.frm, mst, vnt: _vnt};
}
