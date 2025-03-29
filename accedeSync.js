    
//export default 
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.accede = function (accion,url,fn,datos) {
    let xobj = new XMLHttpRequest();
    let xmlEstado = ["No inicializado", "Conectado", "Recibido", "Procesando", "Listo"];
	let retorno = {};

    function respuestaError({statusText, status}) {
        return { fallo: true, msj: statusText, status }
    }
    
	function msjErrorXML(e) {
		console.log(xobj.accion+"\n"+xobj.url+"\n¡E R R O R!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")\n"+xobj.status);
        retorno = (xobj.responseText.fallo ? JSON.parse(xobj.responseText)  : respuestaError(xobj));
	}

    function mstStatus(xobj) {
        console.log(xobj.readyState, url, xmlEstado[xobj.readyState]," (", xobj.status,")");
    }
    
    function aborta(e) {
        mstStatus();
        msjErrorXML(e);
    }

    xobj.accion = accion;
    xobj.url    = url;
     
    //xobj.overrideMimeType("application/json");
    xobj.withCredentials = true;
    xobj.open(accion, url, false);
    xobj.setRequestHeader('Content-type','application/json; charset=utf-8');
    xobj.onerror = aborta;
//    xobj.onreadystatechange = () => { console.log(xobj.readyState, url, xmlEstado[xobj.readyState]," (", xobj.status,")") };
    xobj.onload = () => {
        mstStatus();
		if (!xobj.status || (xobj.status > 400)) msjErrorXML()
        else {
            retorno = JSON.parse(xobj.responseText);
        }
	};
    xobj.send(JSON.stringify(datos));

    if(fn) fn(retorno);
    else return retorno;
}
