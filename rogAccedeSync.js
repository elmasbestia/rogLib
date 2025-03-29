/*
    Acceso AJAX sincrónico
*/

function accedeSinc(accion,url,fn,datos) {
    let xobj = new XMLHttpRequest();
    let xmlEstado = ["No inicializado", "Conectado", "Recibido", "Procesando", "Listo"];
	let retorno = respuestaError("WTF???", 500);
	let espera = new rogVntEspera()

    function respuestaError(statusText, status) {
        return { fallo: true, msj: statusText, status }
    }

	function mstError() {
		alert(msjError(xobj));
        retorno = xobj.responseText.fallo ? 
			xobj.responseText : 
			respuestaError(
                xobj.statusText || "No puedo comunicarme con la B.D.",
                xobj.status
            );
        return retorno;
	}

    xobj.accion = accion;
    xobj.url    = url;
     
    xobj.overrideMimeType("application/json");
    xobj.withCredentials = true;
    xobj.open(accion, url, false);
    xobj.setRequestHeader('Content-type','application/json; charset=utf-8');
    let token = localStorage.getItem(API);
    if(token) xobj.setRequestHeader("autoriza",token);
    xobj.onerror = mstError;
    xobj.onreadystatechange = () => { console.log(xobj.readyState, url, xmlEstado[xobj.readyState]," (", xobj.status,")") };
    xobj.onload = () => {
        analizaxObj(xobj);

		retorno = xobj.resultado;
	};
    xobj.send(JSON.stringify(datos));

    if(retorno.fallo) rogFallo(retorno);
    else if(fn) retorno = fn(retorno);

    espera.cierra();
    return retorno;
}
