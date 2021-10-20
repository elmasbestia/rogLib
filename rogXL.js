// Librería para manejar Hojas XL con js-xlsx

const XL = require('js-xlsx');
const lib = XL.utils;

class Libro {
    constructor(nbArch) {
        console.log("Abrir Libro ", nbArch)
        this._nb = nbArch;
        this.wb = abreXL(nbArch);
        this.proxHoja = proxHoja.call(this);
        this.xHoja = 0;
    }
    
    get nombre() {
        return this._nb;
    }
    
    get hojas() {
        return this.wb.Sheets
    }

    get proximaHoja() {
        const prox = this.proxHoja.next();

        return prox.done ? null : prox.value;
    }

    recorre(fn) {
        recorreLibro(this,fn);
    }

    guarda() {
	   XL.writeFile(this.wb,this.wb.FILENAME);
	   /*
Exporting Workbook for Download
We need to export the workbook as xlsx binary. Use write function then pass the bookType as xlsx and output Type as binary

var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
We now have our xlsx binary data on wbout var. However, the correct content type for excel file is octet stream so you’ll need to convert the binary data into octet. We can achieve that by using arrayBuffer, UInt8Array and bit operation like this.

function s2ab(s) { 
                var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
                var view = new Uint8Array(buf);  //create uint8array as viewer
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
                return buf;    
}
We’re going to utilize Filesaver.js and Blob to handle the file saving for cross browser support. Use saveAs() function and create a new Blob object from octet array. Set the content type as octet-stream. follow by excel file naming that you would like.

$("#button-a").click(function(){
       saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');
});
    */
    }
}

class Hoja {
    constructor(wb,nbHoja) {
        this.libro = wb;
        this.nb = _nbHoja(this.libro,nbHoja);
        creaHoja(this.libro,this.nb);
    }
    
    set libro (wb) {
        this._libro = typeof wb === "string" ? new Libro(wb) : wb
    }
    
    get libro () {
        return this._libro;
    }
    
    get nombre() {
        return this._nb;
    }
    
    valor(col,fila) {
        let _celda = this.datos[dirCelda(col,fila)];
        return _celda ? _celda.v : null;
    }
    
    celda(col,fila,valor) {
        return new Celda(this, col, fila, valor);
    }
        
    fila(fila) {
        return Fila(this.datos,fila)
    }
    
    primeraFila() {
        let _primeraCelda = Array.Object.keys(this.datos)[0];
        return this.fila(filaDe(_primeraCelda));
    }
    
    get celdas() {
        return this.libro.wb.Sheets[this.nb]
    }
    
    set celdas(valores) {
        this.libro.wb.Sheets[this.nb] = valores;
	    var ws = XLSX.utils.aoa_to_sheet(ws_data);
	    this.libro.wb.Sheets["Test Sheet"] = ws;
    }

    recorre(fn) {
        return recorreHoja(this,fn);
    }
    
    limpia() {
        this.celdas = {}
    }
    
    graba(titulos) {
        return _graba(this.datos,titulos)
    }
}

class Celda {
/*
Cell Object
Key	Description
v	raw value (see Data Types section for more info)
w	formatted text (if applicable)
t	cell type: b Boolean, n Number, e error, s String, d Date
f	cell formula (if applicable)
r	rich text encoding (if applicable)
h	HTML rendering of the rich text (if applicable)
c	comments associated with the cell **
z	number format string associated with the cell (if requested)
l	cell hyperlink object (.Target holds link, .tooltip is tooltip)
s	the style/theme of the cell (if applicable)
*/
    constructor(hoja,col,fila,valor) {
        this._hoja = hoja;
        this.setCoo(col,fila);
        this._obj = _celda(hoja,col,fila);
        if(valor !== undefined) this.valor = valor;
    }
    
    get fila() {
        return this._fila;
    }
    
    get col() {
        return this._col;
    }
    
    get valor() {
        return this._obj.v;
    }
    
    set valor(dato) {
        this._obj.v = dato;
        this._obj.w = undefined;
    }
    
    get texto() {
        return this._obj.w;
    }
    
    get formula() {
        return this._obj.f || "";
    }
    
    get dir() {
        return dirCelda(this.col,this.fila);
    }
    
