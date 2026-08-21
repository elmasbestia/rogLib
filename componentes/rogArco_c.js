
const _rogArco = {
    observados: ["auto"],

    cambia: {},

    chxOpc: (e) => {
      const opcion = e.target;
      const obj = opcion.getRootNode().host
      if(obj) {
      obj.dispatchEvent(new CustomEvent("escogeOpcion", {detail: {
        opcion,
        indice: opcion.style.getPropertyValue("--indice")
      }}))
    } else debugger

    }
  };
  
  class rogArco extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    get width() {
      return this.getAttribute("width") || "40px";
    }

    set auto(valor) {
        this.setAttribute("auto", valor);
    }
    get auto() {
        return this.hasAttribute("auto") && (this.getAttribute("auto") !== "false");
    }

    get opciones() {
      return this.shadow.querySelector("slot").assignedElements();
    }

    get nOpciones() {
      return this.opciones.length;
    }

    connectedCallback() {
      this.render();
    }
  
    disconnectedCallBack() {}
  
    render() {
      this.shadow.innerHTML = tmprogArco(this);
      this.shadow.addEventListener("click",_rogArco.chxOpc);

      // Indexa las opciones
      this.opciones.forEach((x, i) => {
        x.style.setProperty("--indice",i);
        x.classList.add("mnuOpc");
      });
    }
  
    static get observedAttributes() {
      return _rogArco.observados;
    }
  
    attributeChangedCallback(att, viejo, nuevo) {
      if (_rogArco.cambia[att]) _rogArco.cambia[att](this, viejo, nuevo);
      this.render();
    }
  }
  
  customElements.define("rog-arco", rogArco);

  function tmprogArco(obj) {
    return `<style>${tmpCSSROGArco(obj)}</style>
      <nav>
        <input type="checkbox" 
            ${obj.auto ? "checked" : ""}
            class="mnuBtn" 
        >
        <label for="mnuBtn">${obj.getAttribute("label")}</label>
        <ul>
            <slot></slot>
        </ul>
      </nav>
    `;
  }

function tmpCSSROGArco(obj) {
    return `
  input {
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    z-index: 2;
    opacity: 0;
    cursor: pointer;
  }
  input:hover + label,
  input:hover + label:before,
  input:hover + label:after {
    background: white;
  }
  input:checked + label {
    background: transparent;
  }
  input:checked + label:before,
  input:checked + label:after {
    top: 0;
    width: var(--szOpcion, ${obj.width});
    transform-origin: 50% 50%;
  }
  input:checked + label:before {
    transform: rotate(45deg);
  }
  input:checked + label:after {
    transform: rotate(-45deg);
  }
  input:checked ~ ul ::slotted(.mnuOpc) {
    z-index: 3;
    opacity: 1;
    transform: rotate(calc(60deg * var(--indice))) translateX(-110px);
  }

  input:checked ~ ul ::slotted(.mnuOpc a) {
    pointer-events: auto;
  }
  input + label {
    width: ${obj.width};
    height: 5px;
    display: block;
    z-index: 1;
    border-radius: 2.5px;
    background: rgba(255, 255, 255, 0.7);
    transition: transform 0.5s, top 0.5s;
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
  }
  input + label:before,
  input + label:after {
    width: ${obj.width};
    height: 5px;
    display: block;
    z-index: 1;
    border-radius: 2.5px;
    background: rgba(255, 255, 255, 0.7);
    transition: transform 0.5s, top 0.5s;
    content: "";
    position: absolute;
    left: 0;
  }
  input + label:before {
    top: 10px;
  }
  input + label:after {
    top: -10px;
  }

  ::slotted(.mnuOpc) {
    position: absolute;
    display: block;
    inset: 0;
    margin: auto;
    width: calc(2 * ${obj.width});
    aspect-ratio: 1;
    display: block;
    opacity: 0;
    transition: 0.5s;
    transition-delay: calc(var(--indice) * 0.2s);
  }

  ::slotted(.mnuOpc a) {
    transform: rotate(calc(var(--indice) * -60deg));
  }
  ::slotted(.mnuOpc a) {
    display: block;
    width: inherit;
    height: inherit;
    line-height: 80px;
    color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    text-align: center;
    text-decoration: none;
    font-size: 40px;
    /* pointer-events: none; */
    transition: 0.2s;
  }
  ::slotted(.mnuOpc a:hover) {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    color: white;
    background: rgba(255, 255, 255, 0.3);
    font-size: 44.4444444444px;
  }`;
}

/*
$toggler-size: 40px;
$toggler-color: white;
$toggler-transition: transform .5s, top .5s;

$item-size: $toggler-size * 2;
$item-color: white;
$item-transition: .5s;
*/
