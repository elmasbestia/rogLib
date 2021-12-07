/*
	Objeto que permite controlar el recorrido de un arreglo
	
	@param dom 		Elemento (O su id) donde actuará el objeto
					(Ver HTML al final de este archivo)
	@param a		Arreglo a ser recorrido
	@param fn		Función a ejecutar para el elemento seleccionado
	@param alAzar	Si el primer elemento se muestra al azar
	@param aBsq		Arreglo de propiedades para la búsqueda
*/

function rogReco(dom, a, fn, alAzar, aBsq, titulo) {
  let _reco = {};
  let _dom  = objDom(dom);
  let _aBsq = desarma(aBsq);

  function irA() {
    let _x = parseInt(_reco.act.value) || 0;
    mst(_x);
  }

  function bsq() {
    let  _x = bsqTxt();
      
    if (_x) mst(_x + _reco.x);
  }

    function bsqTxt(txt = _reco.txt.value) {
        let _exp = new RegExp(limpiaPlb(txt), "i");

        let _x = toda(a, _reco.x).findIndex((x) =>
            o(
            _aBsq.map((e) => x[e]),
            _exp
        )) + 1;

        if(_x === 0) alert("¡No hallé '+txt+'!");
        
        return _x;
    }
    
    
  function azar() {
    return Math.ceil(Math.random() * a.length);
  }

  function setX(valor) {
    let _convi = parseInt(valor);
    mst(_convi < 0 ? a.length + _convi + 1 : _convi);
  }

  function toda(a, x) {
    return a.slice(x).concat(a.slice(0, x));
  }

  function o(a, exp) {
    return a.reduce((si, x) => (si = si || exp.test(limpiaPlb(x))), false);
  }

  function mst(x) {
    if (x === 0) x = a.length;
    else if (x > a.length) x -= a.length;
    _reco.act.value = _reco.x = x;
    _reco.vnt.innerHTML = fn(a[_reco.x - 1]);
  }

  function sig() {
    setX(_reco.x + 1);
  }

  function ant() {
    setX(_reco.x - 1);
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

  _reco.sig.onclick = sig;
  _reco.ant.onclick = ant;
  _reco.bsq.onclick = bsq;

  _reco.act.oninput = irA;
  _reco.act.size = 6;

  _reco.num.value = a.length;
  _reco.num.size = 6;

  btnDefault(_reco.txt, _reco.bsq);

  setX(alAzar ? (isNaN(alAzar) ? bsqTxt(alAzar) : (alAzar === true ? azar() : alAzar)) : 1);
}
		
function creaReco(dom,a,fn,aBsq,titulo) {
	if(dom) {
		new rogReco(
			dom,
			a,
			fn,
			true,
			aBsq,
			titulo
		);			
	} else return (x) => creaReco(x,a,fn,aBsq,titulo);
}

function tmpReco() {
return `	
		<nav class="rogReco">
			<h3 class="titReco"></h3>
			<span class="btnReco antReco svgClaro"><span>
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

/* 
		U S O
		
let reco = new rogReco(
  "domId",
  Llena_Frases(),
  mstFrase,
  true,
  ["Frase", "Autor"]
);
*/
/*
		H T M L
		
<nav class="rogReco">
  <span class="btnReco antReco">p'alla</span>
  <span class="spnReco">nro.</span>
  <input type="text" name="actReco" class="numReco" size="6">
  <span class="spnReco">de</span>
  <input type="text" name="numReco" class="numReco" size="6" readonly>
  <span class="btnReco sigReco">p'acá</span>
  <span class="btnReco bsqReco" title="Buscar un texto">busca</span>
  <input type="text" name="txtReco">
</nav>

*/