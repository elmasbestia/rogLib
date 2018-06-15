// Librería para manejar archivos json
// 1. Leer el archivo
// 2. Mostrar el archivo (???)

    function leeJson(nbArch) {
        $.getJSON(nbArch, function (data) {
            let arrItems = [];
            $.each(data, function (index, value) {
                arrItems.push(value);       // PUSH THE VALUES INSIDE THE ARRAY.
            });

            // EXTRACT VALUE FOR TABLE HEADER.
            let col = [];
            for (let i = 0; i < arrItems.length; i++) {
                for (let key in arrItems[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }

            // CREATE DYNAMIC TABLE.
            let table = document.createElement("table");

            // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

            let tr = table.insertRow(-1);                   // TABLE ROW.

            for (let i = 0; i < col.length; i++) {
                let th = document.createElement("th");      // TABLE HEADER.
                th.innerHTML = col[i];
                tr.appendChild(th);
            }

            // ADD JSON DATA TO THE TABLE AS ROWS.
            for (let i = 0; i < arrItems.length; i++) {

                tr = table.insertRow(-1);

                for (let j = 0; j < col.length; j++) {
                    let tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = arrItems[i][col[j]];
                }
            }

            // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
            let divContainer = document.getElementById("showData");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);
        });
    }


    function tablaJson(obj) {
        // EXTRACT VALUE FOR HTML HEADER.
        let col = [];
        for (let i = 0; i < myBooks.length; i++) {
            for (let key in myBooks[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        let table = document.createElement("table");

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        let tr = table.insertRow(-1);                   // TABLE ROW.

        for (let i = 0; i < col.length; i++) {
            let th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (let i = 0; i < myBooks.length; i++) {

            tr = table.insertRow(-1);

            for (let j = 0; j < col.length; j++) {
                let tabCell = tr.insertCell(-1);
                tabCell.innerHTML = myBooks[i][col[j]];
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        let divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
    }
