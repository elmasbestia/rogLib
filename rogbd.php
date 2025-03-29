<?php
/**
 * Servicio de Datos para la App de Elecciones
 *
 */

class rogBD
{

    /**
     * Única instancia de la clase
     */
    private static $db = null;

    /**
     * Instancia de PDO
     */
    private static $pdo;

    final private function __construct($prms)
    {
        $contraseña        = $prms["contraseña"];
        $usuario           = $prms["usuario"];
        $nombreBaseDeDatos = $prms["nombreBaseDeDatos"];
        $rutaServidor      = $prms["rutaServidor"];
        $puerto            = $prms["puerto"];

        try {
            // Crear nueva conexión PDO
            self::$pdo = new PDO(
                "pgsql:host=$rutaServidor;port=$puerto;dbname=$nombreBaseDeDatos", $usuario, $contraseña);

            // Habilitar excepciones
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            // Manejo de excepciones
			echo "Error: ". $e->getMessage( );
        }
    }

    public static function ejecuta($sql,$parametros = null)
    {
        return ejecuta($sql,$parametros);
    }
    
    public static function prepara($sql)
    {
        return self::pdo->prepare($sql);
    }

    public static function lee($sql,$parametros = null) {
        return ejecuta($sql, $parametros, true);
    }

    public function ultimo($tabla = "",$id = "id") {
        if($tabla) {
            $resultado = ejecuta("SELECT MAX($id) FROM $tabla;",null,true);
            if(isset($resultado["fallo"])) return $resultado;
            else return count($resultado) ? $resultado[0]["max"] : 0;
        } else return -1;
    }

    /**
     * Evita la clonación del objeto
     */
    final protected function __clone()
    {
    }

    function _destructor()
    {
    }
}

function ejecuta($sql, $parametros = null, $lee = false)
{

    try {
        // Preparar sentencia
        $comando = gettype($sql) === "string" ?
            this->prepare($sql) :
            $sql;

        // Ejecutar sentencia preparada
        if (is_null($parametros))
            $comando->execute();
        else
            $comando->execute(is_array($parametros) ? $parametros : array($parametros));

        if($lee) return extraeRegistros($comando);
        else return array(
            'comando' => $comando,
            'afectadas' => $comando->rowCount(),
            'ultimo' => $this->ultimo()
        );
    } catch (PDOException $e) {
        if(isset($e->errorInfo[2])) {
            $msj = $e->errorInfo[2];
        } else {
            $msj = $e;
        }

        if ($msj == null)
            $msj = "¡ERROR INTERNO!";

        $repetido = (explode("llave duplicada", $msj));

        return array(
            "fallo" => true,
            "msj" => $msj,
            "repetido" => count($repetido) > 1,
            "error" => $e
        );
    }
}

function extraeRegistros($resultado)
{
    return is_array($resultado) ? 
        $resultado :
        $resultado->fetchAll(PDO::FETCH_OBJ);
}

/*
try {
    $dbh->beginTransaction();
    $dbh->query("INSERT INTO Clientes (nombre, ciudad) VALUES ('Leila Birdsall', 'Madrid')");
    $dbh->query("INSERT INTO Clientes (nombre, ciudad) VALUES ('Brice Osterberg', 'Teruel')");
    $dbh->query("INSERT INTO Clientes (nombre, ciudad) VALUES ('Latrisha Wagar', 'Valencia')");
    $dbh->query("INSERT INTO Clientes (nombre, ciudad) VALUES ('Hui Riojas', 'Madrid')");
    $dbh->query("INSERT INTO Clientes (nombre, ciudad) VALUES ('Frank Scarpa', 'Barcelona')");
    $dbh->commit();
    echo "Se han introducido los nuevos clientes";
} catch (Exception $e){
    echo "Ha habido algún error";
    $dbh->rollback();
}
*/
?>
