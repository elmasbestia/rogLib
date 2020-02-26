
function filtra(query,datos) {
    let que, retorno;
    if(query) que = Object.keys(query)[0];
    if (que) {
        console.log("Busca", query)
        let valor = query[que];
        let filtro = x =>  x[que] == valor;
	      if(["nombre","descripcion"].includes(que.toLowerCase()) {
          console.log("Es el nombre ("+que+")")
          valor = valor.toLowerCase();
          filtro = x => x[que].toLowerCase().indexOf(valor) > -1;
        }
  console.log("Filtro: ")
  console.log(filtro)
        return datos.filter(filtro);
    } else retorno = datos;
  
    return retorno;
}
