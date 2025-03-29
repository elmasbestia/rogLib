/*
	Objeto para manejar estilos dinámicos

	agrega
		Agrega una regla a partir de:
			Una cadena de la forma: selector {propiedades}
		Un par:
			selector
			Nombre del selector
		propiedades:
			Una cadena con las propiedades ("propiedad: valor; ...")
			un objeto con las propiedades ({propiedad: valor, ...})
			Un arreglo con cualquier combinación de los anteriores.
	creaRegla
		Crea una nueva regla a partir de un par de paámetros como los de agrega:
	limpia
		Elimina las reglas creadas. Inicializa las reglas.
	actualiza
		Actualiza las reglas
*/

class rogCSS {
  constructor() {
    this.css = document.createElement("style");
    document.body.appendChild(this.css);

    this.limpia();

    this.agrega(...arguments);
  }

  agrega() {
    if (arguments.length) {
      if (arguments.length === 1) {
        if (arguments[0] instanceof Array)
          arguments[0].forEach((x) => {
            // Dos parámetros
            if (x instanceof Array) this.agrega(...x);
            else this.agrega(x);
          });
        else if (typeof arguments[0] === "string") {
          this.reglas.push(arguments[0]);
          this.actualiza();
        } else this.creaRegla(arguments[0]); // Objeto
      } else this.creaRegla(...arguments); // Dos parámetros
    }
  }

  creaRegla(selector, opciones) {
    if (opciones) {
      let _selector =
        selector instanceof Array ? selector.join(", ") : selector;
      this.agrega(_selector + this.creaPropiedades(opciones));
    } else {
      for (let x in selector) {
        this.agrega(x + this.creaPropiedades(selector[x]));
      }
    }
  }

  creaPropiedades(opciones) {
    let retorno = opciones;
    if (typeof opciones !== "string") {
      retorno = "";
      for (let opcion in opciones) {
        retorno += opcion + ": " + opciones[opcion] + "; ";
      }
    }
    return entreLlaves(retorno);
  }

  limpia() {
    this.reglas = [];
    this.actualiza();
  }

  actualiza() {
    this.css.innerHTML = this.reglas.join("");
  }
}

function entreLlaves(cadena) {
  return (
    (cadena.startsWith("{") ? "" : "{") +
    cadena +
    (cadena.endsWith("}") ? "" : "}")
  );
}
