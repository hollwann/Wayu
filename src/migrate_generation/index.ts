import fs from 'fs'
import mysql from 'mysql'
import path from 'node:path'

declare type SQLType = 'varchar' | 'int' | 'tinyint' | 'timestamp'
declare type INewField = {
    type?: SQLType
    unsigned?: boolean
    notNull?: boolean
    primaryKey?: boolean
    autoIncrement?: boolean
    length?: number
}

declare type MigrationFormat = {
    create: Record<string, Record<string, INewField>>
    delete: Record<string, Record<string, INewField>>
    modify: Record<string, Record<string, INewField>>
}
declare type MigrationFileFormat = {
    currentVersion: string
    lastVersion: string
    timestamp: string
    up: MigrationFormat
    down: MigrationFormat
    index: number
}

//     Table   -----  Field  --  Field config

class dbMigrateWayu {
    currentVersion = new Date().getTime().toString()
    lastVersion = null as null | string
    timestamp = new Date().toISOString()
    constructor() {
        this.getListOfMigrations()
    }
    private migrationsData: MigrationFileFormat[] = []
    private currentDb: Record<string, Record<string, INewField>> = {}
    private migrationPath = path.resolve('migrations')
    private baseMigrationJsFile(data: MigrationFormat, name: string) {
        return `
exports.currentVersion = "${name}"
exports.lastVersion = ${this.lastVersion ? `"${this.lastVersion}"` : 'null'}
exports.timestamp =  "${this.timestamp}"

exports.up = {
	${this.getMigrationFormat(data.create)}
}

exports.down = {
	create: {},
	delete: {},
	modify: {}
}
		`
    }
    private getMigrationFormat(
        data: Record<string, Record<string, INewField>>
    ) {
        let str = ''
        for (const table in data) {
            str += `"${table}": {`
            for (const field in data[table]) {
                str += `"${field}": {`
                for (const key in data[table][field]) {
                    str += `"${key}": ${JSON.stringify(data[table][field])},`
                }
                str += '},\n'
            }
            str += '},\n'
        }
        return str
    }
    private formatName = (name: string) => {
        return name.split(' ').join('_')
    }
    getSingleMigration() {}
    updateDbHistory(updated: MigrationFormat) {
        for (const pro in updated.create) {
            this.currentDb[pro] = updated.create[pro]
        }

        // delete table or fields
        Object.keys(updated.delete).map(
            // List of table to delete
            (key: string) => {
                const value = updated.delete[key]
                if (Object.keys(value).length === 0) {
                    delete this.currentDb[key]
                }
                // List of field of table
                for (const field in Object.keys(value)) {
                    if (this.currentDb[key].hasOwnProperty(field)) {
                        delete this.currentDb[key][field]
                    }
                }
            }
        )
    }
    private getListOfMigrations() {
        const files = fs.readdirSync(this.migrationPath)
        const migrationsDataFiles = files.map((f,index) => {
            const {
                up,
                down,
                currentVersion,
                lastVersion,
                timestamp,
            } = require(this.migrationPath + '/' + f)
            return {
                currentVersion,
                down,
                lastVersion,
                timestamp,
                up,
                index
            } as MigrationFileFormat
        })
        const oldVersions = migrationsDataFiles
            .map((m) => m.lastVersion)
            .filter((v) => v !== null)
        const newVersions = migrationsDataFiles.map((m) => m.currentVersion)
        const validateHistory = newVersions.filter(
            (v) => oldVersions.indexOf(v) === -1
        )
        this.migrationsData = migrationsDataFiles.sort((a, b) => {
            return a.lastVersion === b.currentVersion ? 1 : -1
        }).map((data,index)=>({...data,index}))
        
        if (validateHistory.length > 1) {
            throw new Error('History not valid')
        }
        this.lastVersion =
            validateHistory.length === 1 ? validateHistory[0] : null
    }
    createMigration(name?: string) {
        const migration = {} as MigrationFormat
        const fileName = name
            ? this.currentVersion + '-' + this.formatName(name)
            : this.currentVersion
        const filePath = this.migrationPath + '/' + fileName + '.js'
        this.getListOfMigrations()

        
      // fs.writeFileSync(filePath, this.baseMigrationJsFile(migration, fileName))
    }
    private lastMigrationInDb(): Promise<string> {
        // base on db processor import the connections
        // and run the migration
        return new Promise((resolve, reject) => {
            const conectionsPath = path.resolve(
                'src/migrate_generation/connection/mysql'
            )
            const connection = require(conectionsPath).default
            connection.connect(function (err: { stack: string }) {
                if (err) {
                    throw err
                }
                connection.query(
                    'SHOW TABLES LIKE \'migrations\'',
                    function (err: any, result: any) {
                        if (err) {
                            reject(err)
                        }
                        connection.query(
                            'SELECT *  from migrations ORDER BY run_on DESC LIMIT 1',
                            function (
                                err: any,
                                result: { id: number; name: string }[]
                            ) {
                                if (err) {
                                    reject(err)
                                }
                                resolve(result[0].name.split('/')[1])
                            }
                        )
                    }
                )
            })
        })
    }
    async migrate() {
        // aply migrations to the last version
        const lastMigrationDb = await this.lastMigrationInDb()
        // Get last migration un db
        if (lastMigrationDb === this.lastVersion) {
            console.log('No migration to apply')
            return
        }
        // what is the next migration
        const migrationToApply = this.migrationsData.find(
            (m) => m.lastVersion === lastMigrationDb
        )
        console.log(migrationToApply)

    }
}

const wayu = new dbMigrateWayu()
//wayu.migrate()
wayu.createMigration('test 1234')
// console.log(wayu.currentVersion)
// console.log(wayu.timestamp)
