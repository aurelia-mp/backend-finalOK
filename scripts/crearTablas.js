import knex from 'knex'
import config from '../src/config.js'
import { prods } from './prods.js'
import { carts } from './carts.js'

const mariaDbClient = knex(config.mariaDb)
const sqliteClient = knex(config.sqlite3)

//------------------------------------------
// productos en MariaDb

try {
    // Borrar tabla si ya existe
    await mariaDbClient.schema.dropTableIfExists('productos')

    // Crear tabla
    await mariaDbClient.schema.createTable('productos', table =>{
        table.increments('id').primary()
        table.string('title')
        table.integer('price')
        table.string('thumbnail')
    })

    console.log('tabla productos en mariaDb creada con éxito')

    // Insertar registros
    
    await mariaDbClient('productos').insert(prods)
    
    const prodsDB = await mariaDbClient.from('productos').select('*')
    console.log(prodsDB)


} catch (error) {
    console.log('error al crear tabla productos en mariaDb')
    console.log(error)
} finally {
    mariaDbClient.destroy()
}

//------------------------------------------
// carrito en sqlite3 - NO FUNCIONA LA INSERCIÓN DEL ARRAY DE PRODUCTOS EN EL CARRITO

try {
  // Borrar tabla si ya existe
  await sqliteClient.schema.dropTableIfExists('carritos')

  // Crear tabla
  await sqliteClient.schema.createTable('carritos', table =>{
      table.increments('id').primary()
      table.string('items')
      table.integer('cart_timestamp')
  })
  console.log('tabla carritos en sqlite3 creada con éxito')

  // Insertar los carritos en la tabla

    await sqliteClient('carritos').insert(carts)
    const msj = await sqliteClient.from('carritos').select('*')
    console.log(msj)
} catch (error) {
  console.log('error al crear tabla carritos en sqlite3'+ error)
} finally {
  sqliteClient.destroy()
}


//------------------------------------------
