import mysql from 'mysql'
import path from 'node:path'

const credentialsPath = path.resolve('database.json')
const credentials = require(credentialsPath)

const cre = Object.prototype.hasOwnProperty.call(credentials, 'defaultEnv')
    ? credentials[credentials.defaultEnv]
    : credentials.development

const connection = mysql.createConnection({
    database: cre.database,
    host: cre.host,
    password: cre.password,
    user: cre.username,
})

export default connection
