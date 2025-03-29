let EXT = "jpg";

const _rogFoto = {
    tecla: (e) => {
      if ((e.key = "Escape")) e.target.getRootNode().host.cierra();
    },
  
    clic: (e) => {
      const btn = e.target.closest("button");
      if (btn) {
        const obj = e.target.getRootNode().host;
  
        if (btn.hasAttribute("guarda")) obj.guarda();
        else {
          if (btn.hasAttribute("cancela")) obj.cierra();
          else if (btn.hasAttribute("submit")) obj.toma();
              else obj.facial = !obj.facial;
        }
      }
    },
  
    prende: (e) => {
      const camara = document.querySelector("rog-camara");
      if(camara) {
        const foto = e.target.getRootNode().host;
        camara.label = foto.label;
        camara.addEventListener("guarda", e => {
          foto.label = e.target.label;
        });
        camara.render();
      }
    },

    expande: (e) => {
      const foto = e.target.getRootNode().host;
      otraVnt(foto.urlFoto);
    },
  
    iniCamara: (obj) => {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          obj.video.srcObject = stream;
          
          if(obj.facial) {
            faceapi.nets.tinyFaceDetector.loadFromUri('/lib/PDO/models')
            .then(
              obj.video.addEventListener('playing', () => {
                _rogFoto.creaPecos(obj);
                obj.cara = null;
                const displaySize = { width: obj.video.width, height: obj.video.height };
                faceapi.matchDimensions(obj.pecos, displaySize);
                obj.intervalo = setInterval(async () => {
                  const detection = await faceapi.detectSingleFace(obj.video, new faceapi.TinyFaceDetectorOptions())
                  if(detection) {
                    const area = faceapi.resizeResults(detection, displaySize)
                    obj.pecos.getContext('2d').clearRect(0, 0, obj.pecos.width, obj.pecos.height)
                    faceapi.draw.drawDetections(obj.pecos, area)
                    const caras = await faceapi.extractFaces(obj.video,[detection])
                    if(caras) {
                      obj.cara = caras[0]
                      obj.dispatchEvent(new Event("capta"))
                    }
                  }
                }, 100);
              }))

          }
        })
        .catch((err) => {
          alert("ERROR: No pude acceder la camara!")
          console.error(err);
        });
      }
    },

    creaPecos: (obj) => {
      if(!obj.pecos) {
        let pecos = faceapi.createCanvasFromMedia(obj.video);
        obj.shadowRoot.querySelector("MAIN").appendChild(pecos)
      }
    },

    sacaCara: async (obj) => {
      const canvas = document.createElement("CANVAS");
      if(obj.cara) {
        canvas.width = "130"
        canvas.height = "160"
        canvas.getContext("2d").drawImage(obj.cara, 0, 0, canvas.width, canvas.height);
      } else {
        canvas.getContext("2d").drawImage(obj.video, 0, 0);
      }
      return canvas;
    },

    rogDonna(vnt) {
      let inicio = { x: 0, y: 0 };
      let traza = [];

      vnt.style.cursor = "grab";
      vnt.onmousedown = cogelo;

      function cogelo(e) {
        e.preventDefault();

        console.log ("cogelo!")
        // Posición inicial
        inicio.x = e.clientX;
        inicio.y = e.clientY;
        traza.push(inicio);
        document.onmouseup = sueltalo;
        document.onmousemove = muevelo;
      }

      function muevelo(e) {
        console.log("Movelo!")
        e.preventDefault();

        let posx = inicio.x - e.clientX;
        let posy = inicio.y - e.clientY;
        inicio.x = e.clientX;
        inicio.y = e.clientY;

        vnt.style.top = vnt.offsetTop - posy + "px";
        vnt.style.left = vnt.offsetLeft - posx + "px";

        traza.push({
		      inicio,
		      client: {
			      x: e.clientX,
			      y: e.clientY,
		      },
		      pos: {
      			x: posx,
			      y: posy
      		},
          offset: {
            x: vnt.offsetLeft,
            y: vnt.offsetTop
          },
          vntX: vnt.style.left,
          vntY: vnt.style.top
        });
      }

      function sueltalo() {
        console.log("Soltalo!")
        console.log(traza)

        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  };
  
  class rogFoto extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
  
    get foto() {
      return this.shadowRoot.querySelector("IMG");
    }
  
    get label() {
      return this.getAttribute("label");
    }
  
    set label(valor) {
      this.setAttribute("label", valor);
    }
  
    get url() {
      return this.getAttribute("url");
    }
  
    set url(valor) {
      this.setAttribute("url", valor);
    }

    set ext(valor) {
      this.setAttribute("ext",valor);
    }

    get ext() {
      return Extension(this.label) || this.getAttribute("ext") || EXT;
    }

    get urlFoto() {
      return this.label ? this.poneExt((this.url ? this.poneBarra(this.url) : "") +this.label) : "";
    }

    poneExt(nb) {
      let retorno = nb;
      if(nb && !Extension(nb)) retorno += "." +this.ext;
      return retorno;
    }

    poneBarra(nbDir) {
      return nbDir ? nbDir + (nbDir.endsWith("/") ? "" : "/") : nbDir;
    }
  
    connectedCallback() {
      this.render();
    }
  
    disconnectedCallBack() {}
  
    render() {
      this.shadow.innerHTML = tmpROGFoto(this);
    }
  
    static get observedAttributes() {
      return ["label"];
    }
  
    attributeChangedCallback(att, viejo, nuevo) {
      this.dispatchEvent(new Event("change"));
      this.render();
    }
  }
  
  customElements.define("rog-foto", rogFoto);
  
  class rogCamara extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
  
    get url() {
      return this.getAttribute("url");
    }

    set url(valor) {
        this.setAttribute("url",valor)
    }

    set label(valor) {
      this.setAttribute("LABEL",valor);
    }

    get label() {
      return this.getAttribute("LABEL");
    }

    set ext(valor) {
      this.setAttribute("ext",valor);
    }

    get ext() {
      return Extension(this.label) || this.getAttribute("ext") || EXT;
    }

    get facial() {
      return this.hasAttribute("facial") && (this.getAttribute("facial") !== "false");
    }

    set facial(valor) {
      this.setAttribute("facial", valor);
    }

    get width() {
      return this.getAttribute("width") || "260";
    }

    set width(valor) {
      this.setAttribute("width", valor);
    }

    get height() {
      return this.getAttribute("height") || "320";
    }

    set height(valor) {
      this.setAttribute("height", valor);
    }
    get guardada() {
      return this.shadowRoot.querySelector("#btnGuarda").disabled;
    }
  
    set guardada(valor) {
      const btn = this.shadowRoot.querySelector("#btnGuarda");
      if(this.url) {
        btn.disabled = valor;
        btn.title = "Guarda la foto."
      } else btn.title = 'No puedo guardar: me falta el url.';
    }

    get video() {
      return this.shadowRoot.querySelector("video")
    }

    get pecos() {
      return this.shadowRoot.querySelector("CANVAS")
    }

    alert(msj = "") {
      this.shadowRoot.querySelector("#alert").textContent = msj;
    }

    activa() {
      this.shadowRoot.querySelector("dialog").show();
    }

    cierra() {
      this.shadowRoot.querySelector("dialog").close();
    }

    toma() {
      this.alert();
      _rogFoto.sacaCara(this).then(img => {
        this.data = img.toDataURL(`image/${EXT}`);
        console.log(this.data.length +' bytes.')
        this.guardada = false;
        this.dispatchEvent(new Event("toma"));
      })
    }
  
    guarda() {
      if (this.url) {
        console.log(`${this.data.length} octetos (${rogFmt.Moneda(this.data.length/1024)}Ko)`)
        accede(
          "PUT",
          this.url,
          function (respuesta) {
            console.log(respuesta);
            this.alert(respuesta.msj);
            this.label = respuesta.label;
            this.guardada = true;
            this.dispatchEvent(new Event("guardo"));
          }.bind(this),
          {
            nb: this.label,
            foto: this.data
          }
        );
      } else {
        this.alert("Me falta el atributo 'url'!");
      }
    }
  
    connectedCallback() {
      this.render();
    }
  
    disconnectedCallBack() {
      clearInterval(this.intervalo);
    }
  
    render() {
      this.shadow.innerHTML = `<style>
          #rogCamara {
              position: absolute;
              padding: .75em;
              height: cal(var(--szFoto, 120px) * 1.5);
              background: linear-gradient(#dbdae1, #a3baaa);
              border-radius: 15px;
              animation: aparece 2s linear forward;
              z-index: 1000;
          }

          main {
            position: relative;
          }

          canvas {
            position: absolute;
            top: 0;
            left: 0;
          }

          @keyframes aparece {
            0% {
              opacity: 0;
            }
            75% {
              scale: .5;
            }
            100% {
              opacity: 1;
            }
          }
          nav {
            display: flex;
            justify-content: space-around;
          }

          .rogBtn {
            margin: 1px;
            aspect-ratio: 1;
            background-color: #fff;
            text-align: center;
            font-size: .75em;
            border-radius: 15%;
            color: #777;
            cursor: pointer;

            box-shadow:  2px 2x 1px rgba(0, 0, 0, .7);
          }

          .rogBtn[checked] {
            background-color: #eee;
            box-shadow: inset 0 6px 10px rgba(0, 0, 0, .5);
            color: rgba(0,255,0,.7);
          }
        </style>
        <dialog id="rogCamara" onkeydown="_rogFoto.tecla(event)"
          ${this.facial ? " facial" : ""}
          ${this.label ? " open" : ""}
        >
          <main>
            <video id="camara" controls autoplay capture width="${this.width}" height="${this.height}"></video>
          </main>
          <div id="alert"></div>
          <nav onclick="_rogFoto.clic(event)">
            <button class="rogBtn" submit  title="Toma la foto">📸</button>
            <button class="rogBtn" guarda  title="guarda la foto" disabled id="btnGuarda">💾</i></button>
            <button class="rogBtn" facial  title="${this.facial ? "Quitar reconocimiento facial" : "Reconocimiento facial"}" id="btnFacial">${this.facial ? "☻" : "😀"}</i></button>
            <button class="rogBtn" cancela title="Cancela">✘</button>
          </nav>
        </dialog>`;
      _rogFoto.iniCamara(this);
      _rogFoto.rogDonna(this.shadowRoot.querySelector("dialog"));
    }
  
    static get observedAttributes() {
      return ["facial"];
    }
  
    attributeChangedCallback(att, viejo, nuevo) {
      this.render();
    }
  }
  
  customElements.define("rog-camara", rogCamara);

  function tmpROGFoto(obj) {
    return `<style>
              main {
                position: relative;
                display: inline-block;
              }

              menu {
                position: absolute;
                bottom: 0;
                right: 0;
                opacity: 0;
                font-size: .8em;
                line-height: 1.5em;
              }

              .fondo {
                padding: .25rem;
                opacity: 0.7;
                background-image: linear-gradient(
                  to right bottom,
                  rgba(255, 255, 255, 0.7),
                  rgba(255, 255, 255, 0.3)
                );
                backdrop-filter: blur(2rem);
              }

              menu .opcion {
                cursor: pointer;
                background-color: var(--clrTxtObj, white);
                color: var(--clrFndObj, black);
              }

              main:hover menu {
                opacity: 1;
                animation: aparece 1s linear forward;
              }
          
              .foto {
                  height: var(--szFoto, 120px);
                  aspect-ratio: var(--ratioFoto, 26/32);
                  border: 5px solid white;
                  box-shadow: var(--sombra);
              }
          
              .foto.tomada {
                  color: var(--clrEnh);
                  border: 5px solid black;
              }
          </style>
          <main>
              <menu>
                <section class="fondo">
                  <div class="opcion" title="Expande" onclick="_rogFoto.expande(event)">⇱</div>
                  <div class="opcion" title="Cambia" onclick="_rogFoto.prende(event)">📸</div>
                </section>
              </menu>
              <img src="${obj.urlFoto}" alt="Fotico" class="foto" id="foto"">
          </main>`;
  }
  