/**
 * Componente
 * Menú Flotante
 * Manejar un menú que aparece en pantalla según una condición dada
 * 
 * @icono es un @object de la forma:
 * etiqueta: svg
 * donde etiqueta identifica una opción y el svg es el ícono a representar la opción en el menú.
 * Estos íconos se incorporan o reemplazan los iconos estándar de:
 * refresca, guarda, agrega y elimina.
 * 
 * @opcion es un @object de la forma:
 * @atribute opcion:
 * @atribute icono: {string} identificador de la opción y del ícono
 * @atribute title: {string} propiedad "title" de la opción
 * 
 * El menú se construye con los íconos de las opciones.
 * Al escoger una de las opciones, se suceden tres acciones:
 * 2. Se dispara el evento "chx" con la propiedad detail.opcion
 * 1. Se dispara el evento "chxnombredeopción"
 * 
 * @tipo es un @string "ol" u "ul" (defecto) para indicar si se numeran las opciones o no
*/

const _rogMnuFlotante = {}

//export default 
class rogMnuFlotante extends HTMLElement {
  constructor () {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = tmp(this);
	
	  this.addEventListener("click",this.chx);	
  }

  get tipo () {
    return this.getAttribute("tipo") || "ul";   
  }

  get dom() {
    return this.shadow.querySelector(".mnucito");
  }

  set iconos(_iconos ={}) {
    Object.entries(_iconos).forEach(([nb,svg]) => iconos[nb] = svg);
  }

  /**
   * @method chx Respuesta a la escogencia de una opción
   * @param {event} e evento disparador de la acción
   */
  chx(e) {
    const opcion = e.target.closest("li");
    if (opcion) {
  	  // Click en la opción
      this.dispatchEvent(new Event("chx" +opcion.opcion));

	    // Click en la lista
      this.dispatchEvent(new CustomEvent("chx",{detail: {opcion}}));

      this.esconde();
    }
  }

  /**
   * @method mst Muestra el menú en la posición del cursor
   * @param {event} e Evento que dispara la acción 
   */
  mst(e) {
    this.dom.classList.add("activa");
    this.dom.style.top = e.clientY + "px";
    this.dom.style.left = e.clientX + "px";
  }

  /**
   * @method esconde cierra el menu
   */
  esconde() {
    this.dom.classList.remove("activa");
  }
}

customElements.define("mnu-flotante", rogMnuFlotante);

class liFlotante extends HTMLLIElement {
  constructor() {
    super();
//    this.shadow = this.attachShadow({ mode: "open" });
  }

  get opcion() {
    return this.getAttribute("opcion");
  }

  get icono() {
    return this.getAttribute("icono") || "";
  }

  set icono(svg) {
    this.textContent = svg;
  }

  get title() {
    return this.getAttribute("title");
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `<style>
        li:hover {
          box-shadow: 2px 4px 8px pink;
        }
      </style>
      ${this.icono ? iconos[this.icono] : ""}`;
  }
}

customElements.define("li-flotante", liFlotante, {extends: "li"});

/**
 * Lista de íconos estándar
 */
const iconos = {
  guarda:
    '<svg class="svg-inline--fa fa-check-square fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zm-204.686-98.059l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.248-16.379-6.249-22.628 0L184 302.745l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.25 16.379 6.25 22.628.001z"></path></svg>',
  agrega:
    '<svg class="svg-inline--fa fa-plus-circle fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path></svg>',
  elimina:
    '<svg class="svg-inline--fa fa-trash fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="red" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg>',
  refresca:
    '<svg class="svg-inline--fa fa-redo fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"></path></svg>'
};

/**
 * Plantilla
 */
function tmprogMnuFlotante(obj) {
  return `<style>
      .mnucito { 
        border-radius: 10px;
        padding: 1.25em 1.75em;
        box-shadow: 0 1px 3px 0 currentColor;
      }

      .mnucito svg  {
        height: 1em;
      }

      .vidrio {
        opacity: .9;
        background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
        backdrop-filter: blur(2rem);
      }

      .mnuFlotante {
        position: absolute;
        z-index: 2;
        scale: 0;
		    transform-origin: center;
        transition: scale 500ms ease-out;
      }

      .mnuFlotante.activa {
        scale: 100%;
      }

      ul {
        list-style-type: none;
      }
    </style>
      <${obj.tipo} class="mnucito vidrio mnuFlotante">
        <slot></slot>
      </${obj.tipo}>`;
}
