// conection a la base de donnée
const mysql = require('mysql2')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'Azerty123!',
  database: 'test'
})

db.connect((err) => {
  if (err) {
    console.log('erreur de conection : ', err)
  } else {
    console.log('conected !')
  }
})

module.exports = db
