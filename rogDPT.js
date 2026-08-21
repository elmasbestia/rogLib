"use strict";
// rogDPT
// Librería para manejar las Dependencias Político-Territoriales de Venezuela

var DPT = [{ EDO: "DISTRITO CAPITAL", ABREV: "DC", Municipios: [ { Municipio: "Libertador", Parroquias: [ "23 de Enero", "Altagracia", "Antimano", "Candelaria", "Caricuao", "Catedral", "Coche", "El Junquito", "EL Paraiso", "El Recreo", "El Valle", "La Pastora", "La Vega", "Macarao", "San Agustin", "San Bernardino", "San Jose", "San Juan", "San Pedro", "Santa Rosalia", "Santa Teresa", "Sucre"]}]}, { EDO: "AMAZONAS", Municipios: [ { Municipio: "Autónomo Alto Orinoco", Parroquias: [ "Huachamacare", "Marawaka", "Mavaca", "Sierra Parima"]}, { Municipio: "Atabapo", Autonomo: true, Parroquias: [ "Caname", "Ucata", "Yapacana"]}, { Municipio: "Atures", Autonomo: true, Parroquias: [ "Fernando Giron Tovar", "Luis Alberto Gomez", "Parhuena", "Platanillal"]}, { Municipio: "Autana", Autonomo: true, Parroquias: [ "Guayapo", "Munduapo", "Samariapo", "Sipapo"]}, { Municipio: "Manapiare", Autonomo: true, Parroquias: [ "Alto Ventuari", "Bajo Ventuari", "Medio Ventuari"]}, { Municipio: "Maroa", Autonomo: true, Parroquias: [ "Comunidad", "Victorino"]}, { Municipio: "Rio Negro", Autonomo: true, Parroquias: [ "Casiquiare", "Cocuy", "Solano"]}]}, { EDO: "ANZOÁTEGUI", Municipios: [ { Municipio: "Anaco", Parroquias: [ "Buena Vista", "Anaco", "San Joaquin"]}, { Municipio: "Aragua", Parroquias: [ "Cachipo", "Aragua"]}, { Municipio: "Diego Bautista Urbaneja", Parroquias: [ "Diego Bautista Urbaneja", "El Morro"]}, { Municipio: "Fernando de Penalver", Parroquias: [ "Fernando de Penalver", "San Miguel", "Sucre"]}, { Municipio: "Francisco de Miranda", Parroquias: [ "Atapirire", "Boca del Pao", "Francisco de Miranda", "El Pao", "Mucura"]}, { Municipio: "Francisco del Carmen Carvajal", Parroquias: [ "Francisco del Carmen Carvajal", "Santa Barbara"]}, { Municipio: "Guanta", Parroquias: [ "Guanta", "Chorreron"]}, { Municipio: "Independencia", Parroquias: [ "Independencia", "Mamo"]}, { Municipio: "Jose Gregorio Monagas", Parroquias: [ "Jose Gregorio Monagas", "Piar", "San Diego de Cabrutica", "Santa Clara", "Uverito", "Zuata"]}, { Municipio: "Juan Antonio Sotillo", Parroquias: [ "Puerto La Cruz", "Pozuelos"]}, { Municipio: "Juan Manuel", Parroquias: [ "Juan Manuel Cajigal", "San Pablo"]}, { Municipio: "Libertad", Parroquias: [ "Libertad", "El Carito", "Santa Ines"]}, { Municipio: "Manuel Ezequiel Bruzual", Parroquias: [ "Manuel Ezequiel Bruzual", "Guanape", "Sabana de Uchire"]}, { Municipio: "Pedro Maria Freites", Parroquias: [ "Pedro Maria Freites", "Libertador", "Santa Rosa", "Urica"]}, { Municipio: "Piritu", Parroquias: [ "Piritu", "San Francisco"]}, { Municipio: "San Jose de Guanipa", Parroquias: [ "SAN JOSE DE GUANIPA"]}, { Municipio: "San Juan de Capistrano", Parroquias: [ "Boca de Chavez", "San Juan de Capistrano "]}, { Municipio: "Santa Ana", Parroquias: [ "Santa Ana", "Pueblo Nuevo"]}, { Municipio: "Simon Bolivar", Parroquias: [ "Bergantin", "Caigua", "El Carmen", "El Pilar", "Naricual", "San Cristobal"]}, { Municipio: "Simon Rodriguez", Parroquias: [ "Edmundo Barrios", "Miguel Otero Silva"]}, { Municipio: "Sir Arthur Mc Gregor", Parroquias: [ "Sir Arthur Mc Gregor", "Tomas Alfaro Calatrava"]}]}, { EDO: "APURE", Municipios: [ { Municipio: "Achaguas", Parroquias: [ "Apurito", "El Yagual", "Guachara", "Mucuritas", "Queseras del Medio", "Achaguas"]}, { Municipio: "Biruaca", Parroquias: [ "Biruaca"]}, { Municipio: "Munoz", Parroquias: [ "Mantecal", "Quintero", "Rincon Hondo", "San Vicente", "Bruzual"]}, { Municipio: "Paez", Parroquias: [ "Aramendi", "El Amparo ", "San Camilo", "Guasdualito ", "Urdaneta"]}, { Municipio: "Pedro Camejo", Parroquias: [ "Codazzi", "Cunaviche", "San Juan de Payara"]}, { Municipio: "Romulo Gallegos", Parroquias: [ "La Trinidad", "Elorza"]}, { Municipio: "San Fernando", Parroquias: [ "El Recreo ", "Penalver", "San Rafael de Atamaica", "San Fernando"]}]}, { EDO: "ARAGUA", Municipios: [ { Municipio: "Bolivar", Parroquias: [ "BOLIVAR"]}, { Municipio: "Camatagua ", Parroquias: [ "Camatagua ", "Carmen de Cura"]}, { Municipio: "Francisco Linares Alcantara", Parroquias: [ "Francisco Linares Alcantara", "Francisco de Miranda", "Monsenor Feliciano Gonzalez"]}, { Municipio: "Girardot ", Parroquias: [ "Choroni", "Andres Eloy Blanco", "Joaquin Crespo", "Jose Casanova Godoy", "Las Delicias", "Los Tacariguas", "Madre Maria de San Jose", "Pedro Jose Ovalles"]}, { Municipio: "Jose angel Lamas", Parroquias: [ "JOSE ANGEL LAMAS"]}, { Municipio: "Jose Felix Ribas", Parroquias: [ "Las Guacamayas", "Pao de Zarate", "Zuata ", "Castor Nieves Rios", "Juan Vicente Bolivar y Ponte"]}, { Municipio: "Jose Rafael Revenga", Parroquias: [ "JOSE RAFAEL REVENGA"]}, { Municipio: "Libertador ", Parroquias: [ "Libertador ", "San Martin de Porres"]}, { Municipio: "Mario Briceno Iragorry", Parroquias: [ "Mario Briceno Iragorry", "Cana de Azucar"]}, { Municipio: "Ocumare de La Costa de Oro", Parroquias: [ "OCUMARE DE LA COSTA DE ORO"]}, { Municipio: "San Casimiro", Parroquias: [ "San Casimiro", "Guiripa", "Ollas de Caramacate ", "Valle Morin"]}, { Municipio: "San Sebastian", Parroquias: [ "SAN SEBASTIAN"]}, { Municipio: "Santiago Marino", Parroquias: [ "Alfredo Pacheco Miranda ", "Arevalo Aponte", "Chuao ", "Saman de Guere", "Santiago Marino"]}, { Municipio: "Santos Michelena", Parroquias: [ "Tiara ", "Santos Michelena"]}, { Municipio: "Sucre", Parroquias: [ "Bella Vista ", "Sucre"]}, { Municipio: "Tovar ", Parroquias: [ "TOVAR "]}, { Municipio: "Urdaneta", Parroquias: [ "Urdaneta", "Las Penitas", "San Francisco de Cara ", "Taguay"]}, { Municipio: "Zamora", Parroquias: [ "Augusto Mijares ", "Magdaleno ", "San Francisco de Asis", "Valles de Tucutunemo", "Zamora"]}]}, { EDO: "BARINAS", Municipios: [ { Municipio: "Alberto Arvelo Torrealba", Parroquias: [ "Rodriguez Dominguez", "Sabaneta"]}, { Municipio: "Andres Eloy Blanco", Parroquias: [ "El Canton", "Puerto Vivas", "Santa Cruz de Guacas"]}, { Municipio: "Antonio Jose de Sucre", Parroquias: [ "Andres Bello", "Nicolas Pulido", "Ticoporo"]}, { Municipio: "Arismendi ", Parroquias: [ "Arismendi ", "Guadarrama", "La Union", "San Antonio "]}, { Municipio: "Barinas ", Parroquias: [ "Alfredo Arvelo Larriva", "Alto Barinas", "Barinas ", "Corazon de Jesus", "Dominga Ortiz de Paez", "Don Romulo Betancourt", "El Carmen", "Juan Antonio Rodriguez Dominguez", "Manuel Palacio Fajardo", "Ramon Ignacio Mendez", "San Silvestre ", "Santa Ines", "Santa Lucia", "Torunos "]}, { Municipio: "Bolivar", Parroquias: [ "Altamira", "Barinitas ", "Calderas"]}, { Municipio: "Cruz Paredes", Parroquias: [ "Barrancas ", "El Socorro ", "Masparrito"]}, { Municipio: "Ezequiel Zamora", Parroquias: [ "Jose Ignacio del Pumar", "Pedro Briceno Mendez", "Ramon Ignacio Mendez", "Santa Barbara"]}, { Municipio: "Obispos ", Parroquias: [ "El Real ", "La Luz", "Los Guasimitos", "Obispos "]}, { Municipio: "Pedraza", Parroquias: [ "Ciudad Bolivia", "Ignacio Briceno", "Jose Felix Ribas", "Paez"]}, { Municipio: "Rojas", Parroquias: [ "Dolores ", "Libertad", "Palacios Fajardo", "Santa Rosa", "Simon Rodriguez"]}, { Municipio: "Sosa", Parroquias: [ "Ciudad de Nutrias ", "El Regalo ", "Puerto de Nutrias ", "Santa Catalina", "Simon Bolivar"]}]}, { EDO: "BOLÍVAR", Municipios: [ { Municipio: "Angostura ", Parroquias: [ "Barceloneta ", "Angostura", "San Francisco ", "Santa Barbara"]}, { Municipio: "Caroni", Parroquias: [ "Cachamay", "Chirica", "Cinco de Julio", "Dalla Costa", "Once de Abril", "Pozo Verde", "Simon Bolivar", "Unare", "Universidad", "Vista al Sol", "Yocoima"]}, { Municipio: "Cedeno", Parroquias: [ "Altagracia", "Ascension Farreras", "Cedeno", "Guaniamo", "La ", "Pijiguaos"]}, { Municipio: "El Callao ", Parroquias: [ "EL CALLAO "]}, { Municipio: "Gran Sabana", Parroquias: [ "Gran Sabana", "Ikabaru"]}, { Municipio: "Heres", Parroquias: [ "Agua Salada", "Catedral", "Jose Antonio Paez", "La Sabanita", "Marhuanta", "Orinoco", "Panapana ", "Vista Hermosa", "Zea "]}, { Municipio: "Padre Pedro Chien ", Parroquias: [ "PADRE PEDRO CHIEN "]}, { Municipio: "Piar ", Parroquias: [ "Andres Eloy Blanco", "Piar", "Pedro Cova "]}, { Municipio: "Roscio ", Parroquias: [ "Roscio", "Salom"]}, { Municipio: "Sifontes ", Parroquias: [ "Sifontes", "Dalla Costa ", "San Isidro "]}, { Municipio: "Sucre ", Parroquias: [ "Aripao", "Sucre", "Guarataro ", "Las Majadas ", "Moitaco "]}]}, { EDO: "CARABOBO", Municipios: [ { Municipio: "Bejuma", Parroquias: [ "Canoabo ", "Simon Bolivar", "Bejuma"]}, { Municipio: "Carlos Arvelo ", Parroquias: [ "Belen", "Tacarigua ", "Guigue"]}, { Municipio: "Diego Ibarra ", Parroquias: [ "Aguas Calientes ", "Mariara "]}, { Municipio: "Guacara ", Parroquias: [ "Yagua ", "Ciudad Alianza ", "Guacara "]}, { Municipio: "Juan Jose Mora", Parroquias: [ "Urama ", "Moron"]}, { Municipio: "Libertador ", Parroquias: [ "Independencia ", "Tocuyito"]}, { Municipio: "Los Guayos", Parroquias: [ "Los Guayos"]}, { Municipio: "Miranda ", Parroquias: [ "Miranda "]}, { Municipio: "Montalban", Parroquias: [ "Montalban"]}, { Municipio: "Naguanagua", Parroquias: [ "Naguanagua"]}, { Municipio: "Puerto Cabello", Parroquias: [ "Borburata ", "Patanemo", "Bartolome Salom", "Democracia ", "Fraternidad ", "Goaigoaza ", "Juan Jose Flores", "Union"]}, { Municipio: "San Diego ", Parroquias: [ "San Diego "]}, { Municipio: "San Joaquin", Parroquias: [ "San Joaquin"]}, { Municipio: "Valencia", Parroquias: [ "Negro Primero ", "Candelaria ", "Catedral ", "El Socorro ", "Miguel Pena", "Rafael Urdaneta ", "San Blas ", "San Jose", "Santa Rosa "]}]}, { EDO: "COJEDES", Municipios: [ { Municipio: "Anzoategui", Parroquias: [ "Cojedes ", "Juan de Mata Suarez"]}, { Municipio: "Ezequiel Zamora ", Parroquias: [ "Juan angel Bravo", "Manuel Manrique ", "San Carlos de Austria "]}, { Municipio: "Girardot ", Parroquias: [ "El Baul", "Sucre "]}, { Municipio: "Lima Blanco ", Parroquias: [ "La Aguadita ", "Macapo"]}, { Municipio: "Pao de San Juan Bautista ", Parroquias: [ "El Pao"]}, { Municipio: "Ricaurte ", Parroquias: [ "El Amparo ", "Libertad de Cojedes "]}, { Municipio: "Romulo Gallegos", Parroquias: [ "Romulo Gallegos"]}, { Municipio: "Tinaco", Parroquias: [ "General en Jefe Jose Laurencio Silva"]}, { Municipio: "Tinaquillo", Parroquias: [ "Tinaquillo"]}]}, { EDO: "DELTA AMACURO", Municipios: [ { Municipio: "Antonio Diaz", Parroquias: [ "Almirante Luis Brion", "Curiapo ", "Francisco Aniceto Lugo ", "Manuel Renaud ", "Padre Barral ", "Santos de Abelgas "]}, { Municipio: "Casacoima ", Parroquias: [ "Cinco de Julio ", "Imataca ", "Juan Bautista Arismendi ", "Manuel Piar ", "Romulo Gallegos"]}, { Municipio: "Pedernales", Parroquias: [ "Luis Beltran Prieto Figueroa", "Pedernales"]}, { Municipio: "Tucupita", Parroquias: [ "Jose Vidal Marcano", "Juan Millan", "Leonardo Ruiz Pineda", "Mariscal Antonio Jose de Sucre", "Monsenor Argimiro Garcia", "San Jose", "San Rafael", "Virgen del Valle "]}]}, { EDO: "FALCON", Municipios: [ { Municipio: "Acosta ", Parroquias: [ "Capadare", "La Pastora", "Libertador ", "San Juan de los Cayos "]}, { Municipio: "Bolivar", Parroquias: [ "Aracua", "La Pena", "San Luis"]}, { Municipio: "Buchivacoa ", Parroquias: [ "Bariro", "Borojo", "Capatarida", "Guajiro ", "Seque ", "Zazarida"]}, { Municipio: "Cacique Manaure ", Parroquias: [ "CACIQUE MANAURE "]}, { Municipio: "Carirubana ", Parroquias: [ "Carirubana ", "Norte ", "Punta Cardon", "Santa Ana "]}, { Municipio: "Colina ", Parroquias: [ "Acurigua", "Guaibacoa ", "La Vela de Coro ", "Las Calderas", "Macoruca "]}, { Municipio: "Dabajuro", Parroquias: [ "DABAJURO"]}, { Municipio: "Democracia ", Parroquias: [ "Agua Clara ", "Avaria ", "Pedregal", "Piedra Grande ", "Purureche "]}, { Municipio: "Falcon", Parroquias: [ "Adaure", "Adicora", "Baraived", "Buena Vista ", "El Hato ", "El Vinculo", "Jadacaquiva ", "Moruy ", "Pueblo Nuevo"]}, { Municipio: "Federacion", Parroquias: [ "Agua Larga", "Churuguara", "El Pauji", "Independencia El Tupi", "Maparari"]}, { Municipio: "Jacura", Parroquias: [ "Agua Linda", "Araurima", "Jacura"]}, { Municipio: "Los Taques ", Parroquias: [ "Judibana", "Los Taques "]}, { Municipio: "Mauroa ", Parroquias: [ "Casigua ", "Mene de Mauroa", "San Felix"]}, { Municipio: "Miranda ", Parroquias: [ "Guzman Guillermo", "Mitare", "Rio Seco", "Sabaneta", "San Antonio ", "San Gabriel ", "Santa Ana "]}, { Municipio: "Monsenor Iturriza", Parroquias: [ "Boca de Tocuyo", "Chichiriviche ", "Tocuyo de la Costa "]}, { Municipio: "Palmasola ", Parroquias: [ "PALMASOLA "]}, { Municipio: "Petit ", Parroquias: [ "Cabure", "Colina ", "Curimagua "]}, { Municipio: "Piritu", Parroquias: [ "Piritu", "San Jose de la Costa"]}, { Municipio: "San Francisco ", Parroquias: [ "SAN FRANCISCO "]}, { Municipio: "Silva ", Parroquias: [ "Boca de Aroa", "Tucacas "]}, { Municipio: "Sucre ", Parroquias: [ "Pecaya", "Sucre "]}, { Municipio: "Tocopero", Parroquias: [ "TOCOPERO"]}, { Municipio: "Union", Parroquias: [ "El Charal ", "Las Vegas del Tuy ", "Santa Cruz de Bucaral "]}, { Municipio: "Urumaco ", Parroquias: [ "Bruzual ", "Urumaco "]}, { Municipio: "Zamora ", Parroquias: [ "La Cienaga", "La Soledad", "Pueblo Cumarebo ", "Puerto Cumarebo ", "Zazarida"]}]}, { EDO: "GUÁRICO", Municipios: [ { Municipio: "Camaguan", Parroquias: [ "Camaguan", "Puerto Miranda", "Uverito "]}, { Municipio: "Chaguaramas ", Parroquias: [ "Chaguaramas "]}, { Municipio: "El Socorro", Parroquias: [ "El Socorro"]}, { Municipio: "Francisco de Miranda ", Parroquias: [ "Calabozo", "El Calvario ", "El Rastro ", "Guardatinajas "]}, { Municipio: "Jose Felix Ribas", Parroquias: [ "Tucupido", "San Rafael de Laya"]}, { Municipio: "Jose Tadeo Monagas", Parroquias: [ "Altagracia de Orituco ", "Lezama", "Libertad de Orituco ", "Paso Real de Macaira", "San Francisco de Macaira", "San Rafael de Orituco ", "Soublette "]}, { Municipio: "Juan German Roscio", Parroquias: [ "Cantagallo", "San Juan de Los Morros ", "Parapara"]}, { Municipio: "Julian Mellado", Parroquias: [ "El Sombrero", "Sosa"]}, { Municipio: "Las Mercedes", Parroquias: [ "Cabruta ", "Las Mercedes", "Santa Rita de Manapire "]}, { Municipio: "Leonardo Infante ", Parroquias: [ "Valle de La Pascua", "Espino"]}, { Municipio: "Ortiz ", Parroquias: [ "Ortiz ", "San Francisco de Tiznado", "San Jose de Tiznado", "San Lorenzo de Tiznado "]}, { Municipio: "Pedro Zaraza ", Parroquias: [ "Zaraza", "San Jose de Unare"]}, { Municipio: "San Geronimo de Guayabal", Parroquias: [ "San Geronimo de Guayabal", "Cazorla "]}, { Municipio: "San Jose de Guaribe", Parroquias: [ "San Jose de Guaribe"]}, { Municipio: "Santa Maria de Ipire", Parroquias: [ "Altamira", "Santa Maria de Ipire"]}]}, { EDO: "LARA", Municipios: [ { Municipio: "Andres Eloy Blanco", Parroquias: [ "Pio Tamayo", "Quebrada Honda de Guache ", "Yacambu"]}, { Municipio: "Crespo ", Parroquias: [ "Freitez", "Jose Maria Blanco"]}, { Municipio: "Iribarren ", Parroquias: [ "Aguedo Felipe Alvarado ", "Buena Vista ", "Catedral ", "Concepcion", "El Cuji", "Juan de Villegas ", "Juarez", "Santa Rosa ", "Tamaca ", "Union"]}, { Municipio: "Jimenez", Parroquias: [ "Coronel Mariano Peraza ", "Cuara ", "Diego de Lozada ", "Jose Bernardo Dorante", "Juan Bautista Rodriguez", "Paraiso de San Jose", "San Miguel", "Tintorero "]}, { Municipio: "Moran", Parroquias: [ "Anzoategui", "Bolivar", "Guarico ", "Hilario Luna y Luna ", "Humocaro Alto ", "Humocaro Bajo ", "La Candelaria ", "Moran"]}, { Municipio: "Palavecino ", Parroquias: [ "Agua Viva ", "Cabudare", "Jose Gregorio Bastidas"]}, { Municipio: "Simon Planas", Parroquias: [ "Buria", "Gustavo Vegas Leon", "Sarare"]}, { Municipio: "Torres ", Parroquias: [ "Altagracia", "Antonio Diaz", "Camacaro ", "Castaneda", "Cecilio Zubillaga ", "Chiquinquira", "El Blanco ", "Espinoza de los Monteros ", "Heriberto Arroyo ", "Lara ", "Las Mercedes ", "Manuel Morillo ", "Montana Verde", "Montes de Oca ", "Reyes Vargas ", "Torres ", "Trinidad Samuel "]}, { Municipio: "Urdaneta ", Parroquias: [ "Moroturo ", "San Miguel ", "Siquisique", "Xaguas "]}]}, { EDO: "MÉRIDA", ABREV: "ME", Municipios: [ { Municipio: "Alberto Adriani ", Parroquias: [ "Gabriel Picon Gonzalez", "Hector Amable Mora", "Jose Nucete Sardi", "Presidente Betancourt ", "Presidente Paez", "Presidente Romulo Gallegos", "Pulido Mendez"]}, { Municipio: "Andres Bello", Parroquias: [ "ANDRES BELLO"]}, { Municipio: "Antonio Pinto Salinas ", Parroquias: [ "Antonio Pinto Salinas ", "Mesa Bolivar", "Mesa de Las Palmas "]}, { Municipio: "Aricagua", Parroquias: [ "Aricagua", "San Antonio "]}, { Municipio: "Arzobispo Chacon", Parroquias: [ "Arzobispo Chacon", "Capuri", "Chacanta", "El Molino ", "Guaimaral ", "Mucuchachi", "Mucutuy "]}, { Municipio: "Campo Elias", Parroquias: [ "Acequias", "Fernandez Pena", "Jaji", "La Mesa ", "Matriz ", "Montalban", "San Jose del Sur"]}, { Municipio: "Caracciolo Parra Olmedo ", Parroquias: [ "Caracciolo Parra Olmedo ", "Florencio Ramirez"]}, { Municipio: "Cardenal Quintero ", Parroquias: [ "Cardenal Quintero ", "Las Piedras "]}, { Municipio: "Guaraque", Parroquias: [ "Guaraque", "Mesa de Quintero", "Rio Negro"]}, { Municipio: "Julio Cesar Salas", Parroquias: [ "Julio Cesar Salas", "Palmira "]}, { Municipio: "Justo Briceno", Parroquias: [ "Justo Briceno", "San Cristobal de Torondoy"]}, { Municipio: "Libertador ", Parroquias: [ "Antonio Spinetti Dini ", "Arias ", "Caracciolo Parra Perez", "Domingo Pena", "El Llano ", "El Morro", "Gonzalo Picon Febres", "Jacinto Plaza ", "Juan Rodriguez Suarez", "Lasso de la Vega ", "Los Nevados ", "Mariano Picon Salas", "Milla ", "Osuna Rodriguez", "Sagrario "]}, { Municipio: "Miranda ", Parroquias: [ "Andres Eloy Blanco", "Miranda ", "La Venta", "Pinango"]}, { Municipio: "Obispo Ramos de Lora ", Parroquias: [ "Obispo Ramos de Lora ", "Eloy Paredes ", "San Rafael de Alcazar"]}, { Municipio: "Padre Noguera ", Parroquias: [ "PADRE NOGUERA "]}, { Municipio: "Pueblo Llano", Parroquias: [ "PUEBLO LLANO"]}, { Municipio: "Rangel ", Parroquias: [ "Cacute", "Rangel ", "La Toma ", "Mucuruba", "San Rafael"]}, { Municipio: "Rivas Davila", Parroquias: [ "Rivas Davila", "Geronimo Maldonado"]}, { Municipio: "Santos Marquina ", Parroquias: [ "SANTOS MARQUINA "]}, { Municipio: "Sucre ", Parroquias: [ "Sucre ", "Chiguara", "Estanques", "La Trampa ", "Pueblo Nuevo del Sur", "San Juan"]}, { Municipio: "Tovar ", Parroquias: [ "El Amparo ", "El Llano ", "San Francisco ", "Tovar "]}, { Municipio: "Tulio Febres Cordero ", Parroquias: [ "Tulio Febres Cordero ", "Independencia ", "Maria de la Concepcion Palacios Blanco", "Santa Apolonia"]}, { Municipio: "Zea ", Parroquias: [ "Cano El Tigre", "Zea "]}]}, { EDO: "MIRANDA", Municipios: [ { Municipio: "Acevedo ", Parroquias: [ "Araguita", "Arevalo Gonzalez", "Capaya", "Caucagua", "El Cafe", "Marizapa", "Panaquire ", "Ribas "]}, { Municipio: "Andres Bello", Parroquias: [ "Cumbo ", "San Jose de Barlovento"]}, { Municipio: "Baruta ", Parroquias: [ "Baruta", "El Cafetal", "Las Minas de Baruta "]}, { Municipio: "Brion", Parroquias: [ "Curiepe ", "Higuerote ", "Tacarigua "]}, { Municipio: "Buroz ", Parroquias: [ "Mamporal"]}, { Municipio: "Carrizal", Parroquias: [ "Carrizal"]}, { Municipio: "Chacao", Parroquias: [ "Chacao"]}, { Municipio: "Cristobal Rojas", Parroquias: [ "Charallave", "Las Brisas"]}, { Municipio: "El Hatillo", Parroquias: [ "El Hatillo"]}, { Municipio: "Guaicaipuro ", Parroquias: [ "Altagracia de La Montana", "Cecilio Acosta ", "El Jarillo", "Los Teques", "Paracotos ", "San Pedro ", "Tacata"]}, { Municipio: "Independencia ", Parroquias: [ "El Cartanal ", "Santa Teresa del Tuy"]}, { Municipio: "Lander ", Parroquias: [ "La Democracia ", "Ocumare del Tuy ", "Santa Barbara"]}, { Municipio: "Los Salias ", Parroquias: [ "San Antonio de Los Altos"]}, { Municipio: "Paez", Parroquias: [ "El Guapo", "Paparo", "Rio Chico", "San Fernando del Guapo", "Tacarigua de La Laguna"]}, { Municipio: "Paz Castillo ", Parroquias: [ "Santa Lucia"]}, { Municipio: "Pedro Gual ", Parroquias: [ "Cupira", "Machurucuto "]}, { Municipio: "Plaza ", Parroquias: [ "Guarenas"]}, { Municipio: "Simon Bolivar", Parroquias: [ "San Antonio de Yare ", "San Francisco de Yare "]}, { Municipio: "Sucre ", Parroquias: [ "Caucaguita", "Fila de Mariche ", "La Dolorita ", "Leoncio Martinez", "Petare"]}, { Municipio: "Urdaneta ", Parroquias: [ "Cua", "Nueva Cua"]}, { Municipio: "Zamora ", Parroquias: [ "Bolivar", "Guatire "]}]}, { EDO: "MONAGAS", Municipios: [ { Municipio: "Acosta ", Parroquias: [ "Acosta ", "San Francisco "]}, { Municipio: "Aguasay ", Parroquias: [ "AGUASAY "]}, { Municipio: "Bolivar", Parroquias: [ "BOLIVAR"]}, { Municipio: "Caripe", Parroquias: [ "Caripe", "El Guacharo", "La Guanota", "Sabana de Piedra", "San Agustin", "Teresen"]}, { Municipio: "Cedeno", Parroquias: [ "Areo", "Cedeno", "San Felix", "Viento Fresco "]}, { Municipio: "Ezequiel Zamora ", Parroquias: [ "Ezequiel Zamora ", "El Tejero "]}, { Municipio: "Libertador ", Parroquias: [ "Libertador ", "Chaguaramas ", "Las Alhuacas", "Tabasca "]}, { Municipio: "Maturin", Parroquias: [ "Alto de los Godos ", "Boqueron", "Maturin", "El Corozo ", "El Furrial", "Jusepin", "La Pica ", "Las Cocuizas ", "San Simon", "San Vicente ", "Santa Cruz "]}, { Municipio: "Piar Aragua", Parroquias: [ "Aparicio", "Piar ", "Chaguaramal ", "El Pinto", "Guanaguana", "La Toscana", "Taguaya "]}, { Municipio: "Punceres ", Parroquias: [ "Cachipo ", "Punceres "]}, { Municipio: "Santa Barbara", Parroquias: [ "SANTA BARBARA"]}, { Municipio: "Sotillo ", Parroquias: [ "Sotillo ", "Los Barrancos de Fajardo"]}, { Municipio: "Uracoa", Parroquias: [ "URACOA"]}]}, { EDO: "NUEVA ESPARTA", Municipios: [ { Municipio: "Antolin del Campo", Parroquias: [ "ANTOLIN DEL CAMPO"]}, { Municipio: "Arismendi ", Parroquias: [ "ARISMENDI "]}, { Municipio: "Diaz", Parroquias: [ "Diaz", "Zabala "]}, { Municipio: "Garcia", Parroquias: [ "Garcia", "Francisco Fajardo "]}, { Municipio: "Gomez", Parroquias: [ "Bolivar", "Gomez", "Guevara ", "Matasiete ", "Sucre "]}, { Municipio: "Maneiro ", Parroquias: [ "Aguirre ", "Maneiro "]}, { Municipio: "Marcano ", Parroquias: [ "Adrian", "Marcano "]}, { Municipio: "Marino", Parroquias: [ "MARINO"]}, { Municipio: "Peninsula de Macanao", Parroquias: [ "Peninsula de Macanao", "San Francisco "]}, { Municipio: "Tubores ", Parroquias: [ "Tubores ", "Los Barales "]}, { Municipio: "Villalba ", Parroquias: [ "Villalba ", "Vicente Fuentes "]}]}, { EDO: "PORTUGUESA", Municipios: [ { Municipio: "Agua Blanca ", Parroquias: [ "AGUA BLANCA "]}, { Municipio: "Araure", Parroquias: [ "Araure", "Rio Acarigua"]}, { Municipio: "Esteller Piritu", Parroquias: [ "Esteller Piritu", "Uveral"]}, { Municipio: "Guanare ", Parroquias: [ "Guanare ", "Cordoba", "San Jose de la Montana", "San Juan de Guanaguanare ", "Virgen de la Coromoto "]}, { Municipio: "Guanarito ", Parroquias: [ "Guanarito ", "Divina Pastora ", "Trinidad de la Capilla"]}, { Municipio: "Monsenor Jose Vicente de Unda", Parroquias: [ "Monsenor Jose Vicente de Unda", "Pena Blanca"]}, { Municipio: "Ospino", Parroquias: [ "Aparicion", "Ospino", "La Estacion"]}, { Municipio: "Paez", Parroquias: [ "Paez", "Payara", "Pimpinela ", "Ramon Peraza"]}, { Municipio: "Papelon", Parroquias: [ "Cano Delgadito", "Papelon"]}, { Municipio: "San Genaro de Boconoito ", Parroquias: [ "Antolin Tovar", "San Genaro de Boconoito "]}, { Municipio: "San Rafael de Onoto ", Parroquias: [ "San Rafael de Onoto ", "Santa Fe", "Thermo Morles "]}, { Municipio: "Santa Rosalia", Parroquias: [ "Santa Rosalia", "Flthis.orida "]}, { Municipio: "Sucre ", Parroquias: [ "Sucre ", "Concepcion", "San Jose de Saguaz", "San Rafael de Palo Alzado ", "Uvencio Antonio Velasquez", "Villa Rosa"]}, { Municipio: "Turen", Parroquias: [ "Canelones ", "Turen", "San Isidro Labrador ", "Santa Cruz"]}]}, { EDO: "SUCRE", Municipios: [ { Municipio: "Andres Eloy Blanco", Parroquias: [ "Marino", "Romulo Gallegos"]}, { Municipio: "Andres Mata", Parroquias: [ "San Jose de Aerocuar", "Tavera Acosta "]}, { Municipio: "Arismendi ", Parroquias: [ "Antonio Jose de Sucre", "El Morro de Puerto Santo", "Puerto Santo", "Rio Caribe", "San Juan de Las Galdonas"]}, { Municipio: "Benitez", Parroquias: [ "El Pilar", "El Rincon", "General Francisco Antonio Vasquez", "Guaraunos", "Tunapuicito ", "Union"]}, { Municipio: "Bermudez", Parroquias: [ "Bolivar", "Macarapana ", "Santa Catalina ", "Santa Rosa ", "Santa Teresa "]}, { Municipio: "Bolivar", Parroquias: [ "BOLIVAR"]}, { Municipio: "Cajigal ", Parroquias: [ "El Paujil ", "Libertad ", "Yaguaraparo "]}, { Municipio: "Cruz Salmeron Acosta", Parroquias: [ "Araya ", "Chacopata ", "Manicuare "]}, { Municipio: "Libertador ", Parroquias: [ "Campo Elias", "Tunapuy "]}, { Municipio: "Marino", Parroquias: [ "Campo Claro ", "Irapa ", "Marabal ", "San Antonio de Irapa", "Soro"]}, { Municipio: "Mejia", Parroquias: [ "MEJIA"]}, { Municipio: "Montes ", Parroquias: [ "Arenas", "Aricagua", "Cocollar ", "Cumanacoa ", "San Fernando ", "San Lorenzo "]}, { Municipio: "Ribero ", Parroquias: [ "Cariaco ", "Catuaro ", "Rendon", "Santa Cruz", "Santa Maria"]}, { Municipio: "Sucre ", Parroquias: [ "Altagracia ", "Ayacucho ", "Gran Mariscal ", "Raul Leoni", "San Juan", "Santa Ines", "Valentin Valiente"]}, { Municipio: "Valdez ", Parroquias: [ "Bideau ", "Cristobal Colon", "Guiria", "Punta de Piedras "]}]}, { EDO: "TÁCHIRA", ABREV: "TA", Municipios: [ { Municipio: "Andres Bello", Parroquias: [ "ANDRES BELLO"]}, { Municipio: "Antonio Romulo Costa", Parroquias: [ "Antonio Romulo Costa"]}, { Municipio: "Ayacucho ", Parroquias: [ "Ayacucho ", "Rivas Berti ", "San Pedro del Rio"]}, { Municipio: "Bolivar", Parroquias: [ "Bolivar", "Isaias Medina Angarita", "Juan Vicente Gomez", "Palotal "]}, { Municipio: "Cardenas", Parroquias: [ "Amenodoro Rangel Lamus", "Cardenas", "La Florida"]}, { Municipio: "Cordoba", Parroquias: [ "CORDOBA"]}, { Municipio: "Fernandez Feo", Parroquias: [ "Alberto Adriani ", "Fernandez Feo", "Santo Domingo "]}, { Municipio: "Francisco de Miranda ", Parroquias: [ "FRANCISCO DE MIRANDA "]}, { Municipio: "Garcia de Hevia", Parroquias: [ "Boca de Grita ", "Garcia de Hevia", "Jose Antonio Paez"]}, { Municipio: "Guasimos", Parroquias: [ "GUASIMOS"]}, { Municipio: "Independencia ", Parroquias: [ "Independencia ", "Juan German Roscio", "Roman Cardenas"]}, { Municipio: "Jauregui", Parroquias: [ "Emilio Constantino Guerrero ", "Jauregui", "Monsenor Miguel Antonio Salas"]}, { Municipio: "Jose Maria Vargas", Parroquias: [ "JOSE MARIA VARGAS"]}, { Municipio: "Junin", Parroquias: [ "Bramon", "Junin", "La Petrolea", "Quinimari"]}, { Municipio: "Libertad ", Parroquias: [ "Cipriano Castro ", "Libertad ", "Manuel Felipe Rugeles "]}, { Municipio: "Libertador ", Parroquias: [ "Don Emeterio Ochoa ", "Doradas ", "Libertador ", "San Joaquin de Navay"]}, { Municipio: "Lobatera", Parroquias: [ "Constitucion", "Lobatera"]}, { Municipio: "Michelena ", Parroquias: [ "MICHELENA "]}, { Municipio: "Panamericano ", Parroquias: [ "La Palmita", "Panamericano "]}, { Municipio: "Pedro Maria Urena", Parroquias: [ "Nueva Arcadia ", "Pedro Maria Urena"]}, { Municipio: "Rafael Urdaneta ", Parroquias: [ "RAFAEL URDANETA "]}, { Municipio: "Samuel Dario Maldonado", Parroquias: [ "Bocono", "Hernandez", "Samuel Dario Maldonado"]}, { Municipio: "San Cristobal", Parroquias: [ "Dr. Francisco Romero Lobo ", "La Concordia ", "Pedro Maria Morantes", "San Juan Bautista ", "San Sebastian"]}, { Municipio: "San Judas Tadeo ", Parroquias: [ "SAN JUDAS TADEO "]}, { Municipio: "Seboruco", Parroquias: [ "SEBORUCO"]}, { Municipio: "Simon Rodriguez", Parroquias: [ "SIMON RODRIGUEZ"]}, { Municipio: "Sucre ", Parroquias: [ "Eleazar Lopez Contreras", "San Pablo ", "Sucre "]}, { Municipio: "Torbes ", Parroquias: [ "TORBES "]}, { Municipio: "Uribante ", Parroquias: [ "Cardenas", "Juan Pablo Penaloza", "Potosi", "Uribante "]}]}, { EDO: "TRUJILLO", Municipios: [ { Municipio: "Andres Bello", Parroquias: [ "Araguaney ", "El Jaguito", "La Esperanza ", "Santa Isabel"]}, { Municipio: "Bocono", Parroquias: [ "Ayacucho ", "Bocono", "Burbusay", "El Carmen ", "General Rivas ", "Guaramacal", "Monsenor Jauregui", "Mosquey ", "Rafael Rangel ", "San Jose", "San Miguel", "Vega de Guaramacal"]}, { Municipio: "Bolivar", Parroquias: [ "Cheregue", "Granados", "Sabana Grande "]}, { Municipio: "Candelaria ", Parroquias: [ "Arnoldo Gabaldon", "Bolivia ", "Carrillo ", "Cegarra ", "Chejende", "Manuel Salvador Ulloa ", "San Jose"]}, { Municipio: "Carache ", Parroquias: [ "Carache ", "Cuicas", "La Concepcion", "Panamericana ", "Santa Cruz "]}, { Municipio: "Escuque ", Parroquias: [ "Escuque ", "La Union", "Sabana Libre", "Santa Rita "]}, { Municipio: "Jose Felipe Marquez Canizales", Parroquias: [ "Antonio Jose de Sucre", "El Socorro ", "Los Caprichos "]}, { Municipio: "Juan Vicente Campo Elias", Parroquias: [ "Arnoldo Gabaldon", "Campo Elias"]}, { Municipio: "La Ceiba ", Parroquias: [ "El Progreso ", "La Ceiba", "Santa Apolonia", "Tres de Febrero "]}, { Municipio: "Miranda ", Parroquias: [ "Agua Caliente ", "Agua Santa", "El Cenizo ", "El Dividive ", "Valerita"]}, { Municipio: "Monte Carmelo ", Parroquias: [ "Buena Vista ", "Monte Carmelo ", "Santa Maria del Horcon"]}, { Municipio: "Motatan", Parroquias: [ "El Bano", "Jalisco ", "Motatan"]}, { Municipio: "Pampan", Parroquias: [ "Flor de Patria", "La Paz Monay", "Pampan", "Santa Ana "]}, { Municipio: "Pampanito ", Parroquias: [ "La Concepcion", "Pampanito ", "Pampanito II"]}, { Municipio: "Rafael Rangel ", Parroquias: [ "Betijoque ", "Jose Gregorio Hernandez", "La Pueblita ", "Los Cedros"]}, { Municipio: "San Rafael de Carvajal ", Parroquias: [ "Antonio Nicolas Briceno", "Campo Alegre", "Carvajal", "Jose Leonardo Suarez"]}, { Municipio: "Sucre ", Parroquias: [ "El Paraiso", "Junin", "Sabana de Mendoza ", "Valmore Rodriguez"]}, { Municipio: "Trujillo", Parroquias: [ "Andres Linares", "Chiquinquira", "Cristobal Mendoza", "Cruz Carrillo ", "Matriz", "Monsenor Carrillo", "Tres Esquinas "]}, { Municipio: "Urdaneta ", Parroquias: [ "Cabimbu", "Jajo", "La Mesa ", "La Quebrada ", "Santiago", "Tuname"]}, { Municipio: "Valera", Parroquias: [ "Juan Ignacio Montilla ", "La Beatriz", "La Puerta ", "Mendoza ", "Mercedes Diaz", "San Luis"]}]}, { EDO: "VARGAS", Municipios: [ { Municipio: "Vargas ", Parroquias: [ "Caraballeda ", "Carayaca", "Carlos Soublette ", "Caruao ", "Catia La Mar", "El Junko", "La Guaira ", "Macuto", "Maiquetia", "Naiguata", "Urimare "]}]}, { EDO: "YARACUY", Municipios: [ { Municipio: "Aristides Bastidas", Parroquias: [ "ARISTIDES BASTIDAS"]}, { Municipio: "Bolivar", Parroquias: [ "BOLIVAR"]}, { Municipio: "Bruzual ", Parroquias: [ "Campo Elias", "Bruzual "]}, { Municipio: "Cocorote", Parroquias: [ "COCOROTE"]}, { Municipio: "Independencia ", Parroquias: [ "INDEPENDENCIA "]}, { Municipio: "Jose Antonio Paez", Parroquias: [ "JOSE ANTONIO PAEZ"]}, { Municipio: "La Trinidad ", Parroquias: [ "LA TRINIDAD "]}, { Municipio: "Manuel Monge ", Parroquias: [ "MANUEL MONGE "]}, { Municipio: "Nirgua", Parroquias: [ "Nirgua", "Salom ", "Temerla "]}, { Municipio: "Pena", Parroquias: [ "Pena", "San Andres"]}, { Municipio: "San Felipe", Parroquias: [ "Albarico", "San Felipe", "San Javier "]}, { Municipio: "Sucre ", Parroquias: [ "SUCRE "]}, { Municipio: "Urachiche ", Parroquias: [ "URACHICHE "]}, { Municipio: "Veroes ", Parroquias: [ "Veroes ", "El Guayabo "]}]}, { EDO: "ZULIA", Municipios: [ { Municipio: "Almirante Padilla ", Parroquias: [ "Isla de Toas ", "Monagas "]}, { Municipio: "Baralt ", Parroquias: [ "General Urdaneta ", "Libertador ", "Manuel Guanipa Matos ", "Marcelino Briceno", "Pueblo Nuevo", "San Timoteo "]}, { Municipio: "Cabimas ", Parroquias: [ "Ambrosio ", "Aristides Calvani", "Carmen Herrera ", "German Rios Linares", "Jorge Hernandez", "La Rosa ", "Punta Gorda ", "Romulo Betancourt", "San Benito "]}, { Municipio: "Catatumbo ", Parroquias: [ "Encontrados ", "Udon Perez"]}, { Municipio: "Colon", Parroquias: [ "Moralito ", "San Carlos del Zulia", "Santa Barbara", "Santa Cruz del Zulia", "Urribarri "]}, { Municipio: "Francisco Javier Pulgar ", Parroquias: [ "Agustin Codazzi", "Carlos Quevedo ", "Francisco Javier Pulgar ", "Simon Rodriguez"]}, { Municipio: "Indigena Guajira", Parroquias: [ "Alta Guajira ", "Elias Sanchez Rubio", "Guajira ", "Sinamaica "]}, { Municipio: "Jesus Enrique Lossada", Parroquias: [ "Jose Ramon Yepes", "La Concepcion", "Mariano Parra Leon", "San Jose"]}, { Municipio: "Jesus Maria Semprun", Parroquias: [ "Bari", "Jesus Maria Semprun"]}, { Municipio: "La Canada de Urdaneta", Parroquias: [ "Andres Bello", "Chiquinquira", "Concepcion", "El Carmelo", "Potreritos"]}, { Municipio: "Lagunillas ", Parroquias: [ "Alonso de Ojeda ", "Campo Lara", "El Danto ", "Eleazar Lopez Contreras", "Libertad ", "Venezuela "]}, { Municipio: "Machiques de Perija", Parroquias: [ "Bartolome de las Casas", "Libertad ", "Rio Negro", "San Jose de Perija"]}, { Municipio: "Mara ", Parroquias: [ "La Sierrita ", "Las Parcelas", "Luis de Vicente ", "Monsenor Marcos Sergio Godoy", "Ricaurte ", "San Rafael ", "Tamare"]}, { Municipio: "Maracaibo ", Parroquias: [ "Antonio Borjas Romero ", "Bolivar", "Cacique Mara ", "Caracciolo Parra Perez", "Cecilio Acosta ", "Chiquinquira", "Coquivacoa ", "Cristo de Aranza ", "Francisco Eugenio Bustamante ", "Idelfonso Vasquez", "Juana de avila", "Luis Hurtado Higuera ", "Manuel Dagnino ", "Olegario Villalobos ", "Raul Leoni", "San Isidro", "Santa Lucia", "Venancio Pulgar "]}, { Municipio: "Miranda ", Parroquias: [ "Altagracia ", "Ana Maria Campos", "Faria", "Jose Antonio Chaves", "San Antonio ", "San Jose"]}, { Municipio: "Rosario de Perija", Parroquias: [ "Donaldo Garcia", "El Rosario ", "Sixto Zambrano "]}, { Municipio: "San Francisco ", Parroquias: [ "Domitila Flores ", "El Bajo ", "Francisco Ochoa ", "Jose Domingo Rus", "Los Cortijos", "Marcial Hernandez", "San Francisco "]}, { Municipio: "Santa Rita", Parroquias: [ "El Mene ", "Jose Cenovio Urribarri", "Pedro Lucas Urribarri ", "Santa Rita"]}, { Municipio: "Simon Bolivar", Parroquias: [ "Manuel Manrique ", "Rafael Maria Baralt", "Rafael Urdaneta "]}, { Municipio: "Sucre ", Parroquias: [ "Bobures ", "El Batey", "Gibraltar ", "Heras ", "Monsenor Arturo Celestino alvarez", "Romulo Gallegos"]}, { Municipio: "Valmore Rodriguez", Parroquias: [ "La Victoria ", "Rafael Urdaneta ", "Raul Cuenca"]}]}];

