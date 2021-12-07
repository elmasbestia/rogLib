/*
	 Librería de funciones
	 
	 functión que imprime el contenido de un elemento HTML
*/

export default function (dom) {
  var vnt = window.open("", "PRINT", "height=400,width=600");

  vnt.document.write("<html><head><title>" + document.title + "</title>");
  vnt.document.write("</head><body >");

  // C A B E C E R A
  vnt.document.write("<h1>" + document.title + "</h1>");

  // C O N T E N I D O
  vnt.document.write(objDom(dom).innerHTML);

  // P I E   D E   P Á G I N A

  vnt.document.write("</body></html>");

  vnt.document.close(); // necessary for IE >= 10
  vnt.focus(); // necessary for IE >= 10*/

  vnt.print();
  vnt.close();
}
