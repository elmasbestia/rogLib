// Objeto que permite visualizar datos agrupados 

class rogCuadro {
  constructor (grupos,datos,dom) {
      this.h = {};  // Hasta que FF quiera
    this.h.dom    = dom;
    this.h.grupos = grupos;
    this.h.datos  = datos;
    
    this.mst();
  }  
  
  set dom(objeto) {
    this.h.dom = objDom(objeto);
    this.mst();
  }
  
  get grupos() {
    return this.h.grupos;
  }
  
  set grupos(grupos) {
    this.h.grupos = desarma(grupos);
    this.mst();
  }
  
  set datos(datos) {
    this.h.datos = datos;
    this.mst();
  }

  get titGrupos() {
      return this.h.grupos.join(" / ");
  }
  
  get titulo() {
      return this.h.titDatos || this.titGrupos;
  }

  set titDatos(valor) {
      this.h.titDatos = valor;
  }

  agregaGrupo(grupo) {
    this.h.grupos.push(grupo)
  }

  mst () {
    if(this.h.grupos && this.h.datos) {
        mstCuenta(
            creaMatriz(
                cuentaGrupo(this.h.grupos,this.h.datos))
                ,this.h.dom,this.titDatos,this.titGrupos)
  }
  }
}

function cuentaLinea(Cuenta,grupos,linea) {
    let retorno = Cuenta;
  
    grupos.forEach((x,i) => {
      let valor = linea[x];
      if(!retorno[valor]) retorno[valor] = { _cant: 0, _nivel: i };

      incrementa(retorno[valor]);

      retorno = retorno[valor];
    });
}

function incrementa(que) {
  que._cant++;
}

function cuentaGrupo(grupos,valores) {
  let Cuenta = {};
  
  valores.forEach(linea => {
    cuentaLinea(Cuenta,grupos,linea);
  });
  return Cuenta;
}

function defGrid(grid,columnas) {
    objDom(grid).style["grid-template-columns"] = "repeat("+columnas+", 1fr)";
}

function defValores (datos) {
	let valores = [];
	for(let grupo in datos) {
		for(let sub in datos[grupo]) {
			if(sub.slice(0,1) !== "_") if (!valores.includes(sub)) valores.push(sub);
		}
	}
	return valores.sort();
}

function creaMatriz(Cuenta) {
  const grupos  = defValores(Cuenta);
  const matriz = [];

  const y = { grupo: 1 };
  const x = { filas: 1, totFilas: 0 }
  x.cols = grupos.reduce((obj,val,x) => { 
      obj[val] = x +2;
      return obj;
  },{});
  
  matriz[0] = [0, 0];
  matriz[y.grupo] = [];
  for(col in x.cols) {
    matriz[0][x.cols[col]] = 0;
    matriz[y.grupo][x.cols[col]] = { valor: col, clase: "grp" };
  }

   y.grupo += 1;
   for(let grupo in Cuenta) {
      matriz[y.grupo] = [];

      matriz[y.grupo][x.filas] = { valor: grupo, clase: "grp" };
      matriz[y.grupo][x.totFilas] =  { valor: Cuenta[grupo]._cant, clase: "Tot" };

      matriz[0][x.totFilas] += Cuenta[grupo]._cant;

      for(let col in x.cols) {
        if(Cuenta[grupo][col]) {
            matriz[y.grupo][x.cols[col]] = { valor: Cuenta[grupo][col]._cant, clase: "Tot" };
            matriz[0][x.cols[col]] += Cuenta[grupo][col]._cant; 

            filas = defValores(Cuenta[grupo]);
            filas.forEach((fila,yFila) => {
              if(Cuenta[grupo][col][fila]) {
                yFila += y.grupo +1;
                if(!matriz[yFila]) matriz[yFila] = [];
                matriz[yFila][x.filas] = fila;
                matriz[yFila][x.cols[col]] = Cuenta[grupo][col][fila]._cant;
              }
            });
        }
      };
      // Totaliza Filas
      for(++y.grupo;y.grupo < matriz.length;y.grupo++) {
        matriz[y.grupo][x.totFilas] = matriz[y.grupo].slice(2).reduce((tot,x) => tot += x, 0);
      }
  }
 
  //                           T o t a l i z a
  
  return matriz;
}

function mstCuenta(matriz,dom,titDatos,titGrupos) {
  let _tit = domTxt(titDatos,"h3","rogTitDatos");
  _tit += domTxt(titGrupos,"h3","rogTitGrupos");
  
  let _grid = document.createElement("DIV");
  _grid.className = "rogCuadro";
  _grid.innerHTML = "G R I D"
  if(dom) {
    objDom(dom).innerHTML = _tit;
    objDom(dom).appendChild(_grid);
  }
  const lMatriz = matriz[0].length;
  
  let txt = "";
  
  for(let y = 0; y < matriz.length; y++) {
    for(let x = 0; x < lMatriz; x++) {
      let col = matriz[y][x];
      if(typeof col === "object") txt += domTxt(def(col.valor),"div","rogCuadro_"+col.clase);
      else txt += domTxt(def(col),"div");
  _grid.innerHTML = txt;
    }
  }
  _grid.innerHTML = txt;
  
  defGrid(_grid,lMatriz);

  return _grid;
}
      
// Manejo de Grupos
function armaBtnGrupo(indice, texto) {
  let btn = document.createElement("BUTTON");
  
  btn.className   = "rogBtn btnGrupo";
  btn.textContent = texto;
  btn.indice      = indice;
  btn.draggable   = true;
  btn.draggable   = true;
  btn.ondragstart = arrastra;
  btn.ondragover  = permiteArrastrar;
  btn.ondrop      = cambiaGrupo;
  
  return btn;
}

function mstGrupos(grupos) {
  let vntGrupos = document.getElementById("grupos");

  vntGrupos.innerHTML = "";
  grupos.forEach((x,i) => {
    vntGrupos.appendChild(armaBtnGrupo(i,x))
  });
}
