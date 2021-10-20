    
export default function accede(accion,url,fn,datos) {
    let xobj = new XMLHttpRequest();
    let xmlEstado = ["No inicializado", "Conectado", "Recibido", "Procesando", "Listo"];
	let retorno = {};

    function respuestaError({statusText, status}) {
        return { fallo: true, msj: statusText, status }
    }
    
	function msjErrorXML(e) {
		alert(xobj.accion+"\n"+xobj.url+"\n¡E R R O R!!!\nStatus: " +xobj.status +" (" +xobj.statusText+")\n"+xobj.status);
        retorno = (xobj.responseText.fallo ? JSON.parse(xobj.responseText)  : respuestaError(xobj));
	}
     
    xobj.accion = accion;
    xobj.url    = url;
     
    xobj.overrideMimeType("application/json");
    xobj.withCredentials = true;
    xobj.open(accion, url, false);
    xobj.setRequestHeader('Content-type','application/json; charset=utf-8');
    xobj.onerror = msjErrorXML;
    xobj.onreadystatechange = () => { console.log(xobj.readyState, url, xmlEstado[xobj.readyState]," (", xobj.status,")") };
    xobj.onload = () => {
		if (!xobj.status || (xobj.status > 400)) msjErrorXML()
        else {
            retorno = JSON.parse(xobj.responseText);
        }
	};
    xobj.send(JSON.stringify(datos));

    if(fn) fn(retorno);
    else return retorno;
}
