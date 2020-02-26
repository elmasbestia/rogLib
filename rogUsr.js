"use strict";
// Objero para manejar Usuarios
/*
*/

class rogUsr {

    constructor (usr,nb,correo,img,clase) {
        this.wUsr = usr ||"";
        this.wNombre = nb || "";
        this.wCorreo  = correo || "";
        this.wImg = img || "";
        this.wClase = clase || "";
        this.recordar = false;
    }
    get nombre () {
        return this.wNombre;
    }
    set nombre (valor) {
        this.wNombre = valor;
    }
    get correo () {
        return wCorreo;
    }
    set correo (valor) {
        wCorreo = valor;
    }
    
    get clase () {
        return this.wClase instanceof Array ? this.wClase.join(" ") : this.wClase;
    }
    
    set clase (valor) {
        if(this.wClase) {
            if (!(this.wClase instanceof Array)) this.wClase = [this.wClase];
            this.wClase.push(valor)
        } else this.wClase = valor;
    }
    
    muestra() {
        return this.ficha()    
    }
    
    private ficha (dom) {
        //                  I m a g e n 
        let retorno = "<div class='rogUsrFicha'>"
        retorno +="<figure class='rogUsrFig'>"
        retorno +="<img src='"+this.wImg+ "' class='rogUsrImg' title='"+this.wNombre+"' alt='"+this.wImg+"'>"
        retorno +="<figCaption></figCaption></figure>";
        //                  D a t o s
        retorno += "<div class='rogUsrData'>"
        retorno += "Usuario : "+this.wUsr+"<br/>";
        retorno += "Nombre  : "+this.wNombre+"<br/>";
        retorno += "Correo  : "+this.wCorreo+"<br/>";
        retorno += "Imagen  : "+this.wImg+"<br/>";
        retorno += "Clase   : "+this.clase+"<br/>";
        retorno += "Recordar: "+this.recordar+"<br/>";
        
        retorno += "</div>"
        retorno += "<div class='rogUsrDatos'>"
        for(let x in this)
{        retorno += "<label>" +x + ":</label> "+this[x]+"<br/>";
}        retorno += "</div>"

        retorno += "</div>"
        // SALIDA: retorna el codigo HTML o llena el elemento correspondiente
        if(dom) {
            let wDom = typeof dom === "string" ? document.getElementById(dom) : dom;
            wDom.innerHTML = retorno;
        } else return retorno;
    }
}