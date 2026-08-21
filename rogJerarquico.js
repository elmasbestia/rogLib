"use strict";
// rogDPT
// Librería para manejar códigos Jerárquicos

var datos = [
    { Codigo: "01", descripcion: "Nivel 1 - 01", nivel: 1}, 
    { Codigo: "01-a", descripcion: "Nivel 2 - 01-a", nivel: 2}, 
    { Codigo: "01-a-001", descripcion: "Nivel 3 - 01-a-001", nivel: 3}, 
    { Codigo: "01-a-002", descripcion: "Nivel 3 - 01-a-002", nivel: 3}, 
    { Codigo: "01-b", descripcion: "Nivel 2 - 01-b", nivel: 2},
    { Codigo: "02", descripcion: "Nivel 1 - 02", nivel: 1}, 
    { Codigo: "02-a", descripcion: "Nivel 2 - 02-a", nivel: 2},
    { Codigo: "02-a-001", descripcion: "Nivel 3 - 02-a-001", nivel: 3}, 
    { Codigo: "02-a-0011", descripcion: "Nivel 4 - 02-a-0011", nivel: 4},
    { Codigo: "02-a-001101", descripcion: "Nivel 5 - 02-a-00111", nivel: 5}
];
var Stru = [
    { nivel: 1, que: "Nivel 1", fmt: "00" },
    { nivel: 2, que: "Nivel 2", fmt: "a", separador: "-" },
    { nivel: 3, que: "Nivel 3", fmt: "000", separador: "-" },
    { nivel: 4, que: "Nivel 4", fmt: "0" },
    { nivel: 5, que: "Nivel 5", fmt: "00" },
];

