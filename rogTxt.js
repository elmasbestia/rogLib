"use strict";
/*
 Objeto para búsqueda de Textos
    Permite buscar en un arreglo con textos una cadena en particular.
    Se crea la lista de elementos del arreglo que contienen la cadena
    Esta lista muestar la línea donde aparece la cadena
    Se muestra el texto completo al escoger

    Opciones:
        dom     Elemento a contener el objeto,    
        vnt     (Opcional) Al hacer click en uno de los resultados, el contenido se mostrará en este elemento
        datos   Arreglo con los textos
        extrae  Opcional: función permite extraer el texto del elemento del arreglo
        muestra  Opcional: función que se ejecuta al darle "click" a uno de los resultados
        campos  Lista de las propiedades del arreglo susceptibles de búsqueda
    Clases:
        rogLstTxt      Contenedor de la lista de resultados (<ul>)
        rogLiTxt         Resultados  (<li>)
        rogTxt           Contenedor del Objeto (<details>)
        rogCantTxt       Cantidad de elementos de la lista (<span.badge>)
*/

class rogTxt {
    constructor (opcs) {
        this.w = {
            fifan: []
        };

        this.dom    = opcs.dom;
        this.datos  = opcs.datos;
        this.campos = opcs.campos;
        this.vnt    = opcs.vnt;
        this.extrae = opcs.extrae;
        this.muestra = opcs.muestra;

        this.fn     = creaFn(this.campos,this.extrae)
        this.mstLi  = creaMstLi(this.campos,this.extrae)
    }

    get dom() {
        return this.w.dom;
    }

    set dom(dom) {
        this.w.dom = objDom(dom);
        this.w.dom.innerHTML = tmpTxt();

        this.w.txtBsq = this.dom.querySelector("INPUT");
        this.w.txtBsq.oninput = this.mst.bind(this);

        this.w.cant      = this.dom.querySelector(".rogCantTxt");

        this.w.lista     = this.dom.querySelector("OL");
        this.w.elementos = this.w.lista.getElementsByTagName("LI");
    }

    set datos(valor) {
        this.w.datos = valor;
    }

    get datos() {
        return this.w.datos;
    }

    set campos(valor) {
        this.w.campos = desarma(valor);
    }

    get campos() {
        return this.w.campos;
    }

    set vnt(dom) {
        this.w.vnt = objDom(dom);
    }

    get vnt() {
        return this.w.vnt;
    }

    get lista() {
        return this.w.elementos;
    }

    get cadena() {
        return this.w.txtBsq.value;
    }

    set cadena(valor) {
        this.w.txtBsq.value = valor;
        this.mst()
    }

    get exp() {
        return new RegExp(limpiaPlb(this.cadena), "i")
    }

    set cant(valor) {
        this.w.cant.innerHTML= valor;
    }

    mst() {
        this.w.fifan = bsqTxt(this.exp,this.datos,this.fn);

        this.cant = this.w.fifan.length;
        this.w.lista.innerHTML = this.w.fifan.map((x,i) =>
            domTxt(this.mstLi(x,i),"LI","rogLiTxt")
        ).join("");

        rogAsigna(this.lista,"onclick",this.chxLi.bind(this));
    }

    chxLi(event) {
        const indice = event.currentTarget.i;

        if (this.vnt) this.vnt.innerHTML = this.mstLi(this.datos[indice],indice);
        if (this.muestra) this.muestra(this.datos[indice],indice);
    }
}

function tmpTxt() {
    return `<details class="rogTxt">
        <summary>
            <input type="text">
            <span class="icono"><i class="fas fa-search"></i></span>        
            <span class="rogCantTxt badge"></span>
        </summary>
        <ol class="rogLstTxt"></ol>
    </details>`
}

function creaFn(campos,extrae) {
    /* 
        Crea la funcion que evalúa la búsqueda según:
        1. Si se definió campos, se evalua contra cada campo
        2. Si se definió la función "extrae" se usa esta
        3. Sino: se 
    */
    if(campos) {
        return (x,exp) => o(
            campos.map((e) => x[e]),
            exp
        )
    } else if(extrae) {
        return (x,exp) => exp.test(limpiaPlb(def(extrae(x))));
    } else {
        return (x,esp) => exp.test(limpiaPlb(def(x[que])))
    }
}

function creaMstLi(campos,extrae) {
    return (x,i) => {
        return i;
    }
}

function bsqTxt(exp,a,fn) {
    const f = x => fn(x,exp)
    return a.filter(f)
}

function o(a, exp) {
    // Evalua varios valores contra una misma expresión 
    return a.reduce((si, x) => (si = si || exp.test(limpiaPlb(x))), false);
}

