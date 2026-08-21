"use strict";


function creaMapa(nbDom,fn) {

    const mapaVzla = [
        {ABREV: "DC", ESTADO: "Distrito Capital",	Coo: "193, 53, 197, 57, 212, 55, 230, 53, 229, 53" },
        {ABREV: "AM", ESTADO: "Amazonas",	Coo: "192, 193, 285, 257, 327, 317, 231, 373" },
        {ABREV: "AN", ESTADO: "Anzoátegui",	Coo: "248, 72, 257, 66, 288, 62, 304, 69, 345, 122, 276, 147, 256, 137, 279, 109" },
        {ABREV: "AP", ESTADO: "Apure",	Coo: "33, 154, 227, 145, 193, 193, 105, 168, 44, 167" },
        {ABREV: "AR", ESTADO: "Aragua",	Coo: "177, 56, 193, 53, 220, 72, 217, 95, 206, 89, 212, 82" },
        {ABREV: "BA", ESTADO: "Barinas",	Coo: "50, 150, 98, 102, 147, 131, 164, 116, 188, 137" },
        {ABREV: "BO", ESTADO: "Bolívar",	Coo: "190, 194, 283, 256, 342, 280, 414, 233, 390, 201, 422, 141, 349, 122" },
        {ABREV: "CA", ESTADO: "Carabobo",	Coo: "162, 153, 177, 56, 190, 72, 162, 71" },
        {ABREV: "CO", ESTADO: "Cojedes",	Coo: "147, 49, 143, 76, 161, 152, 176, 55" },
        {ABREV: "DE", ESTADO: "Delta Amacuro",	Coo: "359, 75, 368, 108, 386, 143, 424, 140, 441, 125" },
        {ABREV: "FA", ESTADO: "Falcón",	Coo: "110, 69, 39, 88, 62, 119, 46, 165, 51" },
        {ABREV: "GU", ESTADO: "Guárico",	Coo: "192, 71, 215, 94, 223, 72, 248, 72, 278, 111, 254, 138, 232, 145" },
        {ABREV: "LA", ESTADO: "Lara",	Coo: "83, 70, 137, 71, 142, 79, 108, 88" },
        {ABREV: "ME", ESTADO: "Mérida",	Coo: "50, 115, 79, 94, 92, 106, 62, 145" },
        {ABREV: "MI", ESTADO: "Miranda",	Coo: "201, 57, 205, 70, 254, 71, 257, 68, 229, 51" },
        {ABREV: "MO", ESTADO: "Monagas",	Coo: "304, 70, 307, 95, 348, 122, 369, 111" },
        {ABREV: "NU", ESTADO: "Nueva Esparta",	Coo: "311, 32, 312, 46, 288, 38" },
        {ABREV: "PO", ESTADO: "Portuguesa",	Coo: "147, 131, 157, 116, 142, 78, 108, 90, 105, 104" },
        {ABREV: "SU", ESTADO: "Sucre",	Coo: "293, 49, 373, 48, 347, 67, 321, 61, 297, 68, 285, 62" },
        {ABREV: "TA", ESTADO: "Táchira",	Coo: "49, 115, 65, 150, 32, 154, 31, 119" },
        {ABREV: "TR", ESTADO: "Trujillo",	Coo: "108, 79, 108, 100, 76, 83, 75, 91" },
        {ABREV: "YA", ESTADO: "Yaracuy",	Coo: "148, 48, 163, 53, 163, 71, 144, 77" },
        {ABREV: "VA", ESTADO: "Vargas",	Coo: "219, 45, 227, 45, 227, 42, 219, 42" },
        {ABREV: "ZU", ESTADO: "Zulia",	Coo: "33, 124, 79, 94, 69, 39, 66, 11, 97" }
    ];

    let dom = objDom(nbDom);
    
    let img = document.createElement("IMG");
    img.src = "../rogLib/Imagenes/mapaVzla.gif";
    img.useMap = "#mapaVzla";

    dom.appendChild(img);
    
    let mapa = document.createElement("MAP");
    mapa.name="mapaVzla";
    mapaVzla.map(x => {
        let area = document.createElement("AREA");
        area.shape = "poly";
        area.coords = x.Coo;
        area.alt=x.ESTADO;
        area.onclick = fn;
        area.id = x.ABREV;
        
        mapa.appendChild(area);
    });

    dom.appendChild(mapa);
    
    return mapaVzla;
}