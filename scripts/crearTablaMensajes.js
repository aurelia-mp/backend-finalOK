import knex from 'knex'

const sqliteClient = knex({
    client: 'sqlite3',
    connection: {
        filename: '../DB/ecommerce.sqlite'
    },
    useNullAsDefault: true
},)

// mensajes en SQLite3
try {
    // Borrar tabla si ya existe
    await sqliteClient.schema.dropTableIfExists('mensajes')
  
    // Crear tabla
    await sqliteClient.schema.createTable('mensajes', table =>{
        table.increments('id').primary()
        table.string('email')
        table.string('mensaje')
        table.string('fecha')
    })
    console.log('tabla mensajes en sqlite3 creada con éxito')
  
    // Insertar los primeros mensajes en la tabla
    let mensajes = [
        {
          "email": "a@a.com",
          "mensaje": "Primer Mensaje",
          "fecha": "26/11/2022 12:46:53",
          "id": 1
        },
        {
          "email": "a@a.com",
          "mensaje": "Hola!! ",
          "fecha": "26/11/2022 12:47:00",
          "id": 2
        },
        {
          "email": "a@a.com",
          "mensaje": "Cómo están?",
          "fecha": "28/11/2022 08:31:53",
          "id": 3
        },
        {
          "email": "usuario2@gmail.com",
          "mensaje": "Hola! Buen día!",
          "fecha": "28/11/2022 09:58:39",
          "id": 4
        }
      ]
      
      await sqliteClient('mensajes').insert(mensajes)
      const msj = await sqliteClient.from('mensajes').select('*')
      console.log(msj)
  } catch (error) {
    console.log('error al crear tabla mensajes en sqlite3')
  } finally {
    sqliteClient.destroy()
  }