    
function rogTxt (dom, nbVntTxt, txts, fn) {
    var cadena;
    var fifan = [], todas = false;
    var dom, vntTxt, txtLista, txtDom;
    var fnSaca, fnMst;
    
    function mstTxt(event) {
        txtDom.innerHTML = fnSaca(txts[this.x]);
        if (fnMst) fnMst(this);
    }
    
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
                li.indice = x.x;
                li.onclick = mstTxt;

                lista.appendChild(li);
            });
        } else {
            txtLista.innerHTML = "<p>No encontré ningún texto que contenga '"+cadena+"'</p>";
        }
    }
    
    function sacaTxt(elemento, fn) {
        return typeof elemento === "object" ? fn(elemento) : elemento;
    }

    function busca() {
        fifan = rogFiltra(a, query, aCamposIn)
/*        
        cadena = dom.value;
        var txtABuscar = limpiaPlb(cadena);
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
                // let _exp = new RegExp(limpiaPlb(txt), "i");
                txtLimpio = limpiaPlb(txt);
                pos = txtLimpio.indexOf(txtABuscar);
                if (pos > -1) { // Contiene el texto
                    debut = salto(txtLimpio.slice(0,pos),true);
                    if (debut === -1) { debut = 0 }
                    fin = salto(txtLimpio.slice(pos));
                    fin = fin > -1 ? pos +fin : txtLimpio.length;

                    fifan.push({ x: x, txt: txt, debut: debut, fin: fin, linea: getLinea });
                }
            }
        } else {
            if (todas) {
            }
        }
    */
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
    this.setTodas  = valor => todas = valor;
    this.getCadena = () => cadena;
    this.setcadena = valor => cadena = valor;
    
    dom = objDom(dom);
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

function quitaEsp(txt) {
    // Limpia los textos de código HTML 
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

function rogBsqIn(a, que, valor) {
    let _exp = new RegExp(valor, "i");
    return a.filter(x => _exp.test(limpiaPlb(def(x[que]))));
}

function rogFiltra(a, query, aCamposIn) {
    let retorno = a instanceof Array ? a : desarmaObj(a);
    let aIn = desarma(aCamposIn);

    if(query) {
        for(let [que,valor] of Object.entries(query)) {
            retorno = aIn.includes(que) ?
                rogBsqIn(retorno,que, valor) : 
                retorno.filter(x => x[que] == valor);
        }
    }

    return retorno;
}

dom, nbVntTxt, txts, fn