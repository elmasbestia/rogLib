// Servidor Genérico para Postgres


require('dotenv').config();

const bdPg = abrePG();

                                          // Funciones
function abrePG() {
    const { Cliente } = require('pg')
    const cliente = new Client()
    await cliente.connect()
    if(cliente) return cliente;
    else {
        console.log("No me pude conectar con la BD")
        process.exit(-1);
    }
}

function cierraPG() {
    await bdPg.end()
}

function creaLstPrms(n) {
    let retorno = "";
    for(let i = 1; i <= n; i++) { retorno += "$" + i +", " }
    return retorno;
}

function ejecuta(sql) {
    return bd.query(sql)
    .then((datos) => {
        console.log(datos.rows)
        console.log(datos.rows.length, "registros");
        return datos.rows;
    })
    .catch((err) => {
		console.log(sql);
    	console.error(err);
    	return { fallo: true, err: err };
    });
}

app.get('/sql/:sql', (req,res) => {


app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}.`);
});
    
// callback
client.query('SELECT NOW() as now', (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})
// promise
client
  .query('SELECT NOW() as now')
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack))
    
***************
    
const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
const values = ['brianc', 'brian.m.carlson@gmail.com']
// callback
client.query(text, values, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
    // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  }
})
// promise
client
  .query(text, values)
  .then(res => {
    console.log(res.rows[0])
    // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  })
  .catch(e => console.error(e.stack))
// async/await
try {
  const res = await pool.query(text, values)
  console.log(res.rows[0])
  // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
} catch (err) {
  console.log(err.stack)
}
    
*******************************************

const query = {
  // give the query a unique name
  name: 'fetch-user',
  text: 'SELECT * FROM user WHERE id = $1',
  values: [1],
}
// callback
client.query(query, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})
// promise
client
  .query(query)
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack))
    
******************************************

const { Pool } = require('client')
const pool = new Pool()
pool.connect((err, client, done) => {
  const shouldAbort = err => {
    if (err) {
      console.error('Error in transaction', err.stack)
      client.query('ROLLBACK', err => {
        if (err) {
          console.error('Error rolling back client', err.stack)
        }
        // release the client back to the pool
        done()
      })
    }
    return !!err
  }
  client.query('BEGIN', err => {
    if (shouldAbort(err)) return
    const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id'
    client.query(queryText, ['brianc'], (err, res) => {
      if (shouldAbort(err)) return
      const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
      const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
      client.query(insertPhotoText, insertPhotoValues, (err, res) => {
        if (shouldAbort(err)) return
        client.query('COMMIT', err => {
          if (err) {
            console.error('Error committing transaction', err.stack)
          }
          done()
        })
      })
    })
  })
})

****************************************

const { Pool } = require('pg')
const pool = new Pool()
;(async () => {
  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id'
    const { rows } = await client.query(queryText, ['brianc'])
    const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
    const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
    await client.query(insertPhotoText, insertPhotoValues)
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
})().catch(e => console.error(e.stack))

