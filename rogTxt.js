"use strict";
// Objeto para búsqueda de Textos
// Permite buscar en un arreglo de textos una cadena en particular.
// Se crea la lista de elementos del arreglo que contienen la cadena
// Esta lista muestar la línea donde aparece la cadena
// Se muestra el texto completo al escoger
// Uso:
//     var x = new rogTxt(
//     @param nbBsqDom  Elemento que contiene la cadena a buscar (Normalmente un <input>), //
//     @param nbVntTxt  Nombre del elemento donde se mostrarán los resultados de la búsqueda
//     (Ambos pueden ser el id o la referencia al propio elemento DOM),
//     @param txts      Arreglo de textos,
//     @param fn        Funciones, puede ser una sola o un arreglo:
//                      La primera es la que permite extraer el texto del elemento del arreglo (Si el elemento es un objeto, por ejemplo) (fnSaca)
//                      La segunda se ejecuta al mostrar el texto (fnMst)
//      );
// Para efectos de CSS se pueden usar las clases:
//     rogTxtLista      Contenedor de la lista (<div>)
//     rogLiTxt         Líneas que contienen la cadena  (<li>)
//     rogTxt           Contenedor del Texto (<div>)
//     rogCantTxt       Cantidad de elementos de la lista

function rogTxt(nbBsqDom, nbVntTxt, txts, fn) {
    var cadena;
    var fifan = [], todas = false;
    var dom, vntTxt, txtLista, txtDom;
    var fnSaca, fnMst;
    
    function mstTxt() {
        txtDom.innerHTML = this.txt;
        if (fnMst) { fnMst(this) }
    }
    
    function getTxt() { return this.txt; }
    
    function quitaEsp(txt) {
      var retorno = "";
      var car = "", xcar = 0, ncar = txt.length, brinca = false;
      
      for(xcar = 0; xcar < ncar; ++xcar) {
        car = txt.charAt(xcar);
        if (brinca) { brinca =  car != ">" }
        else {
            if (car === "<") { brinca = true }
            else {
              if (car === "\\") { xcar++ }
              else {
                retorno += car;
              }
            }
        }
      }
      return retorno;
    }

    function getLinea() { return quitaEsp(this.txt.slice(this.debut,this.fin)) }

    function cambio() {
        busca();
        vntTxt.style.display = cadena ? "flex" : "none";
        mstlista();
    }
    
    function mstlista() {
        if (fifan.length) {
            txtLista.innerHTML = "";
            let cont = document.createElement("P");
            cont.innerHTML = "<span class='rogCantTxt'>" + fifan.length + "</span> resultados encontrados";
            txtLista.appendChild(cont);
            var lista = document.createElement("OL");
            txtLista.appendChild(lista);
            
            fifan.forEach(x => {
                let li = document.createElement("LI");
                li.className = "rogLiTxt";
                li.appendChild(document.createTextNode(x.x +" " +x.linea()));
                li.txt = x.txt;
                li.onclick = mstTxt;

                lista.appendChild(li);
            });
        } else {
            txtLista.innerHTML = "<p>No encontré ningún texto que contenga '"+cadena+"'</p>";
        }
    }
    
    function limpiaTxt(txt) {
        var retorno = txt.toLowerCase();
        // caracteres a "limpiar"
        var especiales = [/á/g, /é/g, /í/g, /ó/g, /ú/g, /ü/g], vocales = "aeiouu";
        
        if (retorno) {
            especiales.forEach((x,i) => {
                retorno = retorno.replace(x,vocales.charAt(x));
            });
        }
        return retorno;
    }
    
    function sacaTxt(elemento, fn) {
        if (typeof elemento === "object") { return fn(elemento)}
        else {return elemento}
    }

    function busca() {
        cadena = bsq.value;
        var txtABuscar = limpiaTxt(cadena);
        fifan = [];
        
        function salto (txt, atras=false) {
            let pos = 0, xSalto = 0, buscar = true;
            let tSalto = ["<br","\l"];
            do {
                if (atras) {pos = txt.lastIndexOf(tSalto[xSalto])}
                else {pos = txt.indexOf(tSalto[xSalto])}
                xSalto++;
                buscar = ((pos === -1) && (xSalto < tSalto.length));
            } while (buscar);
            return pos;
        }
       
        if (txtABuscar) {
            let x, txt, txtLimpio;
            let pos, debut, fin;
            for (x = 0; x < txts.length; ++x) {
                txt = sacaTxt(txts[x], fnSaca);
                txtLimpio = limpiaTxt(txt);
                pos = txtLimpio.indexOf(txtABuscar);
                if (pos > -1) { // Contiene el texto
                    debut = salto(txtLimpio.slice(0,pos),true);
                    if (debut === -1) { debut = 0 }
                    fin = salto(txtLimpio.slice(pos));
                    fin = fin > -1 ? pos +fin : txtLimpio.length;

                    fifan.push({ x: x, txt: txt, debut: debut, fin: fin, linea: getLinea, getTxt: getTxt });
                }
            }
        } else {
            if (todas) {
            }
        }
    }
    
    function creaAreas() {
        if (typeof nbVntTxt === "string") {
            vntTxt = document.getElementById(nbVntTxt);
        } else {
            vntTxt = nbVntTxt;
        }
        
        txtLista = document.createElement("DIV");
            txtLista.classname = "rogTxtLista";
        vntTxt.appendChild(txtLista);
        txtDom = document.createElement("DIV");
            txtLista.className = "rogTxt";
        vntTxt.appendChild(txtDom);
    }
    
    this.Datos = txts;
    this.setTodas = (valor) => { todas = valor };
    this.getCadena = () => cadena;
    this.setcadena = (valor) => { cadena = valor }
    
    dom = typeof nbBsqDom === "string" ? document.getElementById(nbBsqDom) : nbBsqDom;
    dom.addEventListener("input",cambio);
    creaAreas();
    if (fn) {
        if (typeof fn === "function") { fnSaca = fn}
        else {
            if (fn[0]) { fnSaca = fn[0]}
            if (fn[1]) { fnMst = fn[1]}
        }
    }
}