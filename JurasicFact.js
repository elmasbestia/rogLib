const fs = require('fs');

fs.readdir("./FAC*.xls", (err, facturas) => {
    if(err) {
        console.error(err);
    } else {
        console.log(`Hay ${facturas.length} facturas.`)
    }
})