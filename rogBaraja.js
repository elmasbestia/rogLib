class rogBaraja {
  #valor = 0;
  #palo = 0;
  constructor (foto,valor,palo) {
    this.foto = foto;
    this.valor = valor;
    this.palo = palo;
    this.color = palos[palo];
  }

  set valor(x) {
    this.#valor = x;
  }

  get valor() {
    return valores()[this.#valor];
  }

  set palo(x) {
    this.#palo = x;
  }

  get palo() {
    return typeof this.#palo === "number" ? palos[this.#palo] : this.#palo;
  }

  tmp() {
    return tmpBaraja(this);
  }
}

class rogMazo {
  #xBaraja = 0;
  #fotos = [];
  constructor(mazos) {
    this.mazo = abreMazos(mazos.cant);
    this.fotos = mazos.fotos;
  }

  set fotos (fotos) {
    const _fotos = new rogNbArchs(fotos);
    this.#fotos = [..._fotos.imagenes];
  }
  
  get foto() {
	  return this.#fotos.shift()
  }

  dame() {
    let brj = xBaraja === this.mazo.length ? null : this.mazo[xBaraja++];
	if(brj) brj.foto = 
  }
}

const palos = {
  "♠": "black",
  "♥": "red",
  "♣": "black",
  "♦": "red"
};

const valores = () => {
    const retorno = [];
    for (let x = 0; x < 12; x++) retorno[x] = x;
    retorno[0] = "A";
    retorno[10] = "J";
    retorno[11] = "Q";
    retorno[12] = "K";
    return retorno;
}

function tmpBaraja(baraja) {
  return `<div class="baraja" 
    data-valor="${baraja.valor}" 
    data-palo="${baraja.palo}"
    data-foto="${baraja.foto}" 
    style="--clrPalo: ${baraja.color}"
    onclick="marcaBaraja(event)"
    >
      <div class="elLomo">
      </div>
      <div class="laCara">			
        ${tmpFoto(baraja.foto)}
        <div class="contenido">${baraja.contenido || ""}</div>
        <div class="esquina si">${baraja.valor}</div>  
        <div class="palo si">${baraja.palo}</div>
        <div class="palo id">${baraja.palo}</div>
        <div class="esquina id">${baraja.valor}</div>
      </div>
    </div>`;
}

function tmpFoto(foto) {
	return foto ?
  function nbImagen(imagen) {
      return `${directorio}${imagen}.jpg`;
  }

    `<div class="foto">
        <img src="${foto}" alt="">
    </div>` :
		"";
}

function abreMazos(n) {
  const cant = n*4*13; // Cantidad de Cartas
  const retorno = [];

  for(x = 0; x < n; x++) {
    Object.keys(palos).forEach(palo => {
      valores().forEach((valor,i) => {
        barajea(retorno, new rogBaraja("",i,palo), cant)
      })
    });
  }
  return retorno;
}

function posAleatoria(n) {
  return Math.floor(Math.random()*n);
}

function barajea(mazo,baraja,cant) {
  let pos = posAleatoria(cant);
  if(mazo[pos]) {
    pos = 0;
    while(mazo[pos]) pos++;
  } 
  mazo[pos] = baraja;
}

function marcaBaraja(e) {
  const baraja = e.currentTarget;
  baraja.classList.toggle("marcada");
}
