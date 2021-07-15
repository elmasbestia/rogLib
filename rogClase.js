// Rafa Gómez
// Objeto Clase (Imita la propiedad class del DOM)
// Rafa Gómez
// Objeto Clase (Imita la propiedad class del DOM)

class rogClase {
  constructor(valor = "") {
    this.clase = new rogClassList(valor);
  }

  set value(valor) {
    this.clase.value = valor;
  }

  get value() {
    return this.clase.value;
  }

  get classList() {
    return this.clase;
  }

  contains(valor) {
    return this.clase.contains(valor);
  }

  toString() {
    return this.clase.toString();
  }
}

class rogClassList {
  #lista = [];

  constructor(valor) {
    this.add(valor);
  }

  add(clases) {
    if (clases) clases.split(" ").forEach((clase) => this.#lista.push(clase));
  }

  remove(clase) {
    let x = this.#lista.indexOf(clase);
    if (x > -1) {
      this.#lista.splice(x, 1);
      return clase;
    }
  }

  toggle(clase) {
    let x = this.#lista.indexOf(clase);
    if (x > -1) {
      this.#lista.splice(x, 1);
    } else {
      this.#lista.push(clase);
    }
    return clase;
  }

  contains(que) {
    return this.#lista.includes(que);
  }

  set value(valor) {
    this.#lista.length = 0;
    this.add(valor);
  }

  get value() {
    return this.#lista.join(" ");
  }

  get length() {
    return this.#lista.length;
  }

  toString() {
    return this.#lista.join();
  }
}

/*
	Propiedades y métodos de classList
	
*add: ƒ add()
*contains: ƒ contains()
entries: ƒ entries()
forEach: ƒ forEach()
item: ƒ item()
keys: ƒ keys()
*length: (...)
*remove: ƒ remove()
replace: ƒ replace()
supports: ƒ supports()
*toString: ƒ toString()
toggle: ƒ toggle()
*value: (...)
values: ƒ values()
*constructor: ƒ DOMTokenList()
Symbol(Symbol.iterator): ƒ values()
Symbol(Symbol.toStringTag): "DOMTokenList"
*get length: ƒ length()
*get value: ƒ value()
*set value: ƒ value()
__proto__: Object
*/