function rogDPT(onchange) {
    // @param onchange          función que se ejecuta cada vez que el objeto cambia de valor
    // El valor del Objeto es el código que identifica los tres niveles:
    // Estado, Municipio y Parroquia
    // Se puede visualizar como Lista jerárquica y/o como combos, para lo cual se utilizan los métodos:
    // setListas y setCombos

    const nivelEdo = 0, nivelMun = 1, nivelPq = 2, nNiveles = 3;
    var Fijos = [], indices = [];
    var dptSelf;

    this.bsqDPT = function (nbEdo, nbMun, nbPq) {
        function lstEdos(nbEdo) {
          if(nbEdo) {
            return DPT.filter(x => x.EDO === nbEdo)
          } else return DPT.map(x => x.EDO)
        }
        
        return lstEdos(nbEdo);
    }
    
    function nbDPT(nivel, xEdo = dptSelf.xEdo(), xMun = dptSelf.xMun(), xPq = dptSelf.xPq()) {
        if(nivel === nivelPq) return dptSelf.Parroquia(xEdo,xMun,xPq);
        else    if(nivel === nivelMun) return dptSelf.Municipio(xEdo,xMun);
                else return Estado(false,xEdo);
    }
    function asigna (valor,nivel) {
        indices [nivel] = valor;
        let x = nivel +1;
        for (; x < nNiveles; ++x) {indices [x] = 0}
        dptSelf.refleja(nivel);
    }
    function muestra(que, muestra = true) {
        if(nivelDe(que) < nivelPq) {
            que.children[0].style.display = muestra ? "block" : "none";
        }
    }
    function claseLiSel(nivel) {
        return "rogLiSel" + ["Edo","Mun","Pq"][nivel];
    }
    function Clases(nivel) {
        let txtNivel = ["Edo","Mun","Pq"][nivel]
        
        this.opc = "rogOpc"   +txtNivel;
        this.li  = "rogLi"    +txtNivel;
        this.lst = "rogLst"   +txtNivel;
        this.sel = "rogLiSel" +txtNivel;
    }
    function dependencia(nivel, nombre,...indices) {
        this.nivel = nivel;
        this.indices = indices;
        this.codigo = codigo;
        this.nombre = nombre ? nombre : nbDPT(nivel, ...indices);
        this.ficha = ficha;
    }
    
    function Fuente(nivel = this.nivel) {
        if(nivel === nivelEdo) return dptSelf.Estados;
        else if(nivel === nivelMun) return dptSelf.Municipios;
             else return dptSelf.Parroquias;
    }
    
    function nivelDe(elemento) {
        let clase = elemento.className;
        if (clase.includes("Edo")) return nivelEdo;
        else if (clase.includes("Mun")) return nivelMun;
        else if (clase.includes("Pq")) return nivelPq;
        return -1;
    }
    
    function fmt2(num = 0) {return num > 9 ? String(num) : "0" + num}
    function setIndices() {
        if(arguments.length) {
            let x = 0;
            for (; x < arguments.length; ++x) {
                if (arguments[x] instanceof Array) {
                    arguments[x].forEach(asigna);
                } else {
                    asigna (arguments[x], x);
                }
            }
        }
    }
    function codigo(valor) {
        let x = 0, retorno = "";
        if (valor) {
            let valores = [];
            let x = 0;
            
            if(typeof valor === "string") {
                for (;x <= nivelPq; ++x) {
                    let debut = x*2;
                    let n = parseInt(valor.slice(debut,debut+2))
                    valores.push(isNaN(n) ? 0 : n);
                }
            } else {
                if(valor instanceof Array) {
                    for (;x <= nivelPq; ++x) {
                        valores.push(valor[x] === undefined ? 0 : valor[x]);
                    }
                } else {
                    valores[0] = valor.Edo;
                    valores[1] = valor.Mun;
                    valores[2] = valor.Pq;
                }
            }
            setIndices(valores);
        }
        for (; x < nNiveles; ++x) {
            retorno += fmt2(this.indices[x]);
        }
        return retorno;
    }
    function defineBase(dom) {
        let base;
        if (typeof(dom) === "string") { base = document.getElementById(dom)}
        else { base = dom }
        return base;
    }
    function ficha() {
        let retorno = "Código: " +this.codigo() +"<br/>";
        if (this.indices[nivelPq]) retorno += "Parroquia: " + Parroquia(this.indices[nivelEdo], this.indices[nivelMun],this.indices[nivelPq]) + " Nro " +this.indices[nivelPq]+"<br/> del ";
        if (this.indices[nivelMun]) retorno += "Municipio " + Municipio(this.indices[nivelEdo], this.indices[nivelMun]) + " Nro. "+ this.indices[nivelMun] +"<br/> del ";
        if (this.indices[nivelEdo]) retorno += "Estado "+ Estado(false,this.indices[nivelEdo])+" ("+Estado(true,this.indices[nivelEdo])+")"+" Nro. " +this.indices[nivelEdo];
        else retorno = "No se ha escogido ningún Estado todavía";
        return retorno;
    };
    function Estado(abreviado = false, xEdo = this.indices[nivelEdo]) {
        let x = xEdo -1;
        return abreviado ? DPT[x].ABREV ? DPT[x].ABREV: DPT[x].EDO.slice(0,2) : DPT[x].EDO;
    }
    function Municipio(xEdo = this.indices[nivelEdo], xMun = this.indices[nivelMun]) {
        return  DPT[xEdo -1].Municipios[xMun -1].Municipio;
    }
    function Parroquia(xEdo = this.indices[nivelEdo], xMun = this.indices[nivelMun], xPq = this.indices[nivelPq]) {
        let valor = DPT[xEdo -1].Municipios[xMun -1].Parroquias[xPq -1];
        return typeof valor === "string" ? valor : valor.Parroquia;
    }
        
    function rogCmbDPT(definicion) {
        
        function limpiaCmbs(nivel) {
            let x = nivelPq;
            for (; x > nivel; --x) { if(dptSelf.combos[x]) dptSelf.combos[x].base.innerHTML = "" }
        }
        
        this.base = defineBase(definicion.dom);
        this.value = 0;
        this.llenaCombo = () => {
            limpiaCmbs(this.nivel);
            // Llena un combo con las DPT correspondientes
            let creaOpcion = (e,x)  => {
                let opcion = document.createElement("OPTION");
                opcion.className = cmbSelf.clase.opc;
                opcion.indices = e.indices;
                opcion.value = x +1;
                opcion.appendChild(document.createTextNode(e.nombre));
                this.base.appendChild(opcion);
            }
            this.base.innerHTML = "";
            this.value = 0;
            creaOpcion({nombre: "Escoja " +["el Estado", "el Municipio", "la Parroquia"][this.nivel], indices: [0,0,0]}, -1)
            this.fuente(...indices).forEach(creaOpcion);
            
            if(indices[this.nivel]) this.base.selectedIndex = indices[this.nivel]
            else if (this.opciones.length === 2) this.setValor(1);
        };
        this.selecciona = () => {
            cmbSelf.value = parseInt(cmbSelf.opciones[cmbSelf.base.selectedIndex].value);
            asigna(cmbSelf.value, cmbSelf.nivel);
            if (cmbSelf.value) { if(cmbSelf.hijo) cmbSelf.hijo.llenaCombo(); }
            else { limpiaCmbs(cmbSelf.nivel) }
        };
        this.setValor = (valor) => {
            if (cmbSelf.value != valor) {
                if((valor < 0) || (valor > cmbSelf.opciones.length)) valor = 0;
                
                if (cmbSelf.opciones.length) {
                    cmbSelf.opciones[valor].selected = true;
                    cmbSelf.base.onchange();
                }
            }
        }

        var cmbSelf = this;

        this.base.onchange = definicion.funcion || this.selecciona;
        this.nivel = nivelDe(this.base);
        this.fuente = Fuente(this.nivel);
        this.clase = new Clases(this.nivel);
        this.opciones = this.base.children;
        if (this.nivel === nivelEdo) this.llenaCombo();
    }

    function rogLstDPT(dom, funcion) {
        // Lista de Dependencias
        // @param dom       dom donde se presentará la lista
        // @param funcion   funcion que se llama al seleccionar un elemento de la lista
        function cualFuncion(funcion) {
            let retorno;
            if (funcion) {
                if (typeof funcion ===  "function") retorno = funcion;
                else retorno = funcion[lstSelf.nivel]
            }
            return retorno || lstSelf.selecciona;
        }

        var lstSelf = this;
        
        this.base = defineBase(dom);
        this.nivel = nivelDe(this.base) +1;
        this.esFija = Boolean(Fijos[this.nivel]);
        this.value = 0;
        this.fuente = Fuente(this.nivel);
        this.llenaLista = () => {
            // Llena una lista con las DPT correspondientes
            function elementoLi(base,e,x,funcion) {
                let li = document.createElement("LI");
                li.className = lstSelf.clase.li;
                li.indices = e.indices;
                li.value = x;
                li.onclick = funcion;
                li.appendChild(document.createTextNode(e.nombre));
                
                base.appendChild(li);
                
                return li;
            }
            
            lstSelf.value = 0;
            let lista = document.createElement("UL");
            lista.className = this.clase.lst;
            this.base.appendChild(lista);

            if(this.esFija) {
                lstSelf.value = indices[lstSelf.nivel];
                elementoLi(lista,new dependencia(this.nivel, null,...indices),indices[this.nivel],this.funcion).click();
            } else {
                this.fuente(...indices).forEach((e,x)  => {
                    elementoLi(lista,e,x+1,this.funcion);
                });
            }
        };
        this.selecciona = (e) => {
            this.quitaSeleccion();
            dptSelf.listas[this.nivel] = this;
            
            let dependencia = e.currentTarget;
            lstSelf.value = dependencia.value;

            asigna(lstSelf.value,lstSelf.nivel);
            lstSelf.lista[lstSelf.value -1].classList.add(lstSelf.clase.sel);
            if (this.nivel < nivelPq) {
                if (dependencia.children.length) {
                    muestra(dependencia, true)
                } else {
                    dptSelf.listas[this.nivel +1] = new rogLstDPT(dependencia,funcion)
                }
            }
            e.stopPropagation();
        };
        this.quitaSeleccion = () => {
            let x = nivelPq;
            for (;x >= this.nivel; --x) {
                let clase = claseLiSel(x);
                let elemento = document.getElementsByClassName(clase)[0];
                if (elemento) {
                    elemento.classList.remove(clase);
                    muestra(elemento, false);
                }
            }
        }
        this.setValor = (valor) => {
            if (lstSelf.value != valor) {
                if((valor > 0) && (valor <= lstSelf.lista.length)) {
                    if (valor) lstSelf.lista[valor -1].click()
                    else  lstSelf.value = valor;
                } else lstSelf.value = 0;
            }
        };
        this.funcion = cualFuncion(funcion);
            
        this.clase = new Clases(this.nivel);
        this.llenaLista();
        this.lista = lstSelf.base.children[0].children;
        if(this.lista.length === 1) this.setValor(1);
    }
    
    this.xEdo = () => indices[nivelEdo];
    this.xMun = () => indices[nivelMun];
    this.xPq  = () => indices[nivelPq];
    this.fijar = (fijos) => {
        if (fijos) {
            if(fijos.xEdo) Fijos[nivelEdo] = fijos.xEdo;
            if(fijos.xMun) Fijos[nivelMun] = fijos.xMun;
            if(fijos.xPq)  Fijos[nivelPq]  = fijos.xPq;
            [...indices] = [...Fijos];
            setIndices();
        }
    }
    this.refleja = (nivel = 0) => {
        let x = nivel;
        for (;x < nNiveles; ++x) {
            if(dptSelf.combos[x]) dptSelf.combos[x].setValor(indices[x]);
            if(dptSelf.listas[x]) dptSelf.listas[x].setValor(indices[x]);
        }
        if (dptSelf.onchange) dptSelf.onchange();
    }
    this.indices = [];
    this.setIndices = setIndices;
    this.Estado = Estado;
    this.Municipio = Municipio;
    this.Parroquia = Parroquia;
    this.Estados = () => {
        let retorno = [];
        DPT.forEach((e,x) => { retorno.push(new dependencia(nivelEdo, e.EDO, x +1))});
        return retorno;
    };
    this.Municipios = (xEdo) => {
        let retorno = [];
        DPT[xEdo -1].Municipios.forEach((e,x) => {
                retorno.push(new dependencia(nivelMun, e.Municipio, xEdo, x +1))
        });
        return retorno;
    }
    this.Parroquias = (xEdo, xMun) => {
        let retorno = [];
        DPT[xEdo -1].Municipios[xMun -1].Parroquias.forEach((e,x) => {
            retorno.push(new dependencia(nivelPq, typeof e === "string" ? e : e.Parroquia, xEdo, xMun, x +1))
        });
        return retorno;
    }
    this.TodosLosMunicipios = () => {
        let retorno = [];
        DPT.forEach((e,x) => {
            DPT[x].Municipios.forEach((e,y) => {
                retorno.push(new dependencia(nivelMun, e.Municipio, x +1, y +1))
            });
        });
        return retorno;
    }
    this.TodasLasParroquias = () => {
        let retorno = [], xEdo, xMun;
        DPT.forEach((e,x) => {
            xEdo = x +1;
            DPT[x].Municipios.forEach((e,y) => {
                xMun = y +1;
                DPT[x].Municipios[y].Parroquias.forEach((e,z) => {
                    retorno.push(new dependencia(nivelPq, e, xEdo, xMun, z +1))
                });
            });
        });
        return retorno;
    }
    this.tablaDPT = () => {
        let retorno = [], xEdo, xMun;
        DPT.forEach((e,x) => {
            xEdo = x +1;
            retorno.push(new dependencia(nivelEdo, e.EDO, xEdo));
            DPT[x].Municipios.forEach((e,y) => {
                xMun = y +1;
                retorno.push(new dependencia(nivelMun, e.Municipio, xEdo, xMun))
                DPT[x].Municipios[y].Parroquias.forEach((e,z) => {
                    retorno.push(new dependencia(nivelPq, e, xEdo, xMun, z +1))
                });
            });
        });
        return retorno;
    }
    this.nbDPT = nbDPT;
    this.base = {}; // DOM principal para el DPT
    this.ficha = ficha;
    this.codigo = codigo;
    this.fuente = function(fuente) { DPT = fuente} // Reeemplazar la fuente de datos original
    /* Objetos
     Manejamos tres niveles: Estado, Municipio y Parroquía
     Para indicar que se quiere trabajar con una dependencia en particular, se usa
     el parámetro "fijos".
     Ejemplo:
     Si se quiere la lista de Parroquías para un Municipio en particular se enviará
     el parámetro "fijos" así: {xEdo: codigo del estado, xMun: codigo del municipio}
     esto abrirá directamente la lista de parroquías de ese Municipio y de ese Estado
     y no permitirá "saltar" a otro Estado y/o Municipio
    
     Las listas se crean dinámicamente dentro del dom especificado; los combos se crean en el html y se referencian individualmente bajo un arreglo
    */
                                /*  Manejo de Listas  */
    this.listas = [];
    this.setListas = (dom,funcion,fijos) => { // Enlaza una lista jerárquica a la Tabla DPT
        // @param dom           dom que contiene la lista
        // @param funcion       funcion a ejecutar al seleccionar una opción:
        //                      puede ser un arreglo con una función para cada nivel
        // @param fijos         OBjeto que permite "fijar" un nivel
        //                      Por ejemplo: {xEdo: 3} permitirá sólo mostrar los Municipios del Estado Nro. 3 y sus
        //                      Parroquias correspondientes
        dptSelf.fijar(fijos);
        this.listas[nivelEdo] = new rogLstDPT(dom, funcion)
    }
                                /*  Manejo de Combos  */
    this.combos = [];
    this.setCombos = (combos,fijos) => { // Enlaza un juego de combos con la Tabla DPT
        // @param combos        Arreglo de objetos con:
        // dom                  dom del combo, la clase define el nivel:
        //                      cmbEdos, cmbMuns o cmbPqs
        // funcion              Función a ejecutar al seleccionar una opción
        //                      si se omite se usará la función por defecto del nivel
        // @param fijos         Objeto de 3 valores opcionales que fijan los niveles;
        //                      xEdo, xMun y xPq
        var x;
 
        dptSelf.fijar(fijos);

        for (x in combos) {
            let combo = new rogCmbDPT(combos[x]);
            this.combos[combo.nivel] = combo;
        }
                                // Enlaza los combos jerárquicamente
        for (x = 1; x < this.combos.length; ++x) { if (this.combos[x] && this.combos[x-1]) this.combos[x-1].hijo = this.combos[x] }
    }
    
                                //   I N I C I A L I Z A C I Ó N
    dptSelf = this;
    dptSelf.indices = indices;
    if (onchange) dptSelf.onchange = onchange;
}