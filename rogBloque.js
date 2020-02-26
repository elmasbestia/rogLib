class rogBloque {
    constructor(opciones) {
        this._nb     = opciones.nb;
        this._dom    = objDom(opciones.dom);
        this._datos  = opciones.datos;
        this._cambio = false;

        this._dom.innerHTML = "";
        this._dom.classList.add("rogBloque");
        opciones._h = creaH();
        this._dom.appendChild(opciones._h);
        this._dom.appendChild(creaDetalle(opciones));
    }
    
    get datos () {
        return this._datos;
    }
    
    get siCambio () {
        return this._cambio;
    }
    
    ini(datos) {
        this._datos = datos || [];
    }
}

function creaH() {
    const _h = document.createElement("HEADER");

    /*
    _h.appendChild("H2");
    let _botones = document.createElement("NAV");
    _botones.appendChild(creaBtn("&#x25BC","btnBloque",chxBloque));
    _h.appendChild(_botones);
*/
    _h.onclick = chxBloque;
    
    return _h;
}

function creaBtn(txt,clase,fn) {
  let _btn = document.createElement("SPAN");
  _btn.innerHTML = txt;
  _btn.className=clase;
  _btn.onclick= fn;
  return _btn;
}

function chxBloque(e) {
  rogActiva(rogAncetre(e.target,"rogBloque"));
}

function creaDetalle(opcs) {
    let xLi = -1;

    function mstH() {
      opcs._h.innerHTML = domTxt(opcs.nb+spanCant(opcs.datos.length),"H4");
    }

    function actLista() { 
        mstLista(opcs.datos,_lista,null, {texto: opcs.texto}, chxLi);
        mstH();
    }
    
    function chxLi(e) {
        xLi = rogPrm(e);
        moveCorresponding(opcs.datos[xLi],_frm)
    }

    function agrega() {
        xLi = -1;
        nea = regVacio(_campos);
        moveCorresponding(nea,_frm);
    }
    
    function lee() {
        if(xLi >= 0) moveCorresponding(_frm,opcs.datos[xLi]);
        else {
            moveCorresponding(_frm,nea);
            opcs.datos.push(nea);
            xLi += opcs.datos.length;
        }
        actLista();
    }
    
    function cancela() {
        alert("Cancela")
    }
  
    let retorno   = document.createElement("DIV");
    let _lista    = document.createElement("DIV");
    let _planilla = document.createElement("DIV");
    let _frm      = document.createElement("FORM");
    let _botones  = document.createElement("NAV");
  
    retorno.className = "fles rogDetBloque";
    retorno.appendChild(_lista);
    retorno.appendChild(_planilla);

    actLista();
  
    let _campos = desarma(opcs.stru).map(x => new rogCampo(x,opcs.stru[x]));
    
    creaFormulario(_frm,_campos)

    let nea = regVacio(_campos);
  
    _botones.appendChild(creaBtn("✔","rogBtn",lee));
    _botones.appendChild(creaBtn("✘","rogBtn",cancela));
    _botones.appendChild(creaBtn("&#x2795","rogBtn",agrega));

    _planilla.appendChild(_frm);
    _planilla.appendChild(_botones);
  
  return retorno;
}