    get mst() {
        return this.dir +": " + (this.nxst ? "N/A" : this.valor);
    }
    
    get proxima() {
        return new Celda(this._hoja,proxCol(this._col),this._fila)
    }
    
    get Coo() {
        return this.fila+this.col
    }
    
    setCoo(col,fila) {
        if(fila === undefined) {
            this._col = colDe(col);
            this._fila = filaDe(col);
        } else {
            this._col = letraCol(col);
            this._fila = fila;
        }
    }
}

function Extension(nbArchivo,porOmision=""){
    var retorno = porOmision;
    var pos = nbArchivo.lastIndexOf(".");

    if (pos >= 0) { retorno = nbArchivo.slice(pos +1) }
    return retorno;
}

function letraCol(col) {
    if (isNaN(col)) return col;
    let _col = Number(col);
    if(_col > 25) return letraCol((_col/26)-1) +letraCol((_col%26));
    else return String.fromCharCode(65 +_col);
}

function nroCol(col) {
    let retorno = col;
    if(isNaN(col)){
      retorno = 0;
      Array.from(col).reverse().forEach((x,i) => {
        retorno += (x.charCodeAt(0) -(i ? 64 : 65))*26**i
      });
    } 
    return retorno;
}

function proxCol(col) {
    return nroCol(col) +1;
}

function abreXL(nbArch,dir="") {
    let _ext = Extension(nbArch);
    return XL.readFile(dir +nbArch +(_ext ? "" : ".xls"));
}

function creaXL(nbArch) {
    var wb = XLSX.utils.book_new();
	wb.Props = {
                Title: "SheetJS Tutorial",
                Subject: "Test",
                Author: "Red Stapler",
                CreatedDate: new Date()
        };
    wb.SheetNames.push("Hoja1");
    return wb;
}

function dirCelda(col,fila) {
    if(fila === undefined) return col;
    return letraCol(col)+fila;
}

function _nbHoja(libro,nbHoja) {
    return isNaN(nbHoja) ? nbHoja : (libro.wb.SheetNames[nbHoja] || "Hoja"+(parseInt(nbHoja)+1))
}

function creaHoja(libro,nb) {
    let _nb  = _nbHoja(libro,nb);
    
    if(!libro.wb.Sheets[_nb]) {
        libro.wb.Sheets[_nb] = {}
        libro.wb.SheetNames.push(_nb)
    }
    
    return libro.wb.Sheets[_nb]
}

function _celda(hoja, col,fila) {
    let _coo = dirCelda(col,fila);

    if(!hoja.celdas[_coo]) hoja.celdas[_coo] = {};

    return hoja.celdas[_coo];
}

function primeraCelda(datos,fila) {
    let retorno;
    let i = 0;
    let _fila;
    let codigos = Object.keys(datos);
    while ((_fila = filaDe(codigos[i])) < fila) {
        i++;
    }
    if(_fila === fila) retorno = new Celda(datos,codigos[i])
    return retorno;
}

function filaDe(codigo) {
    let retorno = "";
    let _pos = codigo.length;
    while(!isNaN(codigo[--_pos])) {
        retorno = codigo[_pos]+retorno;
    }
    return Number(retorno);
}

function colDe(codigo) {
    let retorno = "";
    let _pos = 0;
    while(isNaN(codigo[_pos])) {
        retorno += codigo[_pos];
        _pos++;
    }
    return retorno;    
}

function Fila(datos,fila) {
    let retorno = [];
    let i = 0;
    let _fila;
    let codigos = Object.keys(datos);
    while ((_fila = filaDe(codigos[i])) < fila) {
i++;
    }
    while ((_fila === filaDe(codigos[i]))) {
        retorno.push(new Celda(datos,codigos[i]));
        i++;
    }
    return retorno;
}

