/**
	Objeto que permite controlar el recorrido de un arreglo
	
	@param {object | string} dom 		Elemento (O su id) donde actuará el objeto
	@param {array} a		  Arreglo a ser recorrido
	@param {function} fn		  Función a ejecutar para el elemento seleccionado
	@param {boolean | number} alAzar	Si el primer elemento se muestra al azar
	@param {array | string} aBsq		Arreglo de propiedades para la búsqueda
  @param {string} titulo Titulo a mostrar (Opcional)

    Ver "tmpReco" para ver el HTML del Objeto

*/

function rogReco(dom, a, fn, alAzar = 1, aBsq, titulo) {
  let _reco = {};
  let _dom  = objDom(dom);
  let _aBsq = desarma(aBsq);

  this.mst = function (x) {
    if (x === 0) x = a.length;
    else if (x > a.length) x -= a.length;
    _reco.act.value = _reco.x = x;
    _reco.vnt.innerHTML = fn(a[_reco.x - 1]);
  }

  function irA () {
    let _x = parseInt(_reco.act.value) || 0;
    this.mst(_x);
  }

  this.bsq = function (txt) {
    let  _x = bsqTxt(txt);
      
    if (_x) this.mst(_x + _reco.x);
  }

  this.txtBsq = () => _reco.txt.value;

    function bsqTxt(txt) {
        let _txt = rogPrm(txt) || _reco.txt.value
        let _exp = new RegExp(limpiaPlb(_txt), "i");

        let _x = toda(a, _reco.x).findIndex((x) =>
            o(
            _aBsq.map((e) => x[e]),
            _exp
        )) + 1;

        if(_x === 0) alert(`¡No hallé ${_txt}!`);
        
        return _x;
    }

  function azar() {
    return Math.ceil(Math.random() * a.length);
  }

  function toda(a, x) {
    return a.slice(x).concat(a.slice(0, x));
  }

  function o(a, exp) {
    return a.reduce((si, x) => (si = si || exp.test(limpiaPlb(x))), false);
  }

  function sig() {
    this.mst(_reco.x + 1);
  }

  function ant() {
    this.mst(_reco.x - 1);
  }

  // Inicialización
  if(!_dom.innerHTML) _dom.innerHTML = tmpReco();

  ["sig", "ant", "bsq", "vnt", "tit"].forEach(
    (x) => (_reco[x] = _dom.querySelector("." + x + "Reco"))
  );
  ["act", "num", "txt"].forEach(
    (x) => (_reco[x] = _dom.querySelector("[name=" + x + "Reco]"))
  );

  if(titulo) _reco.tit.innerHTML = titulo;

  _reco.sig.onclick = sig.bind(this);
  _reco.ant.onclick = ant.bind(this);
  _reco.bsq.onclick = this.bsq.bind(this);

  _reco.act.oninput = irA.bind(this);
  _reco.act.size = 6;

  _reco.num.value = a.length;
  _reco.num.size = 6;

  btnDefault(_reco.txt, _reco.bsq);

  this.mst(isNaN(alAzar) ? bsqTxt(alAzar) : (alAzar === true ? azar() : parseInt(alAzar) || 1));
}
		
function creaReco(dom,a,fn,aBsq,titulo,azar=true) {
	if(dom) {
		new rogReco(
			dom,
			a,
			fn,
			azar,
			aBsq,
			titulo
		);			
	} else return (x) => creaReco(x,a,fn,aBsq,titulo,azar);
}

function tmpReco() {
return `	
		<nav class="rogReco">
			<h3 class="titReco"></h3>
			<span class="btnReco antReco svgClaro"></span>
			<span class="spnReco">nro.</span>
			<input type="text" name="actReco" class="numReco">
			<span class="spnReco">de</span>
			<input type="text" name="numReco" class="numReco" readonly>
			<span class="btnReco sigReco svgClaro"></span>
			<span class="btnReco bsqReco svgClaro" title="Buscar un texto"></span>
			<input type="text" name="txtReco">
		</nav>
		<div class="vntReco"></div>
`
}

function marcaTxt(txt,txtBsq) {
    return txt.replace(new RegExp(txtBsq,"ig"), domTxt(txtBsq,"marck"))
}