// rogRegistro
// Objeto para manipular Datos
//

function test_input(data) { return trim(stripslashes(htmlspecialchars(data))); }

class rogCampo {
//    public nb, titulo, tipo, obligatorio, match, err, original, validador;
//    private contenido;
//    private padre = null;
  
    constructor (padre, nb, valor, tipo = "text", obligatorio = false, match = "", validador = "", titulo = null) {
        this.padre = padre;
        this.nb = nb;
        this.titulo = titulo || nb;
        this.tipo = tipo;
        this.contenido = this.original = valor;
        this.obligatorio = obligatorio;
        this.match = match;
        this.validador = validador;
        this.Err = "";
    }

    get bd() {
        return this.padre.bd();
    }

    valida(valor) {
        let err = "";
        if (empty(valor)) {
            if (this.obligatorio) {
                err = (this.tipo === "combo" ? "Escoja un valor de la lista" : "Este campo es requerido");
            }
        } else {
            // Chequea el formato de los datos
            if (this.match) {
                if (gettype(this.match) != "array") {
                    // Filtros posibles de implementar: http://php.net/manual/es/filter.filters.validate.php
                    switch (this.match) {
                        case "correo":
                            if (!filter_var(valor, FILTER_VALIDATE_EMAIL)) { err = "Formato de correo inválido"; }
                            break;
                        case "url":
                            if (!filter_var(valor, FILTER_VALIDATE_URL)) { err = "Dirección inválida"; }
                            break;
                        default:
                            if (!preg_match(this.match,valor)) { err = "VALOR INVÁLIDO";}
                    }
                }
            }
        }
        if (!err) { // Fechas (CASO ESPECIAL ya que HTML las trata como texto)
            if (this.tipo === "date") {
                fecha = new Date(valor);
                if (fecha) {
                    valor = fecha;
                } else {
                    err = "¡Revise la fecha, por favor!";
                }
            }
        }
        if (!err) { // Función validadora
            if(this.validador) {
                validador = this.validador;
                err = validador(valor);
            }
        }
        this.Err = err;
        this.contenido = valor;
        return !err;
    }
  
    valor(valor = null) {
        original = this.contenido;
        if (valor !== null) {
            if (!this.valida(valor)) {
                this.contenido = original;
                msj = `No es posible asignar el valor valor a ${this.titulo} <br/>(${this.Err})`;
                alert(msj);
            }
        }
        return this.contenido;
    }
    
    datos() {
        retorno = {};
        retorno[this.nb] = this.contenido;
        return retorno;
    }
  
    toString() { return this.titulo +": " +this.contenido; }
    
    Combo (match) {
        // @param match arreglo con los valores [etiqueta => valor] a llenar el combo
        txt = "<select name='this.nb'>";
        opciones = "";
        for(let x in match) {
            //chq = (this.contenido === x.valor ? "selected" : "");
            opciones += `<option chq value='${x.valor}'>${x.etiqueta}</option>`;
        }
        return txt +opciones +"</select>";
    }

    Tabla (match) {
        // @param match     Es un arreglo con dos elementos:
        //                  1. Nombre de la tabla a acceder
        //                  2. Arreglo con los nombres de los campos a formar el combo (Valor, Etiqueta)
        
        return this.Combo(this.bd().leeSql(this.bd().creaSql(match[0],match[1])));
    }

    radioBtn (match) {
        // @param match  arreglo de tipo [etiqueta => valor] para crear las opciones "radio button"
        opciones = "";
        for(let x in match) {
            opciones += `<input type='radio' name='${this.nb}' chq value='${x.valor}'/>${x.etiqueta}`;
        }
        return opciones;
    }

    Input() {
        txt = `<label for='this.nb'>this.titulo :</label>`;
        switch (this.tipo) {
            case "radio":
                txt += this.radioBtn(this.match);
                break;
            case "memo":
                txt += "<textarea name='this.titulo' rows='5' cols='40'>this.contenido</textarea>";
                break;
            case "combo":
                txt += this.Combo(this.match);
                break;
            case "tabla":
                txt += this.tabla(this.match);
                break;
            case "date":
                txt += "<input type='date' name='this.nb' value='" +date("Y-m-d",this.contenido) +"'"  +(this.obligatorio ? " required" : "") +"/>";
                break;
            case "checkbox":
                txt += "<input type='checkbox' name='this.nb' value='this.contenido'>this.titulo";
                break;
            default:
                txt +=  "<input type='this.tipo' name='this.nb' value='this.contenido'" +(this.obligatorio ? " required" : "") +"/>";
        }

        txt += "<span class='error'>" +(this.obligatorio ? "*" : "") +" this.Err</span>";
        txt += "<br><br>";
        return txt;
    }
  