function _graba(datos,filaTit) {
    let retorno = [];
    let titulos = {};
    let i = 0;
    let _fila;
    let codigos = Object.keys(datos);
    while ((_fila = filaDe(codigos[i])) < filaTit) i++;
    while ((_fila = filaDe(codigos[i])) === filaTit) {
        
        titulos[colDe(codigos[i])] = datos[codigos[i]].v;
        i++;
    }
    
    console.log("Titulos")
    console.log(titulos)
    
    let objFila = {};
    let _col = "";
    while(codigos[i]) {
        if(codigos[i].slice(0,1) !== "!") {
            let _sig = colDe(codigos[i]);
            if(_sig < _col) {
                retorno.push(objFila);
                objFila = {};
            }

            _col = _sig;
            objFila[titulos[_col]] = datos[codigos[i]].v;
        }
        
        i++;
    }
    retorno.push(objFila);

    console.log(retorno.length +" registros")
    return retorno;
}

function* proxHoja() {
    for(this.xHoja = 0; this.xHoja < this.wb.SheetNames.length;++this.xHoja) yield new Hoja(this,this.xHoja);
}

function recorreLibro(libro,fn) {
    libro.wb.SheetNames.forEach((nbHoja,xHoja) => fn(new Hoja(libro,xHoja)))
}

function recorreHoja(hoja,fn = x => x) {
    let _filas = lib.sheet_to_row_object_array(hoja.celdas)
    return _filas.map(fn);
}

// .utils.encode_cell, etc.
//  sheet_to_row_object_array

/*
function Fila(datos,fila) {
    let retorno = [];
    let _celda = primeraCelda(datos,fila);
    console.log("Primera celda:")
    while(!_celda.nxst) {
        console.log(_celda.mst)
        retorno.push(_celda);
        console.log("Próxima celda:")
        _celda = _celda.proxima;
    }
    return retorno;    
}
*/

/*
Type 	Description
b 	Boolean: value interpreted as JS boolean
e 	Error: value is a numeric code and w property stores common name **
n 	Number: value is a JS number **
d 	Date: value is a JS Date object or string to be parsed as Date **
s 	Text: value interpreted as JS string and written as text **
z 	Stub: blank stub cell that is ignored by data processing utilities **
Value 	Error Meaning
0x00 	#NULL!
0x07 	#DIV/0!
0x0F 	#VALUE!
0x17 	#REF!
0x1D 	#NAME?
0x24 	#NUM!
0x2A 	#N/A
0x2B 	#GETTING_DATA
*/

/*
var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});


	function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
			if(roa.length) result[sheetName] = roa;
		});
		return JSON.stringify(result, 2, 2);
	};

	function to_csv(workbook) {
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
			if(csv.length){
				result.push("SHEET: " + sheetName);
				result.push("");
				result.push(csv);
			}
		});
		return result.join("\n");
	};
*/

/*
XLSX.utils.sheet_to_csv generates CSV
XLSX.utils.sheet_to_json generates an array of objects
XLSX.utils.sheet_to_formulae generates a list of formulae
*/

/*
format_cell generates the text value for a cell (using number formats)
{en,de}code_{row,col} convert between 0-indexed rows/cols and A1 forms.
{en,de}code_cell converts cell addresses
{en,de}code_range converts cell ranges
*/

/*
for(var R = range.s.r; R <= range.e.r; ++R) {
  for(var C = range.s.c; C <= range.e.c; ++C) {
    var cell_address = {c:C, r:R};
  }
}
*/

exports.Libro = Libro;
exports.Hoja = Hoja;
exports.guarda = guarda;
exports.lib = lib;

function guarda(htmlTabla,tit,type = 'xlsx') {
	   XL.writeFile(this.wb,this.wb.FILENAME);

    var wb = XLSX.utils.table_to_book(htmlTabla, {sheet:tit});
	return XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'});
}

function _libro() {
/*
var wb = XLSX.utils.book_new();

wb.Props = {
    Title: "SheetJS Tutorial",
    Subject: "Test",
    Author: "Red Stapler",
    CreatedDate: new Date(2017,12,19)
}

wb.SheetNames.push("Test Sheet");
*/
}

/*
var ws = XLSX.utils.aoa_to_sheet(arregloDeArreglos);

wb.Sheets["Test Sheet"] = ws;

var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

We now have our xlsx binary data on wbout var. However, the correct content type for excel file is octet stream so you’ll need to convert the binary data into octet. We can achieve that by using arrayBuffer, UInt8Array and bit operation like this.

function s2ab(s) { 
                var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
                var view = new Uint8Array(buf);  //create uint8array as viewer
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
                return buf;    
}

       saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');

*/
