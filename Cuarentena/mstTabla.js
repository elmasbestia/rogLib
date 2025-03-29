          
function domLinea (valores,clsLinea,clsCelda,fmts) {
    return domTxt(valores.reduce((linea,valor, i) => linea += domCelda(valor,clsCelda === i ? 'rogId': null),""), "tr",clsLinea);
}

function agrLinea(dom, valores,clsLinea,clsCelda,fmts) {
    objDom(dom).innerHTML += domLinea(valores,clsLinea,clsCelda,fmts);
}

function clsComp(valor,cls) {
    let _valor = def(valor);
    let _cls = _valor && _valor.clase || "";
    if(cls) {
        return cls +" "+_cls;
    } else {
        return _cls;
    }
}

function domCelda(valor,clase = "") { 
    let _valor = def(valor);
    return domTxt(
        (typeof _valor === "object" ? _valor.valor : _valor) || "",
        "td", clsComp(_valor,clase)
    );  
}

// Caducó: usar rogTab
function mstTabla(datos,dom,caption = "",campos = null,Fn = null,nbId="") {
	let donde = dom ? objDom(dom) : document.createElement("DIV");
    
    if(datos.length) {
        let tabla = "<table><caption><h3>" +caption+ "<sup><span class='badge'>"+datos.length+"</span></sup></h3></caption>";
        let titulos;
        let _campos = desarma(campos || datos[0]);
        let fnId = _campos.indexOf(nbId);

        datos.forEach(e => {
            if (!titulos) {
                titulos = tabTitulos(_campos)
                tabla += titulos+"<tbody>";
            }
            tabla += domLinea(_campos.map(x => e[x]),null,fnId);
        });
        tabla += "</tbody></table>";

        donde.innerHTML = tabla;
        if (Fn) rogAsigna("#"+donde.id+" .rogId","onclick",Fn);
    } else {
        donde.innerHTML = "<h3>No hay " +caption+ "</h3>"
    }
    if(!dom) return donde.innerHTML;
}

function tabTitulos(campos) {
    return domTxt(
        domTxt(
            campos.reduce((linea,valor) => linea += domTxt(valor,"th"),""),
            "tr"
        ),
        "thead"
    );
}

