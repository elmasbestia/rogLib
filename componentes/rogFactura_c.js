const _rogFct = {
    observados: ["value", "height", "label"],
  
    cambia: {
      value: (obj, viejo, nuevo) => {
        obj.detalle = _rogPai.creaSeries(nuevo);
  
        obj.total = obj.datos.reduce((total, valor) => (total += valor), 0);
  
        obj.render();
      },
  
      label: (obj, viejo, nuevo) => {
        obj.titulo = nuevo;
      }
    },
  
    mstDetalle: (e) => {
      e.target.obj.leyenda.classList.add("activa");
    },
  
    cierraDetalle: (e) => {
      e.currentTarget.classList.remove("activa");
    },
};
  
  class rogFct extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
  
      this.detalle = [];
    }

    get name() {
      return this.getAttribute("name");
    }
      
    set datos(datos) {
      this._set("value", JSON.stringify(datos));
    }
  
    get datos() {
      return this.datos.map((x) => {x.id, x.monto, x.divisa});
    }

    agrega(detalle) {
        if(Array.isArray(detalle)) this.detalle = [...this.detalle, ...detalle];
        else this.detalle.push(detalle);
    }
  
    _get(que) {
      return this.getAttribute(que);
    }
  
    _set(que, valor) {
      this.setAttribute(que, valor);
    }
    
    get leyenda() {
      return this.shadow.querySelector(".leyenda");
    }
  
    toString() {
      return this.series.map((x) => x.toString());
    }
  
    connectedCallback() {
      this.render();
    }
  
    disconnectedCallBack() {}
  
    render() {
      this.shadow.innerHTML = tmpROGPai(this);
      this.shadow.querySelector(".pai").obj = this;
    }
  
    static get observedAttributes() {
      return _rogPai.observados;
    }
  
    attributeChangedCallback(att, viejo, nuevo) {
      if (_rogPai.cambia[att]) _rogPai.cambia[att](this, viejo, nuevo);
      this.render();
    }
  }

  class rogPago {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }
  
      get name() {
        return this.getAttribute("name");
      }
        
      set datos(datos) {
        this._set("value", JSON.stringify(datos));
      }
    
      get datos() {
        return this.datos.map((x) => {x.id, x.monto, x.divisa});
      }
  
      agrega(detalle) {
          if(Array.isArray(detalle)) this.detalle = [...this.detalle, ...detalle];
          else this.detalle.push(detalle);
      }
    
      _get(que) {
        return this.getAttribute(que);
      }
    
      _set(que, valor) {
        this.setAttribute(que, valor);
      }
    
      connectedCallback() {
        this.render();
      }
    
      disconnectedCallBack() {}
    
      render() {
        this.dispatchEvent(new Event("antesDeMostrar"));
        this.shadow.innerHTML = ``;
        this.dispatchEvent(new Event("despuesDeMostrar"));
      }
    
      static get observedAttributes() {
        return ["divisa","cambio","value","van"];
      }
    
      attributeChangedCallback(att, viejo, nuevo) {
        this.render();
      }
  }

  class rogMnt {}

  class rogTotal extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }
  
      get name() {
        return this.getAttribute("name");
      }
        
      set datos(datos) {
        this._set("value", JSON.stringify(datos));
      }
    
      get datos() {
        return this.datos.map((x) => {x.id, x.monto, x.divisa});
      }
  
      agrega(detalle) {
        if(Array.isArray(detalle)) this.detalle = [...this.detalle, ...detalle];
        else this.detalle.push(detalle);
      }
    
      _get(que) {
        return this.getAttribute(que);
      }
    
      _set(que, valor) {
        this.setAttribute(que, valor);
      }
    
      connectedCallback() {
        this.render();
      }
    
      disconnectedCallBack() {}
    
      render() {
        this.dispatchEvent(new Event("antesDeMostrar"));
        this.shadow.innerHTML = ``;
        this.dispatchEvent(new Event("despuesDeMostrar"));
      }
    
      static get observedAttributes() {
        return ["divisa","cambio","value","van"];
      }
    
      attributeChangedCallback(att, viejo, nuevo) {
        this.render();
      }
    /*  
    Actualiza total
    Total presenta segun su divisa:
    Total
    Van (Suma de pagos)
    Quedan: total -van 
    */
  }

  customElements.define("rog-monto", rogMnt)
  customElements.define("rog-Total", rogTotal)
  customElements.define("rog-pago", rogPago)
  customElements.define("rog-factura", rogFct);
  
  function tmpROGFct(obj) {
    return ``;
  }
  /*
  Objeto Fct:
    Detalle: le quito y le pongo:
        monto y
        divisa
        etc.
    Actualiza Monto:
        Acumula detalle por divisa
    Pagos:
        lee Pagos
    Actualiza total
        Total presenta segun su divisa:
        Total
        Van (Suma de pagos)
        Quedan: total -van 
*/
