const _rogDPT = {
    observados: ["value"],
  
    fmt: (nro) => nro.toString().padStart(2, "0"),
    n: (str) => (str ? parseInt(str) : 0),
  
    cambia: {
      value: (obj, viejo, nuevo) => {
        obj.edo = _rogDPT.n(nuevo.slice(0, 2));
        obj.mun = _rogDPT.n(nuevo.slice(2, 4));
        obj.pq = _rogDPT.n(nuevo.slice(4));
  
        obj.render();
      }
    },
  
    chx: (obj) => (e) => {
      const campos = {
        dptAbre: (obj, valor) => {
          obj._set("value", valor);
        },
  
        dptCmbMun: (obj, valor) => {
          obj._set("value", _rogDPT.fmt(obj.edo) + _rogDPT.fmt(valor));
        },
  
        dptCmbPq: (obj, valor) => {
          obj._set(
            "value",
            _rogDPT.fmt(obj.edo) + _rogDPT.fmt(obj.mun) + _rogDPT.fmt(valor)
          );
        }
      };
      const que = e.target;
      campos[que.name](obj, que.value);
    },
  
    llenaMun(obj) {
      return obj.municipios.map(
        (x) => `<option value="${x.mun}">${x.nb}</option>`
      );
    },
  
    llenaPqs(obj) {
      return obj.parroquias.map(
        (x) => `<option value="${x.pq}">${x.nb}</option>`
      );
    }
  };
  
  class rogDPT extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
  
      /*
        leeJson("https://rafagomez.neocities.org/rogLib/DPT", (data) => {
          this.#dptBD = data();
          this.render();
        });
        */
    }
  
    get value() {
      return this._get("edo") + this._get("mun") + this._get("pq");
    }
  
    get descEdo() {
      return this.edo ? dptBD[this.edo -1].EDO : "";
    }
  
    get municipios() {
      return this.edo
        ? dptBD[this.edo -1].Municipios.map((x, i) => ({
            mun: i +1,
            nb: x.Municipio
          }))
        : [];
    }
  
    get parroquias() {
      return this.mun
        ? dptBD[this.edo -1].Municipios[this.mun -1].Parroquias.map((x, i) => ({
            pq: i +1,
            nb: x
          }))
        : [];
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
  
    get marco() {
      return this.shadow.querySelector(".marco");
    }
  
    disconnectedCallBack() {}
  
    render() {
      this.shadow.innerHTML = tmpROGDPT(this);
      this.shadow
        .querySelectorAll(".rogDPTInp")
        .forEach((x) => (x.onchange = _rogDPT.chx(this)));
    }
  
    static get observedAttributes() {
      return _rogDPT.observados;
    }
  
    attributeChangedCallback(att, viejo, nuevo) {
      _rogDPT.cambia[att](this, viejo, nuevo);
    }
  }
  
  customElements.define("rog-dpt", rogDPT);
  
  // Plantilla
  function tmpROGDPT(obj) {
    return `<style></style>
        <fieldset class="marco">
        <select name="dptAbre" class="rogDPTInp" value="${_rogDPT.fmt(obj.edo)}">
          <option value="00">...</option>
          <option value="01">AM</option>
          <option value="02">AN</option>
          <option value="03">AP</option>
          <option value="04">AR</option>
          <option value="05">BO</option>
          <option value="06">CA</option>
          <option value="07">CO</option>
          <option value="08">DE</option>
          <option value="09">DC</option>
          <option value="10">FA</option>
          <option value="11">GU</option>
          <option value="12">LA</option>
          <option value="13">ME</option>
          <option value="14">MI</option>
          <option value="15">MO</option>
          <option value="16">NU</option>
          <option value="17">PO</option>
          <option value="18">SU</option>
          <option value="19">TA</option>
          <option value="20">TR</option>
          <option value="21">VA</option>
          <option value="22">YA</option>
          <option value="23">ZU</option>
          <option value="24">DF</option>
        </select>
        <input type="text" placeholder="Estado no definido" value="${
          obj.descEdo
        }" readonly>
        <div id="municipios">
          <input type="text" name="dptMun" size="2" value="${obj.mun}">
          <select name="dptCmbMun" class="rogDPTInp" value="${obj.mun}">
            <option value="0"></option>
            ${_rogDPT.llenaMun(obj)}
          </select>
          <div class="parroquias">
            <input type="text" name="dptPq" size="2" value="${obj.pq}">
            <select name="dptCmbPq" class="rogDPTInp" value="${obj.pq}">
              <option value="0"></option>
              ${_rogDPT.llenaPqs(obj)}
            </selct>
          </div>
        </div>
      </fieldset>`;
  }
  
  function leeJson(nbArch, cb) {
    fetch(`${nbArch}.json`, {
      mode: "no-cors",
      headers: { "Access-Control-Allow-Origin": "file://" }
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((res) => cb(res))
      .catch(console.error);
  }
  