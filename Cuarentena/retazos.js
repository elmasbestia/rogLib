/**
  Retazos
  */

  
/**
 * Crea un objeto con sus valores por defecto según las especificaciones en Stru
 * @param {object} Stru ... Identificar
 * @returns {object}
 */
function regVacio(Stru) {
	let retorno = {};
	for(let x in Stru) {
		retorno[x] = valPorOmision(Stru[x]);
	}
	return retorno;
}
