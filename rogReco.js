/*
	Objeto que permite controlar el recorrido de un arreglo
	
	@param dom 		Elemento (O su id) donde actuará el objeto
					(Ver HTML al final de este archivo)
	@param a		Arreglo a ser recorrido
	@param fn		Función a ejecutar para el elemento seleccionado
	@param alAzar	Si el primer elemento se muestra al azar
	@param aBsq		Arreglo de propiedades para la búsqueda
*/

function rogReco(dom, a, fn, alAzar, aBsq) {
  let _reco = {};
  let _dom  = objDom(dom);
  let _aBsq = desarma(aBsq);

  function irA() {
    let _x = _reco.act.value;
    mst(_x);
  }

  function bsq() {
    let _exp = new RegExp(_reco.txt.value, "i");

    let _x = toda(a, _reco.x).findIndex((x) =>
      o(
        _aBsq.map((e) => x[e]),
        _exp
      )
    );
    if (_x === -1) alert("Sejo!");
    else mst(_x + _reco.x + 1);
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
    return a.reduce((si, x) => (si = si || exp.test(x)), false);
  }

  function mst(x) {
    if (x === 0) x = a.length;
    else if (x > a.length) x -= a.length;
    _reco.act.value = _reco.x = x;
    fn(a[_reco.x - 1]);
  }

  function sig() {
    setX(_reco.x + 1);
  }

  function ant() {
    setX(_reco.x - 1);
  }

  ["sig", "ant", "bsq"].forEach(
    (x) => (_reco[x] = _dom.querySelector("." + x + "Reco"))
  );
  ["act", "num", "txt"].forEach(
    (x) => (_reco[x] = _dom.querySelector("[name=" + x + "Reco]"))
  );

  _reco.sig.onclick = sig;
  _reco.ant.onclick = ant;
  _reco.bsq.onclick = bsq;

  _reco.act.oninput = irA;
  _reco.act.size = 6;

  _reco.num.value = a.length;
  _reco.num.size = 6;

  btnDefault(_reco.txt, _reco.bsq);

  setX(alAzar ? azar() : 1);
}

/* 
		U S O
		
let reco = new rogReco(
  document.querySelector(".rogReco"),
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