    muestra() {
        txt = "<table>";
        txt += "<th>this.nb</th>";
        for(let x in this){
            txt += "<tr><td>nb</td><td>valor</td></tr>";
        }
        txt += "</table>";
        return txt;
    }
}

Class rogRegistro {
    private id = -1;
    private fino = true;
    private leyo = false;
    private Campos;
    private trazar = false;
    private padre = null;
    private bd = null;
    
    function msj(msj) {
        if(this.trazar) {
            echo "<div style='background-color: blue; color: white'>";
            if (gettype(msj) === "object") {
                print_r(msj);
            } else {
                echo msj;
            }
            echo "</div>";
        }
    }
  
    public function traza(valor = true) {
        this.trazar = valor;
        this.msj("MODO DE TRAZADO");
    }

    public function fino() { return this.fino; }

    public function leyo() { return this.leyo; }
    
    public function nuevo() { return this.id === -1; }
    
    public function Id() { return this.id; }

    public function bd(tipo = null,conexion = null) {
		static veces = 0;
		
		echo ++veces, " vez en BD<br/>";
		
        if (is_null(conexion)) {
			if (is_null(tipo)) {
				echo "No ABRE nada<br/>";
			} else {
				if (tipo instanceof rogConexion) {
					this.bd = conexion;
				} else {
					echo "Nueva conexión sin tipo<br/>";
					this.bd = new rogConexion(null,tipo);
				}
			}
        } else {
			echo "Nueva conexión con todo<br/>";
            this.bd = new rogConexion(tipo,conexion);
        }
        echo "Devuelve ", gettype(this.bd), "<br/>";
//        var_dump(this.bd);
//        echo "<hr/>";
        return this.bd;
    }

    public function nuevoCampo(nb, valor = "", tipo = "text", obligatorio = false, match = "", validador = "",  titulo = null) {
        this.Campos[nb] = new rogCampo(this, nb, valor, tipo, obligatorio, match, validador, titulo);
    }
  
    public function nCampos() { return count(this.Campos); }
 
    public function valida(campo = null) {
        if (is_null(campo)) {
          this.leyo = true;
          foreach(this.Campos as campo) {
            leido = test_input(_POST[campo.nb]);
            this.leyo = (campo.valida(leido) and this.leyo);
            //this.msj(this.leyo ? "<strong>FINO</strong>" : "<strong>FALLÓ</strong>");
          }
          return this.leyo;
        } else {
            return this.Campos[campo].valida(leido = test_input(_POST[Campos[campo].nb]));
        }
    }
  
    public function formulario(titulo, botonesRs = true) {
        txt = "<h2>titulo</h2>";
        txt += "<form method='post' action='" . htmlspecialchars(_SERVER["PHP_SELF"]) ."'><fieldset>";
    
        foreach (this.Campos as campo) { txt += campo.Input(); }
    
        txt += "</fieldset><fieldset>";
        if (botonesRs) {
            txt += "<input type='button' class='rogBtn' name='btnAnterior' value='<<'/>";
            txt += "<input type='button' class='rogBtn' name='btnAnade' value='+'/>";
        }
        txt += "<input type='submit' class='rogBtn' name='btnProcede' value='Procede'/>";
        txt += "<input type='button' class='rogBtn' name='btnImprimir' id='Imprimir' onClick='javascript:send('Imprimir');' value='Imprimir'/>";
        txt += "<input type='reset'  class='rogBtn' name='btnLimpiar' value='Limpiar'/>";
        txt += "<input type='button' class='rogBtn' name='btncancela' value= 'Cancelar'/>";
        if (botonesRs) {
			txt += "<input type='button' class='rogBtn' name='btnSiguiente' value='>>'/>";
			txt += "<input type='button' class='rogBtn' name='btnElimina' value='-'/>";
		}
        txt += "<span class='error'><small>* Campo requerido.</small></span>";
        txt += "</fieldset>";
        txt += "</form>";
        
        return txt;
    }
  
    public function valor(que, valor = null) { return this.Campos[que].valor(valor); }

    public function lee() {
        this.bd.llenaReg(this);
    }

    public function registra() {
        this.bd.registraReg(this);
    }

    public function datos(x) {
        this.bd.datos(x);
    }

    public function tabla() {
        this.bd.tabla();
    }
  
    public function toString() {
        txt = "";
        foreach(this.Campos as campo) {
            txt += campo.toString() ."<br/>";
        }
        return txt;
    }
    
    public function muestra(campo = null) {
        if (campo) {
            txt = this.Campos[campo].muestra();
        } else {
            txt = "<table>";
            foreach(this.Campos as campo){
                txt += "<tr><td>campo.nb</td><td>" .campo.valor() ."</td></tr>";
            }
        txt += "</table>";
        }
        return txt;
    }
}

