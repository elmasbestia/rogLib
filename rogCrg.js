
class rogCrgs {
  /*
    Crea los objetos de carga de archivo de una forma
  */

    constructor(lista,directorio,url){
      this.w = {};

      this.lista = lista;
      this.directorio = directorio;
      this.url = url;
    }

    get lista () {
      return this.w.lista;
    }

    set lista(valor) {
      if(valor) this.w.lista = valor;
      else this.w.lista = Array.from(document.forms[0].querySelectorAll("[type=file]"));

      this.w.nbArchs = this.lista.map(x => new rogCrg(x))
    }
}

class rogCrg {
    constructor(nbArch, marco) {
      debugger;
      this.w = {};
      const [nb, valor] = Object.entries(nbArch)[0];
  
      this.nb = nb;
      this.valor = valor;
  
      this.marco = marco;
    }
  
    set nb(valor) {
      this.w.nb = valor;
    }
  
    get nb() {
      return this.w.nb;
    }

    set marco(valor) {
      objDom(marco)
    }
  
    get tipo() {
      /* 
        Falta diferenciar "file" de "img" y, tal vez, "word"
      */
      let retorno = "";
      let ext = this.ext;
      if (ext) {
        if (ext === "pdf") retorno = ext;
        else if (ext.startsWith("doc")) retorno = "word";
        else retorno = "image";
      }
      return retorno;
    }
  
    get clase() {
      let tipo = this.tipo;
      return "rogCrg" + (tipo ? " rogCrg" + tipo : "");
    }
  
    get icono() {
      return this.valor ? icnNbArch(this.tipo) : "";
    }
  
    set valor(valor) {
      this.w.valor = valor;
      this.actDom();
    }
    get valor() {
      return this.w.valor;
    }
  
    set value(valor) {
      this.w.valor = valor;
      this.actDom();
    }
    get value() {
      return this.w.valor;
    }
  
    creaDom(dom) {
      this.w.dom = dom ? objDom(dom) : document.createElement("DIV");
      this.mstDom();
    }
  
    get dom() {
      if (!this.w.dom) this.creaDom();
      return this.w.dom;
    }
  
    get ext() {
      return Extension(this.value).toLowerCase();
    }
  
    get btn() {
      return this.dom.querySelector("INPUT");
    }
  
    get img() {
      return this.dom.querySelector(".nbArchBtn");
    }
  
    sube() {
      alert("Sube");
      this.valor = this.btn.value;
    }
  
    mstDom() {
      this.dom.innerHTML = tmpNbArch(this);
      this.btn.oninput = this.sube.bind(this);
      this.img.onclick = this.mst.bind(this);
    }
  
    actDom() {
      this.btn.title = this.value;
      this.btn.className = this.clase; 
      this.img.innerHTML = `<i class="${this.icono}"></i>`;
    }
  
    mst() {
      otraVnt(this.valor);
    }
  }
  
  function tmpNbArch(nbArch) {
    return `<label for="${nbArch.nb}">${nbArch.nb}</label>
      <span class="nbArchBtn""></span>
      <input type="file" name="${nbArch.nb}" value="${nbArch.value}">`;
  }
  