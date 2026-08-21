// Secuencia de nombres de archivo

const _rogNbArchs = {

    indice: (obj,i) => {
        const _i = (obj.cero ? i : i +1)
        return obj.pad ? _i.toString().padStart(2, "0") : _i;
    },
    
    creaLista: (obj) => {
        const retorno = [];
        let x = 0;
        for(; x < obj.n; x++) {
            retorno.push(obj.nbArch(x));
        }
        return retorno;
    },

    async leeJson(nbArch,cb) {
      let retorno = []
      try {
        const res = await fetch(`${nbArch}.json`, {mode: "same-origin", headers: {'Access-Control-Allow-Origin' : 'file://'}})
        if(res.ok) retorno = await res.json();
      } catch (error) {
        console.log(error)
      } finally {
        return retorno;
      }
    },

    colecciones: () => Object.keys(galeriasNotables)
}

class rogNbArchs {
  #nbs;
  #n;
  constructor(prms) {
    this.inicializa(typeof prms === "string" ?
      galeriasNotables[prms] :
      prms
    );
  }

  inicializa(prms) {
    this.sitio = prms.sitio || "https://rafagomez.neocities.org/";
    this.carpeta = prms.carpeta;
    this.n = prms.n;
    this.f = prms.f || (i => this.nbs[i]);
    this.cero = prms.cero;
    this.sufijo = prms.sufijo;
    this.pad = prms.pad;
  
    if(prms.nbs) {
      if(typeof prms.nbs === "string") this.#nbs = _rogNbArchs.leeJson(prms.nbs)
      else this.#nbs = prms.nbs;
    }
  }

  get nbs() {
    return this.#nbs;
  }

  get imagenes() {
    if(this.nbs) return this.nbs.map((x, i) => this.nbArch(i));
    else return _rogNbArchs.creaLista(this);
  }

  get colecciones() {
    return Object.keys(galeriasNotables)
  }

  set n(n) {
    this.#n = n;
  }

  get n() {
    return this.#n || this.nbs.length;
  }

  nbArch(i) {
    return `${this.sitio}${this.carpeta}${this.f(_rogNbArchs.indice(this,i))}${this.sufijo || ""}`;
  }
}

const galeriasNotables = {
  nimales: {
    sitio: "https://gardeniaperger.neocities.org/",
    carpeta: "Fotos/nimales/",
    f: i => `nimal (${i})`,
    sufijo: '.jpg',
    n: 71
  },
  rafa: {
    carpeta: "Imagenes/Galeria/",
    f: i => `galeria (${i})`,
    sufijo: '.jpg',
    n: 20
  },
  gar: {
    sitio: "https://gardeniaperger.neocities.org/",
    carpeta: "Imagenes/",
    sufijo: '.jpg',
    nbs: [
      "Gar Rosa",
      "Gar Flora",
      "Gar Ursula",
      "Gar 1",
      "3 x",
      "Gardesanias",
      "Cantautora",
      "Gar 2",
      "Loca",
      "Gar Puno",
      "Gar Mucuchies",
      "Tambourine Gar"
    ],
    cero: true
  },
  oniria: {
    carpeta: "Oniria/Imagenes/Sueneros/",
    nbs: [
      "CarlosAngulo",
      "Pompilio",
      "RafaGomez"
    ],
    cero: true,
    sufijo: '.jpg'
  },
  vainas: {
    carpeta: "memo/Imagenes/",
    f: i => this.nbs[i].imagen,
    nbs: "vainas",
    cero: true,
    sufijo: ".jpg"
  },
  kino: {
    carpeta: "KinoRafa/Imagenes/Afiches/",
    f: i => i,
    sufijo: ".jpg",
    pad: true,
    n: 104
  },
  msdd: {
    carpeta: "Epigramas/Imagenes/",
    f: i => `w ${i}`,
    sufijo: '.jpg',
    pad: true,
    n: 25
  }
}