function rogJerarquico(onchange) {
    // @param onchange          función que se ejecuta cada vez que el objeto cambia de valor
    // El valor del Objeto es su código jerarquico
    // Se puede visualizar como Lista jerárquica y/o como combos, para lo cual se utilizan los métodos:
    // setListas y setCombos

    var nNiveles = 0;
    var Fijos = [], indices = [];
    var objSelf;

    function nb(nivel, indices) {
        if(nivel === nNiveles) return objSelf.Parroquia(xEdo,xMun,xPq)
        else    if(nivel === nivelMun) return objSelf.Municipio(xEdo,xMun)
                else return Estado(false,xEdo);
   }
    function asigna (valor,nivel) {
        indices [nivel] = valor;
        let x = nivel +1;
        for (; x < nNiveles; ++x) {indices [x] = 0}
        objSelf.refleja(nivel);
    }
    function muestra(que, muestra = true) {
        if(nivelDe(que) < nNiveles) {
            que.children[0].style.display = muestra ? "block" : "none";
        }
    }
    function claseLiSel(nivel) {
        return "rogLiSel" + nivel;
    }
    function Clases(nivel) {
        let txtNivel = "Nivel" +nivel;
        
        this.opc = "rogOpc"   +txtNivel;
        this.li  = "rogLi"    +txtNivel;
        this.lst = "rogLst"   +txtNivel; 
        this.sel = "rogLiSel" +txtNivel;
    }
    function dependencia(nivel, nombre,indices) {
        this.nivel = nivel;
        this.indices = indices;
        this.nombre = nombre ? nombre : nb(nivel, indices);
        this.codigo = codigo;
        this.ficha = ficha;
    }
    
    function Fuente(nivel = this.nivel) {
        if(nivel === nivelEdo) return objSelf.Estados
        else if(nivel === nivelMun) return objSelf.Municipios
             else return objSelf.Parroquias;
    }
    
    function nivelDe(elemento) {
        let clase = elemento.className;
        if (clase.includes("Edo")) return nivelEdo
        else if (clase.includes("Mun")) return nivelMun
        else if (clase.includes("Pq")) return nNiveles;
        return -1;
    }
    
    function fmt(num = 0, nDigitos) {return num > 9 ? String(num) : "0" + num}
    function setIndices() {
        if(arguments.length) {
            let x = 0;
            for (; x < arguments.length; ++x) {
                if (arguments[x] instanceof Array) {
                    arguments[x].forEach(asigna)
                } else {
                    asigna (arguments[x], x)
                }
            };
        }
    }
    function codigo(valor) { 
        let x = 0, retorno = "";
        if (valor) {
            let valores = [];
            let x = 1;
            
            for (;x <= nNiveles; ++x) {
                let debut = x*2;
                let n = parseInt(valor.slice(debut,debut+2))
                valores.push(isNaN(n) ? 0 : n);
            }
            setIndices(valores);
        }
        for (; x < nNiveles; ++x) {
            retorno += fmt2(this.indices[x])
        }
        return retorno;
    }
    function defineBase(dom) {
        let base;
        if (typeof(dom) === "string") { base = document.getElementById(dom)}
        else { base = dom }
        return base;
    }
    function ficha() {
        let retorno = "Código: " +this.codigo() +"<br/>";
        let x = 1;
        for (;x <= nNiveles; ++x) {
            if (this.indices[x]) retorno += nb(x, this.indices) +" (" + this.indices[x] +")<br/>";
        }
        return retorno;
    };
        
    function rogCmbJerarquico(definicion) {
        
        function limpiaCmbs(nivel) {
            let x = nNiveles;
            for (; x > nivel; --x) { if(objSelf.combos[x]) objSelf.combos[x].base.innerHTML = "" }
        }
        
        this.base = defineBase(definicion.dom);
        this.value = 0;
        this.llenaCombo = () => {
            limpiaCmbs(this.nivel);
            let creaOpcion = (e,x)  => {
                let opcion = document.createElement("OPTION");
                opcion.className = cmbSelf.clase.opc;
                opcion.indices = e.indices;
                opcion.value = x +1;
                opcion.appendChild(document.createTextNode(e.nombre));
                this.base.appendChild(opcion);
            }
            this.base.innerHTML = "";
            this.value = 0;
            creaOpcion({nombre: "Escoja un elemento", [this.nivel], indices: [0]}, 0)
            this.fuente(...indices).forEach(creaOpcion);
            
            if(indices[this.nivel]) this.base.selectedIndex = indices[this.nivel]
            else if (this.opciones.length === 2) this.setValor(1);
        };
        this.selecciona = () => {
            cmbSelf.value = parseInt(cmbSelf.opciones[cmbSelf.base.selectedIndex].value);
            asigna(cmbSelf.value, cmbSelf.nivel);
            if (cmbSelf.value) { if(cmbSelf.hijo) cmbSelf.hijo.llenaCombo(); }
            else { limpiaCmbs(cmbSelf.nivel) }
        };
        this.setValor = (valor) => {
            if (cmbSelf.value != valor) {
                if((valor < 0) || (valor > cmbSelf.opciones.length)) valor = 0;
                
                if (cmbSelf.opciones.length) {
                    cmbSelf.opciones[valor].selected = true;
                    cmbSelf.base.onchange();
                }
            }
        }

        var cmbSelf = this;

        this.base.onchange = definicion.funcion || this.selecciona;
        this.nivel = nivelDe(this.base);
        this.fuente = Fuente(this.nivel);
        this.clase = new Clases(this.nivel);
        this.opciones = this.base.children;
        if (this.nivel === nivelEdo) this.llenaCombo();
    }

    function rogLstJerarquica(dom, funcion) {
        // @param dom       dom donde se presentará la lista
        // @param funcion   funcion que se llama al seleccionar un elemento de la lista
        function cualFuncion(funcion) {
            let retorno;
            if (funcion) {
                if (typeof funcion ===  "function") retorno = funcion;
                else retorno = funcion[lstSelf.nivel]
            }
            return retorno || lstSelf.selecciona;
        }

        var lstSelf = this;
        
        this.base = defineBase(dom);
        this.nivel = nivelDe(this.base) +1;
        this.esFija = Boolean(Fijos[this.nivel]);
        this.value = 0;
        this.fuente = Fuente(this.nivel);
        this.llenaLista = () => {
            // Llena una lista con las DPT correspondientes
            function elementoLi(base,e,x,funcion) {
                let li = document.createElement("LI");
                li.className = lstSelf.clase.li;
                li.indices = e.indices;
                li.value = x;
                li.onclick = funcion;
                li.appendChild(document.createTextNode(e.nombre));
                
                base.appendChild(li);
                
                return li;
            }
            
            lstSelf.value = 0;
            let lista = document.createElement("UL");
            lista.className = this.clase.lst;
            this.base.appendChild(lista);

            if(this.esFija) {
                lstSelf.value = indices[lstSelf.nivel];
                elementoLi(lista,new dependencia(this.nivel, null,...indices),indices[this.nivel],this.funcion).click();
            } else {
                this.fuente(...indices).forEach((e,x)  => {
                    elementoLi(lista,e,x+1,this.funcion);
                });
            }
        };
        this.selecciona = (e) => {
            this.quitaSeleccion();
            objSelf.listas[this.nivel] = this;
            
            let dependencia = e.currentTarget;
            lstSelf.value = dependencia.value;

            asigna(lstSelf.value,lstSelf.nivel);
            lstSelf.lista[lstSelf.value -1].classList.add(lstSelf.clase.sel);
            if (this.nivel < nNiveles) {
                if (dependencia.children.length) {
                    muestra(dependencia, true)
                } else {
                    objSelf.listas[this.nivel +1] = new rogLstJerarquica(dependencia,funcion)
                }
            }
            e.stopPropagation();
        };
        this.quitaSeleccion = () => {
            let x = nNiveles;
            for (;x >= this.nivel; --x) {
                let clase = claseLiSel(x);
                let elemento = document.getElementsByClassName(clase)[0];
                if (elemento) {
                    elemento.classList.remove(clase);
                    muestra(elemento, false);
                }
            } 
        }
        this.setValor = (valor) => {
            if (lstSelf.value != valor) {
                if((valor > 0) && (valor <= lstSelf.lista.length)) {
                    if (valor) lstSelf.lista[valor -1].click()
                    else  lstSelf.value = valor;
                } else lstSelf.value = 0;
            }
        };
        this.funcion = cualFuncion(funcion);
            
        this.clase = new Clases(this.nivel);
        this.llenaLista();
        this.lista = lstSelf.base.children[0].children;
        if(this.lista.length === 1) this.setValor(1);
    }
    
    this.fijar = (fijos) => {
        if (fijos) {
            if(fijos.xEdo) Fijos[nivelEdo] = fijos.xEdo;
            if(fijos.xMun) Fijos[nivelMun] = fijos.xMun;
            if(fijos.xPq)  Fijos[nNiveles]  = fijos.xPq;
            [...indices] = [...Fijos];
            setIndices();
        }
    }
    this.refleja = (nivel = 0) => {
        let x = nivel;
        for (;x < nNiveles; ++x) {
            if(objSelf.combos[x]) objSelf.combos[x].setValor(indices[x]);
            if(objSelf.listas[x]) objSelf.listas[x].setValor(indices[x]);
        }
        if (objSelf.onchange) objSelf.onchange();
    }
    this.indices = [];
    this.setIndices = setIndices;
    this.Estado = Estado;
    this.Municipio = Municipio;
    this.Parroquia = Parroquia;
    this.Estados = () => {
        let retorno = [];
        datos.forEach((e,x) => { retorno.push(new dependencia(nivelEdo, e.EDO, x +1))});
        return retorno;
    };
    this.Municipios = (xEdo) => {
        let retorno = [];
        DPT[xEdo -1].Municipios.forEach((e,x) => {
                retorno.push(new dependencia(nivelMun, e.Municipio, xEdo, x +1))
        });
        return retorno;
    }
    this.Parroquias = (xEdo, xMun) => {
        let retorno = [];
        DPT[xEdo -1].Municipios[xMun -1].Parroquias.forEach((e,x) => {
            retorno.push(new dependencia(nNiveles, e, xEdo, xMun, x +1))
        });
        return retorno;
    }
    this.TodosLosMunicipios = () => {
        let retorno = [];
        DPT.forEach((e,x) => {
            DPT[x].Municipios.forEach((e,y) => {
                retorno.push(new dependencia(nivelMun, e.Municipio, x +1, y +1))
            });
        });
        return retorno;
    }
    this.TodasLasParroquias = () => {
        let retorno = [], xEdo, xMun;
        DPT.forEach((e,x) => {
            xEdo = x +1;
            DPT[x].Municipios.forEach((e,y) => {
                xMun = y +1;
                DPT[x].Municipios[y].Parroquias.forEach((e,z) => {
                    retorno.push(new dependencia(nNiveles, e, xEdo, xMun, z +1))
                });
            });
        });
        return retorno;
    }
    this.tablaDPT = () => {
        let retorno = [], xEdo, xMun;
        DPT.forEach((e,x) => {
            xEdo = x +1;
            retorno.push(new dependencia(nivelEdo, e.EDO, xEdo));
            DPT[x].Municipios.forEach((e,y) => {
                xMun = y +1;
                retorno.push(new dependencia(nivelMun, e.Municipio, xEdo, xMun))
                DPT[x].Municipios[y].Parroquias.forEach((e,z) => {
                    retorno.push(new dependencia(nNiveles, e, xEdo, xMun, z +1))
                });
            });
        });
        return retorno;
    }
    this.nbDPT = nbDPT;
    this.base = {}; // DOM principal para el DPT
    this.ficha = ficha;
    this.codigo = codigo;
    /* Objetos
     Manejamos tres niveles: Estado, Municipio y Parroquía
     Para indicar que se quiere trabajar con una dependencia en particular, se usa
     el parámetro "fijos".
     Ejemplo:
     Si se quiere la lista de Parroquías para un Municipio en particular se enviará
     el parámetro "fijos" así: {xEdo: codigo del estado, xMun: codigo del municipio}
     esto abrirá directamente la lista de parroquías de ese Municipio y de ese Estado
     y no permitirá "saltar" a otro Estado y/o Municipio
    
     Las listas se crean dinámicamente dentro del dom especificado; los combos se crean en el html y se referencian individualmente bajo un arreglo
    */
                                /*  Manejo de Listas  */
    this.listas = [];
    this.setListas = (dom,funcion,fijos) => { // Enlaza una lista jerárquica a la Tabla DPT
        // @param dom           dom que contiene la lista
        // @param funcion       funcion a ejecutar al seleccionar una opción:
        //                      puede ser un arreglo con una función para cada nivel
        // @param fijos         OBjeto que permite "fijar" un nivel
        //                      Por ejemplo: {xEdo: 3} permitirá sólo mostrar los Municipios del Estado Nro. 3 y sus
        //                      Parroquias correspondientes
        objSelf.fijar(fijos);
        this.listas[nivelEdo] = new rogLstDPT(dom, funcion)
    }
                                /*  Manejo de Combos  */
    this.combos = [];
    this.setCombos = (combos,fijos) => { // Enlaza un juego de combos con la Tabla DPT
        // @param combos        Arreglo de objetos con:
        // dom                  dom del combo, la clase define el nivel:
        //                      cmbEdos, cmbMuns o cmbPqs
        // funcion              Función a ejecutar al seleccionar una opción
        //                      si se omite se usará la función por defecto del nivel
        // @param fijos         Objeto de 3 valores opcionales que fijan los niveles;
        //                      xEdo, xMun y xPq
        var x;
 
        objSelf.fijar(fijos);

        for (x in combos) {
            let combo = new rogCmbDPT(combos[x]);
            this.combos[combo.nivel] = combo;
        }
                                // Enlaza los combos jerárquicamente
        for (x = 1; x < this.combos.length; ++x) { if (this.combos[x] && this.combos[x-1]) this.combos[x-1].hijo = this.combos[x] }
    }
    
                                //   I N I C I A L I Z A C I Ó N
    objSelf = this;
    objSelf.indices = indices;
    if (onchange) objSelf.onchange = onchange;
}
