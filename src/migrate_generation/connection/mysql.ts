
import path from 'node:path';
import mysql from 'mysql'
const credentialsPath = path.resolve('database.json');
const credentials = require(credentialsPath)
const cre = credentials.hasOwnProperty('defaultEnv') ? credentials[credentials.defaultEnv] : credentials.development
const connection = mysql.createConnection({
    host: cre.host,
    user: cre.username,
    password: cre.password,
    database: cre.database
})

export default connection
