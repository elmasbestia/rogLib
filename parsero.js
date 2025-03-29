/*
	Convierte un CSV en un objeto JS
*/

module.exports = function (nbArch) {

const csv = require('csv-parser');
const fs = require('fs');

const datos = []

return new Promise((si, no) => {
	fs.createReadStream(`${nbArch}.csv`)
	.pipe(csv())
	.on('data', (row) => {
		datos.push(row);
	})

	.on('error', no)

	.on('end', (resultado) => {
		console.log(resultado)
		console.log(`${nbArch}: ${datos.length} registros`);
		si(datos);
	})
});
}
