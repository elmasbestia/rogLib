const MUESTRA = false; // Suiche para "debugging"
const lib = {}; // Para agrupar las funciones

/**
 * Cada conversa es una secuencia de pasos(Procedimiento)
 * @class
 * @tutorial rogConversa
 */

 class rogConversa {
    constructor(datos) {
      this.w = {};
      /**
       * @property {string} nombre Nombre del Procesor
       */
      this.nombre = datos.stru.nombre || "Proceso";
      /**
       * @property {string} id Identificador único del proceso
       */
      this.id = datos.id || generaCodigoProceso();
      /**
       * @property {date} inicio Hora de Inicio del proceso
       */
      this.inicio = new Date();
      /**
       * @property {object} dom Objeto DOM usado por el proceso
       */
      this.dom = datos.dom;
      /**
       * @property {string} url direccion http del servicio de mensajería
       */
      this.url = datos.url || "/Hermes/" // `http://${inception}:3080/Hermes/`;
      /**
       * @property {object} datos Datos filiatorios del proceso
       */
      this.datos = datos.datos;
      /**
       * @property {object} stru Estructura del proceso
       */
      this.stru = datos.stru;
    }
  
    set dom(dom) {
      this.w.dom = objDom(dom);
      this.w.dom.innerHTML = lib.tmpConversa(this);
      this.w.dom.pasos = this.w.dom.querySelector(".rogPasos");
      this.w.dom.resultado = this.w.dom.querySelector(".rogResultado_contenido");
      this.pasos = this.w.dom.pasos.getElementsByClassName("rogPaso");
    }
  
    get dom() {
      return this.w.dom;
    }
  
    set stru(stru) {
      this.w.patrones = Object.keys(stru.pasos).map((paso, i) => {
        return { indice: paso, i, ...stru.pasos[paso] };
      });
      this.proximoPaso();
    }
  
    set finalizado(valor = true) {
      this.w.finito = valor;
      this.dom.pasos.style.pointerEvents = valor ? "none" : "unset";
    }
  
    get finalizado() {
      return this.w.finito;
    }

    get Estado() {
      return this.finalizado ? "Cerrada" : "Abierta";
    }
  
    /**
     * Agrega un nuevo paso a la secuencia del proceso
     * @param {string | object} paso
     *
     */
    agregaPaso(paso) {
      if (typeof paso === "string") this.dom.pasos.innerHTML += paso;
      else this.dom.pasos.appendChild(paso);
    }
  
    /**
     * Crea el siguiente paso del proceso, de acuerdo a la estructura
     * @param {number | object} paso
     */
    proximoPaso(paso = 0) {
      this.pasoActual = new rogPaso(
        this,
        typeof paso === "number"
          ? this.w.patrones[paso]
          : paso instanceof rogPaso
          ? paso
          : this.w.patrones.find((x) => x.indice === paso)
      );
      this.agregaPaso(this.pasoActual.dom);
  
      this.pasoActual.agir();
    }
  
    /**
     * 1. Muestra la evaluación del paso actual.
     * 2. Evalúa el fin del proceso
     * 3. Pasa al paso siguiente
     * @method
     */
    evalua() {
      console.assert(MUESTRA,"Evalua")
      console.assert(MUESTRA, (() => console.log(this))())
      let proximo;
  
      this.pasoActual.dom.style.pointerEvents = "none";
  
      if (this.finalizado) {
        alert("El proceso ya terminó");
      } else {
        this.mstResultado(this.pasoActual);
  
        if (this.pasoActual.fin) this.finalizado = true;
        else {
          proximo = this.pasoActual.proximo;
          console.assert(MUESTRA,proximo)
          if (proximo === this.w.patrones.length) {
            let msj = "El proceso llegó a su final sin resultado";
            alert(msj);
            this.finalizado = true;
            this.mstResultado(msj);
            proximo = null;
          }
        }
  
        if (proximo) this.proximoPaso(proximo);
      }
    }
  
    /**
     * Muestra el resultado de un paso
     * @param {object} paso 
     */
    mstResultado(paso) {
      const retorno = paso.resultado;
      if (retorno) {
        //const retorno = paso.resultado(paso, this);
  
        if (paso.fin) {
          this.dom.resultado.innerHTML = lib.tmpResultado(retorno);
          this.dom.children[0].open = false;
        } else this.agregaPaso(lib.tmpResultado(retorno));
      }
  
      return retorno;
    }

    /**
     * Muestra la lista de pasos del proceso
     */
    toString() {
      return Array.from(this.pasos).map(lib.linPaso).join("<br>");
    }
  }
  
  /**
   * Paso de un proceso
   * @class
   * @tutorial rogPaso
   */

  class rogPaso {
    /**
     * @constructor
     * @param  {object} conversa Proceso al cual pertenece el paso
     * @patron {patron} características del paso según la estructura del proceso
     */
    constructor(conversa, patron) {
      this.w = {};
  
      this.conversa = conversa;
      /**
       * @property {number} i Ordinal del paso en el proceso
       */
      this.i = conversa.pasos.length;
      this.patron = patron;
      /**
       * @property {number} indice Índice del paso en la estructura
       */
      this.indice = patron.indice;
      /**
       * @property {string} accion Identifica el tipo de acción
       */
      this.accion = patron.accion;
      /**
       * @property {object} dom Objeto DOM usado por el paso
       */
      this.dom = patron;
    }
  
    /**
     * @property {object} dom Elemento DOM donde se presenta el paso
     */
    set dom(patron) {
      this.w.dom = document.createElement("DIV");
      this.w.dom.className = "rogPaso";
      this.pregunta = patron;
      this.w.dom.obj = patron;
    }
  
    get dom() {
      return this.w.dom;
    }
  
    /**
     * @property {object} pregunta Elemento del paso que requiere una respuesta
     */
    set pregunta(patron) {
      if (patron.pregunta) {
        this.w.dom.innerHTML = lib.tmpPregunta(patron);
        Array.from(this.dom.getElementsByClassName("rogRespuesta")).forEach(
          (x) => (x.onclick = lib.chxRespuesta.bind(this))
        );
      }
    }
  
    /**
     *  @property {object} respuesta Valor de la respuesta y opcion escogida
     */
    set respuesta(valor) {
      this.w.respuesta = { valor, opcion: lib.opcion(this, valor) };
  
      // Si la respuesta viene de otro proceso, se pasa a la evaluación
      if (this.patron.rol) this.evalua();
      else lib.enviaRespuesta(this);
    }
  
    get respuesta() {
      return this.w.respuesta || {};
    }

    /**
     * @property {string} accion
     */
    set accion(valor = "respuesta") {
        this.w.accion = valor;
    }

    get accion() {
        return this.w.accion;
    }

    /**
     * @property {any} resultado Expresión producto de evaluar el paso
     */
    get resultado() {
      let retorno =
        (this.respuesta.opcion && this.respuesta.opcion.resultado) ||
        this.patron.resultado;
      return (retorno instanceof Function ? retorno(this) : retorno) || "";
    }
  
    /**
     * @property {boolean} fin Indica si el proceso termina en este paso
     */
    get fin() {
      return (
        (this.respuesta.opcion && this.respuesta.opcion.fin) || this.patron.fin
      );
    }
  
    /**
     * El próximo paso en el proceso puede:
     * 1. ser el siguiente paso en el esquema
     * 2. depender del valor de la respuesta
     * 3. depender de la opción escogida en la respuesta
     * @property {object | number} proximo Siguiente paso en el proceso
     */
    get proximo() {
      let retorno =
        (this.respuesta.opcion && this.respuesta.opcion.proximo) ||
        this.patron.proximo;
      return (
        (retorno instanceof Function ? retorno(this) : retorno) ||
        this.patron.i + 1
      );
    }
  
    /**
     * Un paso se evalúa según el valor de su respuesta correspondiente:
     * 1. Si el paso no tiene pregunta
     * 2. Si la respuesta la proporciona este proceso
     * 3. Si la respuesta la proporciona otro proceso (Según "rol")
     *
     * Si la respuesta viene de otro proceso, se muestra en la UI
     * 
     * @method
     */
    evalua() {
      if(this.patron.rol) lib.mstRespuesta(this);
      this.conversa.evalua();
    }
  
    /**
     * Qué hacer tras presentar el paso:
     * 1. Si el paso no tiene pregunta, se evalúa de una vez
     * 2. Si la respuesta la proporciona este proceso hay que esperar por "chxRespuesta"
     * 3. Si la respuesta la proporciona otro proceso (Según "rol") se espera la respuesta
     */
    agir() {
      if (this.patron.pregunta) {
        if (this.patron.rol) lib.esperaRespuesta(this);
      } else if (this.patron.envia) lib.enviaRespuesta(this);
        else this.evalua();
    }

    toString() {
      return lib.linPaso(this);
    }
  }
  
  /**
   * Alimenta la respuesta del paso desde la UI
   * @function
   * @param {event} e
   */
  lib.chxRespuesta = function (e) {
    const valor = e.target.value;
    this.respuesta = valor;
  }
  
  /**
   * Opción de respuesta correspondiente a un valor
   * @param {object} paso
   * @param {string | number} valor
   * @returns {object} opción según el esquema
   */
  lib.opcion = function (paso, valor) {
    return paso.patron.opciones instanceof Array
      ? paso.patron.opciones.find((x) => x === valor)
      : paso.patron.opciones[valor];
  }
  
  /**
   * @returns {string} Identificador único
   */
  function generaCodigoProceso() {
    return rogFmtFecha().serial();
  }
  
  /**
   * @returns {string} Texto HTML del ícono de espera
   */
  function icnEspera() {
    return `<i class="fas fa-spinner fa-spin">`;
  }
  
  /**
   *
   * @param {object} conversa
   * @returns {string} Texto HTML que encierra la conversa
   */
  lib.tmpConversa = function (conversa) {
    return `<details class="rogConversa" data-indice="${conversa.indice}" open>
        <summary class="rogResultado" data-indice="${conversa.indice}">
          <div class="rogResultado_id">
            ${conversa.nombre} [<span class="rogIndice">1</span>]<br>
            <time datetime='${rogFmtFecha(conversa.hInicio).full()}'>${rogFmtFecha(conversa.hInicio).coolfull()}</time>
          </div>
          <h4>Resultado:</h4>
          <div class="rogResultado_contenido">
            ${icnEspera()}</i><span>En proceso</span>
          </div>
        </summary>
        <hr>
        <div class="rogPasos"></div>
      </details>`;
  }
  
  /**
   * @param {*} patron
   * @returns {string} Texto HTML de una pregunta
   */
  lib.tmpPregunta = function (patron) {
    return `<label class="rogPregunta" for="rogRespuesta_${patron.i}">
      ${patron.pregunta}</label>
      ${lib.tmpOpciones(patron)}
      </div>`;
  }
  
  /**
   * Texto HTML del resultado de la evaluación de un paso
   * @param {string} texto A mostrar
   * @param {string} indice Propiedad indice del paso
   * @returns
   */
  lib.tmpResultado = function (texto, indice) {
    return `<p class="rogResultado" data-indice="${indice}">
      ${texto}
    </p>`;
  }
  
  /**
   * @param {objeto} patron Patrón del paso según el esquema
   * @returns {string} Texto HTML de las opciones de respuesta a una pregunta
   */
  lib.tmpOpciones = function (patron) {
    function tmpOpcion(opcion, i) {
      return `<input type="radio" class="rogRespuesta" name="rogRespuesta_${patron.i}" value="${opcion}">${opcion}`;
    }
    return patron.rol ?
      `<span class="respuesta">${icnEspera()}</i></span>` :
      desarma(patron.opciones).map(tmpOpcion).join("");
  }
  
  /**
   * @param {object} paso
   * @returns {string} Texto HTML para mostrar un paso
   */
  lib.linPaso = function (paso) {
    return `<div class="rogPaso" data-indice="${paso.i}">
      ${lib.tmpPregunta(paso.patron)}
    </div>`;
  }
  
  /**
   * Manejo de la mensajería
   */
  
  /**
   * Envía la respuesta leída de la UI al servidor
   * @param {object} paso 
   */
  lib.enviaRespuesta = function (paso) {
    accede("PUT", paso.conversa.url + "envia", lib.respuestaEnviaRespuesta(paso), {
      conversa: paso.conversa.id,
      accion: paso.accion,
      datos: paso.conversa.datos,
      bofe: {
        pregunta: paso.patron.pregunta,
        respuesta: paso.respuesta && paso.respuesta.valor
      }
    });
  }
  /**
   * Lee la respuesta de otro proceso identificada por
   * la propiedad "accion" y las propiedades de la propiedad "datos"
   * @param {object} paso 
   */
  lib.esperaRespuesta = function (paso) {
    function lmpObj(nb,obj={}) {
      return Object.entries(obj).reduce((retorno,[que,valor]) => {
        if(typeof valor !== "object") retorno[`${nb}.${que}`] = valor;
        return retorno;
      }, {});
    }
    accede("POST", paso.conversa.url + "espera/"+paso.accion, lib.respuestaRespuesta(paso), lmpObj("datos",paso.conversa.datos));
  }
  
  /**
   * Recibe respuesta de "enviaRespuesta"
   * @param {object} paso 
   * @returns 
   */
  lib.respuestaEnviaRespuesta = function (paso) {
    return (datos) => {
      if (datos.fallo) {
        if (confirm("¿Volvemos a intentar?")) lib.enviaRespuesta(paso);
      } else {
        paso.evalua();
      }
    };
  }
  
  /**
   * Recibe respuesta de "esperaRespuesta"
   * @param {object} paso 
   * @returns 
   */
  lib.respuestaRespuesta = function (paso) {
    return (datos) => {
      if (datos.fallo) alert("Falló la espera de la respuesta");
      else {
        paso.respuesta = datos.respuesta;
      }
    };
  }

  /**
   * Muestra la respuesta recibida 
   * @param {object} paso 
   */
  lib.mstRespuesta = function (paso) {
    paso.dom.querySelector(".respuesta").innerText = paso.respuesta.valor;
  }