Class rogBDid {
    private nbBD, usr, pwd;
    
    function __construct(nb="", usr="", pwd="") {
        this.nbBD = nb;
        this.usr = usr;
        this.pwd = pwd;
    }
    
    function nbBD(nb = "") {
        if (nb) {this.nbBD = nb;}
        return this.nbBD;
    }
    function Usuario(usr = "") {
        if (nb) {this.usr = usr;}
        return this.usr;
    }
    function Clave(pwd = "") {
        if (nb) {this.pwd = pwd;}
        return this.pwd;
    }
}

Class rogDatos {
    private   eof = -1;
    private buffer;
    private indice = -1;
    public  nRegs = 0;

    function eof() { return this.indice === this.eof; }
    function indice() { return this.indice; }
    function siguiente() {
        if (this.indice > -1) {
            if (++this.indice === this.nRegs) { indice = this.eof; }
        }
        return this.actual();
    }
    function anterior() {
        if (this.indice >= 0) {
            --this.indice;
        }
        return this.actual;
    }
    function actual(x = null) {
        if (!is_null(x)) {
            if(x >= 0 and x < this.nRegs) { this.indice = x; } else { this.indice = this.eof; }
        }
        return this.indice === this.eof ? null : this.buffer[this.indice];
    }
    function busca(que, valor) {
        this.indice = this.eof;
        return this.actual;
    }
    function carga(datos) {
        this.buffer = datos;
        this.nRegs = count(this.buffer);
        this.indice = this.nRegs ? 0 : this.eof;
        return this.actual();
    }
    function descarga() {
        echo "Descarga Datos:<br/>";
        return this.buffer;
    }

    function llenaReg(reg) {
        foreach(this.actual() as campo => valor) {
            reg[campo].valor(valor);
        }
    }

    function registraReg(reg) {
        foreach(this.actual() as campo => valor) {
            reg[campo].valor();
        }
    }
}

