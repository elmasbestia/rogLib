/*
    Objeto para manejar Facturas
    
    @param dom  Elemento donde aparecerá la factura
    @param fnTotal    Función de cerrar la venta
    @param fnLstProd  Función que retorna la lista de productos con sus precios ({producto: descripcion, precio: precio en Ref})
*/

class rogFact {
    constructor(dom, fnTotal, fnLstProd) {
      this.w = {};
  
      this.totaliza = () => fnTotal(this);
      this.total = 0;
  
      this.dom = dom;
  
      this.css = new rogCSS(creaCSS());
  
      this.vnt = new rogVntBlq(
        {
          clase: "factura",
          titulo: "Esta venta",
          boton: this.btn,
          visible: false
        },
        {
          tabla: true,
          nb: "Artículos",
          titulo: "Articulos",
          stru: [
            { nb: "Cant", tipo: "number", original: 1 },
            { nb: "Producto", tipo: "list", match: fnLstProd },
            { Precio: "number" },
            { nb: "Total", tipo: "number", f: (x) => x.Cant * x.Precio }
          ],
          Fn: { Cant: incrementa },
          lee: this.leeArticulo.bind(this)
        }
      );
  
      this.vnt.frm.Producto.onchange = this.traePrecio.bind(this);
    }
  
    set dom(dom) {
      this.w.dom = dom ? objDom(dom) : document.createElement("DIV");
      this.dom.innerHTML = tmpFact();
      this.creaCtl();
      this.btn = this.ctl.btnFact;
    }
  
    get dom() {
      return this.w.dom;
    }
  
    set datos(datos) {
      this.vnt.blq.datos = datos;
    }
  
    get datos() {
      return this.vnt.blq.datos;
    }
  
    get divisa() {
      return this.ctl.divisa.value;
    }

    monto (divisa) {
        if(divisa) return rogFmt.Moneda(this.monto()[divisa])
        else return {$: this.total, Bs: this.total*this.cambio}
    }

    leeCambio(e) {
      this.cambio = this.ctl.cambio.value;
      this.calcTotal();
    }
  
    traePrecio(e) {
      let prod = e.target;
      let opcion = Array.from(prod.list.options).find(
        (x) => x.value === prod.value
      );
      let precio = opcion.dataset.precio;
      this.vnt.frm.Precio.value = precio;
      debugger;
    }
  
    agregaArticulo(art) {
      this.vnt.agrega({
        Cant: art.Cant,
        Producto: art.Producto,
        Precio: art.Precio,
        Total: art.Cant * art.Precio
      });
      this.leeArticulo();
    }
  
    leeArticulo(evento) {
      this.calcTotal();
    }
  
    calcTotal() {
      this.total = this.datos.reduce((total, art) => (total += art.Total), 0);
      this.mstTotal();
    }
  
    mstTotal() {
      this.ctl.total.value = this.monto(this.divisa);
    }
  
    creaCtl() {
      this.ctl = {};
      this.dom.querySelectorAll("[name]").forEach((x) => (this.ctl[x.name] = x));
  
      this.ctl.cambio.oninput = this.leeCambio.bind(this);
      this.ctl.divisa.onchange = this.calcTotal.bind(this);
      this.ctl.totaliza.onclick = this.totaliza.bind(this);
    }
  }
  
  function tmpFact() {
    return `<nav class="ctlFact">
          <button name= "totaliza" class="mnuOpc rogBtn" title="Cerrar la venta"><i class="fas fa-cash-register"></i></button>
          <button name="btnFact" class="mnuOpc rogBtn" data-estado="false">
              <span class="see" title="Mostrar la factura"><i class="fas fa-eye"></i></span>
              <span class="noSee" title="Esconder la factura"><i class="fas fa-eye-slash"></i></span>
          </button>
          <label for="cambio">Cambio:</label><br />
          <input type="number" name="cambio" size="6"/>
      </nav>
      <div class="divTotal">
          <select name="divisa">
              <option>$</option>
              <option>Bs</option>
          </select>
          <input type="text" name="total" readonly tabindex="-1"/>
      </div>`;
  }
  
  function creaCSS() {
    return {
      "[name=btnFact] span": { display: "none" },
      "[name=btnFact][data-estado=true] .noSee": { display: "unset" },
      "[name=btnFact][data-estado=false] .see": { display: "unset" },
      ".factura": { "--clrFnd": "white", "--clrTxt": "black" },
      ".total": { "text-align": "right" }
    };
  }
  
  function incrementa(e) {
    alert("Incrementa");
    let valor = e.target.value;
    e.target.value = ++e.target.value;
  }
