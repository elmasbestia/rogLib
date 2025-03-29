const _rogAcorde = {
    tonos: {
      A: { M: 2220, m: 2210, 7: 3334, maj7: 3030 },
      Bb: { M: 113331, m: 3321 },
      B: { M: 224442, 7: 212020, m: 4432 },
      C: { M: 32010, m: 1013, 7: 32310, maj7: 32000 },
      Db: { M: 335553 },
      D: { M: 232, 7: 212 },
      "D#": { M: 111343 },
      E: { M: 22100, 7: 22120 },
      F: { M: 133211, 7: 133231 },
      "F#": { M: 244322, 7: 244342 },
      G: { M: 320002, 7: 320001, maj7: 304430 },
      "G#": { M: 355433 }
    },
  
    acorde(nb) {
      let nota = nb[0];
      let pos = 1;
      if (_rogAcorde.esSemi(nb[1])) {
        nota += nb[1];
        pos = 2;
      }
      let altera = nb === nota ? "M" : nb.slice(pos);
  
      let acorde = _rogAcorde.tonos[nota][altera];
      return acorde ? acorde : "000000";
    },
  
    esSemi(car) {
      return car === "#" || car === "b";
    },
  
    sufijos: () => _rogAcorde.creaSufijos(_rogAcorde.tonos),
  
    creaSufijos: (tonos) => {
      return Array.from(
        new Set(
          Object.values(tonos)
            .map((x) => Object.keys(x))
            .flat()
        )
      );
    },
  
    trastes: (n, acorde) => {
      const estaPisaa = (cuerda, traste) => _acorde[cuerda] == traste;
      const _acorde = (typeof acorde === "string"
        ? acorde
        : acorde.toString()
      ).padStart(6, "0");
      let retorno = "";
      for (let traste = 1; traste <= n; traste++) {
        for (let cuerda = 0; cuerda < 6; cuerda++) {
          retorno += `<div class='cuerda${
            estaPisaa(cuerda, traste) ? " pisaa" : ""
          }'></div>`;
        }
      }
      return retorno;
    }
  };
  
  class rogAcorde extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
  
    set nb(valor) {
      this.setAttribute("nb", valor);
    }
  
    get nb() {
      return this.getAttribute("nb") || "";
    }
  
    get acorde() {
      return _rogAcorde.acorde(this.nb);
    }
  
    set width(valor) {
      this.setAttribute("width", valor);
    }
  
    get width() {
      return this.getAttribute("width") || "1rem";
    }
  
    set modo(valor) {
      this.setAttribute("modo", valor);
    }
  
    get modo() {
      return this.getAttribute("modo") || "O";
    }
  
    connectedCallback() {
      this.render();
    }
  
    disconnectedCallBack() {}
  
    render() {
      this.shadow.innerHTML = tmpROGAcorde(this);
    }
  
    static get observedAttributes() {
      return ["modo", "nb", "acorde", "width"];
    }
  
    attributeChangedCallback(att, viejo, nuevo) {
      this.render();
    }
  }
  
  customElements.define("rog-acorde", rogAcorde);
  
  function tmpROGAcorde(obj) {
    return (
      tmpCSSAcorde(obj) +
      `<details><summary>${obj.nb}</summary><section${obj.modo === "O" ? "onclick='chxCuerda(event)'" : ""}>` +
      _rogAcorde.trastes(5, obj.acorde) +
      `</section></details>`
    );
  }
  
  function tmpCSSAcorde(obj) {
    return `<style>
        :host {
          display: inline-block;
          margin: .25em;
        }
        details {
          width: max-content;
        }
        summary {
          font-weight: bolder;
          filter: reverse();
          border-bottom-style: double;
        }
        section {
          font-size: ${obj.width};
          width: 6em;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          ${obj.modo === "O" ? "pointer-events: none;" : ""}
        }
        
        .cuerda {
          position: relative;
          background-color: var(--clrFndObj);
          border: 1px solid var(--clrTxtObj);
          min-width: 10px;
          aspect-ratio: 1;
        }
        
        .cuerda:nth-child(6n) {
          border: none;
        }
        
        .cuerda.pisaa::after {
          position: absolute;
          top: .25em;
          left: -.25em;
          content: " ";
          padding: 0.1em;
          width: .3em;
          aspect-ratio: 5 / 3;
          background-color: var(--clrTxtObj);
          border-radius: 50%;
        }
      </style>`;
  }
  