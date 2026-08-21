/*
  Objeto para manejar los datos de tipo "archivo"

  Este Objeto manipula los elementos INPUT de TYPE="FILE"
*/
const NBARCHs = "[type=file]";

const domNbArch = (dom) =>
  typeof dom === "string" ? document.querySelector("[name=" + dom + "]") : dom;

class rogCargArch {
    constructor(lista, dir, url, valores) {
        this.w = {};

        this.lista = lista;
        this.dir   = dir;
        this.url   = url;

        if(valores) this.actualiza(valores);
    }

  set lista(valores) {
    this.w.lista = Array.from(analLista(valores));

    for(let i = 0; i < this.w.lista.length; i++) {
        this.w.lista[i].oninput = this.chxNbArch.bind(this);
    }
  }

  get lista() {
    return this.w.lista;
  }
  
  actualiza(valores) {
	  this.lista.forEach(x => setNbArch(x,valores[x.name]));
  }

  set valores(datos) {
    this.actualiza(datos);
  }

  get valores() {
    return this.lista.map(x => jeto(x.name,x.dataset.nb))
  }

	get listos() {
		this.w.lista.reduce((cant,nbArch) => cant += estaListo(nbArch), 0)
	}

  sube(uno) {
    if (uno) carga(uno);
    else this.lista.forEach(this.sube);
  }

  chxNbArch(event) {
      let x      = event.target;
      let dir    = x.dataset.dir || typeof this.dir === "string" ? this.dir : this.dir();

      let vnt = new rogVntEspera({titulo: "Cargando Archivo", texto: x.files[0].name});

      let retorno = cargArch(x,dir,this.url);

	    setNbArch(x, retorno[x.name])	

      vnt.mst()
      return retorno;
  }
}

class rogFrmArchs {
  /* 
    Define un elemento FORM para carga de Archivos

    @param directorio: nombre del directorio al cual subir los archivos
  */
  constructor (frm, directorio, url) {
    this.w = {};

    this.frm = frm;
    this.dir = directorio;
    this.url = url;
  }

  set frm(forma) {
    this.w.frm = document.forms[0];
    this.w.frm.addEventListener('submit', event => {
      event.preventDefault();
      if(this.w.frm.checkValidity()) cargArch(this.w.frm, this.dir, this.url);
    });
  }
}

function setNbArch(nbArch, valor) {
      nbArch.classList.remove("listo")
      nbArch.classList.remove("error");

      nbArch.dataset.nb = typeof valor === "string" ? valor : valor.path;
      nbArch.classList.add(valor ? "listo" : "error");	
}

function estaListo(nbArch) {
	return nbArch.classList.contains("listo") ? 1 : 0;
}

function analLista(lista) {
  let retorno = [];
  if (lista) {
    if (typeof lista === "string") {
      let frm = document.querySelector(lista);
      if (frm) retorno = frm.querySelectorAll(NBARCHs);
      else retorno = desarma(lista).map(domNbArch);
    } else {
      if (lista.length) {
      } else {
        if (lista.tagName === "FORM") retorno = lista.querySelectorAll(NBARCHs);
        else retorno = [lista];
      }
    }
  } else {
    retorno = document.querySelectorAll(NBARCHs);
  }
  return retorno;
}

function cargArch(archs, dir, url) {
  const xhr = new XMLHttpRequest();
  let retorno = "";
  let fd;

  function msjErrorXML(e) {
    alert(xhr.accion+"\n"+xhr.url+"\n¡E R R O R!!!\nStatus: " +xhr.status +" (" +xhr.statusText+")\n"+xhr.status);
	
    return (xhr.responseText.fallo 
        ? JSON.parse(xhr.responseText)  
        : respuestaError(xhr));
  }
  
  //xhr.overrideMimeType("multipart/form-data");
  //xobj.withCredentials = true;

  console.log("Post ", `${url}/${dir}`)

  xhr.open("POST", `${url}/${dir}`, false);
  xhr.onerror = msjErrorXML;
  
  //xobj.setRequestHeader('Content-type','application/json; charset=utf-8');

  xhr.onreadystatechange = () => console.log(xhr.readyState, url, " (", xhr.status,")");
  xhr.onload = () => {
      // console.log("On Load", xhr.responseText)
      if (!xhr.status || (xhr.status > 400)) retorno = msjErrorXML()
      else retorno = JSON.parse(xhr.responseText);
  };

  // Initiate a multipart/form-data upload
  xhr.send(xhrFrm(archs));

  return retorno;
}

function xhrFrm(archs) {
  let fd = {};

  if(archs.tagName === "FORM") {
    fd = new FormData(archs)
  } else if(archs instanceof FormData) {
    fd = archs;
  } else {
    fd = new FormData();
    fd.append(archs.name, archs.files[0], archs.value);
  }

  return fd;
}

function respuestaError({statusText, status}) {
    return { fallo: true, msj: statusText, status }
}

class rogArch {
  constructor(nb,valor,opcs) {
    this.nb = nb;
    this.valor;

    for(let opc in opcs) this.opcs[opc] = opcs[opc];
  }

  sube() {}

  get dom() {
    let retorno = document.createElement("INPUT");

    retorno.type = "FILE";
    retorno.name = this.nb;

    setNbArch(retorno,this.valor);

    for(let opc in this.opcs) retorno[opc] = this.opcs[opc];

    return retorno;
  }

  get txtDom() {
    return this.dom().outerHTML;
  }

  get nbCompleto() {
    return this.valor;
  }

  mst() {
    otraVnt(this.nbCompleto)
  }

  get value() {
    return this.valor;
  }
}
  
function mstReqs(reg) {
  function btnReq(nb) {
    return `<input type="FILE" name="${nb}">`;
  }

  function liReq(nb, txt, sub) {
    return `<li class='liReq' data-nb="${nb}"">
      ${txt} <br>
      ${nb ? btnReq(nb) : ""}
      ${sub ? "<ol>" + sub.join("") + "</ol>" : ""}
      <hr>
    </li>`;
  }

  function agrega(a, req, txt) {
    if (txt.reqs) {
      let grupo = [];
      for (let x in txt.reqs) agrega(grupo, x, txt.reqs[x]);
      a.push(liReq("", txt.txt, grupo));
    } else {
      if (typeof txt === "string") a.push(liReq(req, txt));
      else for (let x in txt) agrega(a, x, txt[x]);
    }
  }
  const reqs = [];

  agrega(reqs, "Requisitos", tTramites["HA"].Requisitos);

  document.querySelector("#lstReqs").innerHTML = reqs.join("");

  let archs = new rogCargArch();

  archs.actualiza(reg);
}

function chxLiReq(e) {
  if (e.target.tagName !== "INPUT") {
    e.stopPropagation();
    alert(e.currentTarget.dataset.nb);
  }
}

function txtDomNbArch(nbArch) {
  return "";
}

/*
  <i class="fas fa-file-word"></i>
  <i class="fas fa-file"></i>
  <i class="far fa-file-pdf"></i>
  <i class="fas fa-file-image"></i>
  <i class="far fa-image"></i>
*/