Class rogConexion {
    // Objeto Conexión
    private conexion, fino;
    private datos;

    function __construct(tipo,conexion) {
        this.datos = new rogDatos();

        if(tipo) {
            if(conexion) {
                if (conexion instanceof rogBDid) {
                    this.abre(tipo,"host='conexion.nb' user='conexion.usr' password='conexion.pwd'");
                } else {
                    this.abre(tipo,conexion);
                }
            } else {
			   if (gettype(conexion) === "string") {
					this.abre(tipo,conexion);
				} else {
					this.conexion = conexion;
				}
			}
       } else {
           if(conexion) {
 				this.abre(tipo,conexion);
            } else {                // Trabajar sin conexión
                this.conexion = ["bd" => "Nada"];
                this.conexion.isConnected = function () { return true; };
            }
        }

        alert((this.fino = this.conexion.isConnected() ? '¡La conexión fue exitosa!' : 'No se ha establecido la conexión'));
    }

    private function abre(tipo = null,conexion = null) {
        if (tipo === "csv") include_once('../include/adodb/adodb-csvlib.inc.php');
        
        echo "Abrime: 'tipo': 'conexion' <br/>";
        if(empty(tipo)) {
            include_once ('../include/header.php');
            conn = getConnDB(conexion);
        } else {
            conn = new ADONewConnection(tipo);
            if(conn) conn.Connect(conexion);
        }

        if (conn === false) { die ("¡tipo, conexion Me escupió!"); }           // **   S A L I D A   A N O R M A L   **

        this.conexion = conn;
        return conn.isConnected();
    }
    
    function chkErr() {
        static cont;

        e = this.conexion.errorMsg();
        echo "Error: ", e;
        if (e) {
          alert( ++cont .". e <br/>");
          this.fino = false;
        }
        return this.fino;
    }

    function fino() {      // Refleja el éxito de la última operación
        return this.fino;
    }
 
    function sql(sql) {
        return this.conexion.Execute(sql);
    }

    function creaSql(tabla,columnas="*",criterio ="",orden="") {
        return "SELECT " .implode(",", columnas) ." FROM tabla" .(criterio ? " WHERE criterio" : criterio) .(orden ? " ORDER BY orden" : orden);
    }
    
    function Imprime() {}
    
    function xml() {}
    
    function json() {
        // Convierte datos en una estructura json
        return json_encode(this.datos);
    }

    function tabla() {
        // Muestra datos como una tabla

        fnLinea = function (reg,xlin) {
            echo xlin, ": ";
            print_r(reg);
            echo "<br/>";
            
            fnTitulos = function (reg) {
                retorno = "<thead><tr>";
                foreach(reg as nb => valor) {
                    retorno += "<th>nb</th>";
                }
                return retorno ."</tr></thead>";
            };
            
            retorno = xlin === 1 ? fnTitulos(reg) ."<tbody>" : "";
            retorno += "<tr>";
            foreach(reg as nb => valor) {
                retorno += "<td>valor</td>";
            }
            
            return retorno += "</tr>";
        };
    
        xlin = 0;
        
        if(this.datos.nRegs){
            retorno = "<table>";
            foreach(this.datos.descarga() as linea) {
                retorno += fnLinea(linea, ++xlin);
            }
            return retorno += "</tbody></table>";
        } else {
            return "¡No hay datos que mostrar!";
        }
    }
    
    function datos(data = null) {
        if (!is_null(data)) { this.datos.carga(data); }
        return this.datos.descarga();
    }
    
    function leeSql(sql) {
        this.msj("Lee: sql");
        
        datos = array();
        campos = array();
	    xReg = 0;
	    
	    rs = this.conexion.Execute(sql);
        while(!rs.EOF){
            ++xReg;

            if(xReg === 5) return;

            for (xCampo = 0; xCampo < rs.fieldCount(); ++xCampo) {
                datos[xReg][rs.FetchField(xCampo).name] = rs.fields(xCampo);
            }
            rs.MoveNext();
        }
        this.msj(xReg ." registros leídos.");
        return datos;
    }
    
    function descarga(sql) {
        // Ejecuta el sql y lo guarda en datos
        return this.datos = this.leeSql(sql);
    }

    function carga(tabla,uno) {
        if (count(this.datos)) {
            if(uno) {
                this.conexion.autoExecute(tabla,this.actual(),'INSERT');
            } else {
                foreach(this.datos as reg) {
                    this.conexion.autoExecute(tabla,reg,'INSERT');
                }
            }
        } else {
            alert ("No hay registros que cargar.");
        }
    }
    
    function cargaTrans(tablas,datos) {
        // Construye una transacción para cargar datos relacionados
        // @param tablas   Arreglo de Tablas (Una por nivel)
        // @param datos    Los datos en una estructura json
        
        conexion.startTrans();
 
        // Construye Datos para cada nivel y carga
        conn.Execute(sql);
        conn.Execute(sql2);
 
        conexion.completeTrans();
    }
    
    function actualiza(tabla,reg,condicion){
        this.conexion.autoExecute(tabla, this.actual(), 'UPDATE', condicion);
    }

    function llenaReg(reg) {
        this.datos.llenaReg(reg);
    }

    function registraReg(reg) {
        this.datos.registraReg(reg);
        if(reg.nuevo()) {
            this.carga(tabla,reg);
        } else {
            this.actualiza(tabla,reg,"Id = " & reg.Id);
        }
    }

}
    
/*
adoNewConnection()	    Create a new connection object
connect()	            Establishes a non-persistent connection with a database
isConnected()	        Indicates if a connection has been established
newAdoConnection()	    Is a pseudonym for adoNewConnection()
nConnect()	            Forces the establishment of a new connection with a database
pConnect()	            Establishes a persistent connection with a database
selectDb()	            Select which database to connect to
setConnectionParameter	Sets an optional connection parameter
close()	                Closes a database connection}

Executing SQL

autoExecute()	          Automatically prepares and executes Insert and Update statements based on supplied parameters
execute()	              Executes a provided SQL statement and returns a handle to the result
getAll()	               Executes a provided SQL statement and returns the entire recordset into an array
getAssoc()	               Executes a provided SQL statement and returns the entire recordset into an associatitive array with the value of the first column as a key
getCol()	               Executes a provided SQL statement and returns the first column of each row of he entire recordset into an array
getMedian()	               Returns the median value of a column in a table
getOne()	               Retrieves the first column of the first matching row of an executed SQL statement
getRow()	                Retrieves the first matching row of an executed SQL statement
replace()	                Provides a simple single record replacement function
selectLimit	                Executes a provided SQL statement and returns a handle to the result, with the ability to supply a starting offset and record count
setCharSet()	           Sets the character set for database connections (limited databases)

Error Handling

errorMsg()	Returns a database specific error message
ignoreErrors()	Overrides the built-in transaction and error handling status
metaError()	Returns a portable error number based on a database specific error
metaErrorMsg()	Returns a portable error message based on a portable error number. The language of the message may be controlled by ADODB_LANG

Menu generation

getMenu()	Creates a string containing a basic HTML select box
getMenu2()	Creates a string containing a basic HTML select box with alternate comparison criteria to getMenu()
getMenu3()	Creates a string containing a grouped HTML muilti-select box


*/
?>
