import {
    BooleanWayu,
    IntWayu,
    StringWayu,
    WayuDataType,
    WayuModelStatic,
} from '../index'
import { execSync } from 'child_process'
import { exit } from 'process'
import WayuModel from '../models'
import fs from 'fs'
import get from 'lodash'
import path from 'node:path'

type DataTypes = IntWayu | StringWayu | BooleanWayu
type DataTypesRecord = Record<string, DataTypes>
type MigrationFormat = {
    create: Record<string, Record<string, DataTypesRecord>>
    delete: Record<string, Record<string, DataTypesRecord>>
    modify: Record<string, Record<string, DataTypesRecord>>
}
type MigrationFileFormat = {
    currentVersion: string
    lastVersion: string
    timestamp: string
    up: MigrationFormat
    down: MigrationFormat
    index: number
}

//Table   -----  Field  --  Field config

class dbMigrateWayu {
    currentVersion = new Date()
        .toISOString()
        .split('.')[0]
        .replace(/[-:.:T]/g, '')
    lastVersion = null as null | string
    timestamp = new Date().toUTCString()
    constructor() {
        this.getListOfMigrations()
    }
    private migrationsData: MigrationFileFormat[] = []
    private currentDb: Record<string, Record<string, DataTypesRecord>> = {}
    private migrationPath = path.resolve('__migrations__')
    private baseMigrationJsFile(data: MigrationFormat, name: string) {
        return `
'use strict'
exports.currentVersion = '${name}'
exports.lastVersion = ${this.lastVersion ? `'${this.lastVersion}'` : 'null'}
exports.timestamp =  '${this.timestamp}'

exports.up = {
    create: ${this.getMigrationFormat(data.create)}
    delete: ${this.getMigrationFormat(data.delete)}
    modify: ${this.getMigrationFormat(data.modify)}
	
}
exports.down = {
	create: {},
	delete: {},
	modify: {}
}`
    }
    private basedDBmigrationFile(update: string, donwgrade: string) {
        return `
'use strict'
var async = require('async')
var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate
    type = dbm.dataType
    seed = seedLink
}
exports.up = function (db, callback) {
${update}
}
exports.down = function (db, callback) {
${donwgrade}
}
exports._meta = {
    'version': 1
}
        `
    }
    private getMigrationFormat(
        data: Record<string, Record<string, DataTypesRecord>>
    ) {
        let str = ''
        for (const table in data) {
            str += `'${table}': {`
            for (const field in data[table]) {
                const dataFiels = data[table][field]  as unknown as DataTypes
                str += `            '${field}': { 
                    ${dataFiels.describe()}

                },\n`
            }
            str += '},\n'
        }
        return str == '' ? '{},' : `{${str}},`
    }
    private getMigrationFormatDbConnect(
        data: Record<string, Record<string, DataTypesRecord>>
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
    updateDbHistory(data: MigrationFormat) {
        Object.keys(data.delete).map(
            // List of table to delete
            (key: string) => {
                const value = data.delete[key]
                if (Object.keys(value).length === 0) {
                    delete this.currentDb[key]
                }
                // List of field of table
                for (const field in Object.keys(value)) {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            this.currentDb[key],
                            field
                        )
                    ) {
                        delete this.currentDb[key][field]
                    }
                }
            }
        )
    }
    private getListOfMigrations() {
        const files = fs.readdirSync(this.migrationPath)
        const migrationsDataFiles = files.map((f, index) => {
            const {
                up,
                down,
                currentVersion,
                lastVersion,
                timestamp,
                // eslint-disable-next-line @typescript-eslint/no-var-requires
            } = require(this.migrationPath + '/' + f)
            return {
                currentVersion,
                down,
                index,
                lastVersion,
                timestamp,
                up,
            } as MigrationFileFormat
        })
        const oldVersions = migrationsDataFiles
            .map((m) => m.lastVersion)
            .filter((v) => v !== null)
        const newVersions = migrationsDataFiles.map((m) => m.currentVersion)
        const validateHistory = newVersions.filter(
            (v) => oldVersions.indexOf(v) === -1
        )
        this.migrationsData = migrationsDataFiles
            .sort((a, b) => {
                return a.lastVersion === b.currentVersion ? 1 : -1
            })
            .map((data, index) => ({ ...data, index }))

        if (validateHistory.length > 1) {
            throw new Error('History not valid')
        }
        this.lastVersion =
            validateHistory.length === 1 ? validateHistory[0] : null
    }
    compareLocalToMigration(
        localModel: Record<string, Record<string, DataTypesRecord>>,
        migrationsModel: Record<string, Record<string, DataTypesRecord>>
    ) {
        const newMigration = {
            create: {},
            delete: {},
            modify: {},
        }
        for (const table in localModel) {
            if (!Object.prototype.hasOwnProperty.call(migrationsModel, table)) {
                // Delete table
                newMigration.delete = { [table]: {} }
            }
            for (const field in localModel[table]) {
                if (
                    !Object.prototype.hasOwnProperty.call(
                        migrationsModel[table],
                        field
                    )
                ) {
                    // Add field
                    newMigration.create = {
                        [table]: { [field]: localModel[table][field] },
                    }
                }
                // for (const key in localModel[table][field]) {
                //     if (
                //         !Object.prototype.hasOwnProperty.call(
                //             migrationsModel[table][field],
                //             key
                //         )
                //     ) {
                //         // Add key
                //         newMigration.modify = {
                //             [table]: { [field]: localModel[table][field] },
                //         }
                //     }
                // }
            }
        }

        return newMigration
    }
    createObjectFromLocalModels(
        data: WayuModelStatic<DataTypesRecord>[]
    ): Record<string, Record<string, DataTypesRecord>> {
        const formated = data.map((m) => m.getFormatedData())
        return formated.reduce((obj, item) => {
            return { ...obj, ...item }
        }, {}) as unknown as Record<string, Record<string, DataTypesRecord>>
    }
    createObjectFromMigrationsModel() {
        const joinMmigrations = this.migrationsData.reduce(
            (previusValue, currentValue) => {
                const data = currentValue.up
                for (const table in data.create) {
                    if (!previusValue[table]) {
                        previusValue[table] = data.create[table]
                    }
                }
                for (const table in data.delete) {
                    if (!previusValue[table]) {
                        previusValue[table] = {}
                    }
                }
                // check modify
                return {
                    ...previusValue,
                }
            },
            {} as Record<string, Record<string, DataTypesRecord>>
        )
        return joinMmigrations
    }

    private lastMigrationInDb(): Promise<string | null> {
        return new Promise((resolve) => {
            const conectionsPath = path.resolve(
                'src/migrate_generation/connection/mysql'
            )
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const connection = require(conectionsPath).default
            connection.connect(function (err: { stack: string }) {
                if (err) {
                    throw err
                }
                connection.query(
                    'SHOW TABLES LIKE \'migrations\'',
                    function (err: string) {
                        if (err) {
                            resolve(null)
                        }
                        connection.query(
                            'SELECT *  from migrations ORDER BY id DESC LIMIT 1',
                            function (
                                err: string,
                                result: { id: number; name: string }[]
                            ) {
                                if (err) {
                                    return resolve(null)
                                }
                                if (result.length === 0) {
                                    return resolve(null)
                                }
                                return resolve(result[0].name.split('/')[1])
                            }
                        )
                    }
                )
            })
        })
    }
    private generateDbMigrate = (data: MigrationFormat) => {
        const create = Object.keys(data.create)
            .map((table) => {
                return `db.createTable.bind(db,'${table}', ${JSON.stringify(
                    data.create[table]
                )})`
            })
            .join(',\n')
        const modify = Object.keys(data.modify)
            .map((table) => {
                return `db.alterTable('${table}', ${JSON.stringify(
                    data.modify[table]
                )})`
            })
            .join(',\n')
        const remove = Object.keys(data.delete)
            .map((table) => {
                return `db.dropTable('${table}')`
            })
            .join(',\n')
        return `
            async.series([
                ${create}
                ${modify}
                ${remove}
            ], callback);
        `
    }
    private generateMigrationFile = async (
        migrationToApply: MigrationFileFormat
    ) => {
        try {
            const updateModel = this.generateDbMigrate(migrationToApply.up)
            const downgradeModel = this.generateDbMigrate(migrationToApply.down)
            const filePath =
                path.resolve('migrations') +
                '/' +
                migrationToApply.currentVersion +
                '.js'
            const sql = this.basedDBmigrationFile(updateModel, downgradeModel)
            await fs.writeFileSync(filePath, sql)
            return migrationToApply.currentVersion
        } catch (error) {
            throw new Error(error as string)
        }
    }
    private generateMigrationsFiles = async (
        lastMigrationDb: string | null
    ): Promise<string> => {
        try {
            const migrationToApply = this.migrationsData.find(
                (m) => m.lastVersion === lastMigrationDb
            ) as MigrationFileFormat
            if (!migrationToApply) {
                return 'Migration already applied'
            }
            const lastMigration = await this.generateMigrationFile(
                migrationToApply
            )
            //return lastMigration
            return this.generateMigrationsFiles(lastMigration)
        } catch (error) {
            return error as string
        }
    }
    async up() {
        // aply migrations to the last version
        const lastMigrationDb = await this.lastMigrationInDb()
        console.log('🚀 ~ file: index.ts ~ line 372 ~ dbMigrateWayu ~ up ~ lastMigrationDb', lastMigrationDb)
        // Get last migration un db
        if (lastMigrationDb === this.lastVersion) {
            console.warn('Not migrations to apply')
            exit()
        }
        const dbMigrationDir = this.migrationPath.replace(
            '__migrations__',
            'migrations'
        )
        fs.mkdirSync(dbMigrationDir)
        await this.generateMigrationsFiles(lastMigrationDb)
        try {
            execSync('db-migrate up', { encoding: 'utf-8' })
        } catch (error) {
            console.error('Error on db-migrate up', error)
            throw new Error(error as string)
        }
        fs.rmSync(path.resolve('migrations'), { force: true, recursive: true })
    }
    async down() {
        // aply migrations to the last version
        const lastMigrationDb = await this.lastMigrationInDb()
        // Get last migration un db
        const dbMigrationDir = this.migrationPath.replace(
            '__migrations__',
            'migrations'
        )
        fs.mkdirSync(dbMigrationDir)
        await this.generateMigrationsFiles(lastMigrationDb)
        // try {
        //     execSync('db-migrate up', { encoding: 'utf-8' })
        // } catch (error) {
        //     console.error('Error on db-migrate up', error)
        //     throw new Error(error as string)
        // }
        fs.rmSync(path.resolve('migrations'), { force: true, recursive: true })
    }
    async create(name?: string) {
        const fileName = name
            ? this.currentVersion + '-' + this.formatName(name)
            : this.currentVersion
        const filePath = this.migrationPath + '/' + fileName + '.js'
        const localModel = this.createObjectFromLocalModels(WayuModel.instances)
        const migrationsModel = this.createObjectFromMigrationsModel()
        const migrationFormatData = this.compareLocalToMigration(localModel, migrationsModel)
        // console.log('🚀 ~ file: index.ts ~ line 416 ~ dbMigrateWayu ~ create ~ migrationFormatData', migrationFormatData)
        // const newFile = this.baseMigrationJsFile(migrationFormatData, fileName)
        // console.log('🚀 ~ file: index.ts ~ line 420 ~ dbMigrateWayu ~ create ~ newFile', newFile)
        fs.writeFileSync(
            filePath,
            this.baseMigrationJsFile(migrationFormatData, fileName)
        )
    }
}

if (process.argv.length === 2) {
    console.error('Expected at least one argument!')
    process.exit(1)
}

// Check Flags

const getArgument = (arg: string, self = true) => {
    const index = process.argv.indexOf(arg)
    if (index === -1) {
        return null
    }
    return self ? process.argv[index] : process.argv[index + 1]
}

function main() {
    const create = getArgument('create', false)
    const update = getArgument('up')
    const donwgrade = getArgument('down')
    const wayu = new dbMigrateWayu()
    if (create) {
        return new Promise<void>((resolve, reject) => {
            try {
                wayu.create(create)
                resolve()
            } catch (error) {
                reject(error)
            }
        }).then(() => {
            console.warn('Migration created')
            exit()
        })
    }
    if (update) {
        return new Promise<void>((resolve, reject) => {
            try {
                resolve(wayu.up())
            } catch (error) {
                reject(error)
            }
        }).then(() => {
            console.warn('Migration done')
            exit()
        })
    }
    if (donwgrade) {
        return new Promise<void>((resolve, reject) => {
            try {
                resolve(wayu.down())
            } catch (error) {
                reject(error)
            }
        }).then(() => {
            console.warn('Downgraded db complete')
            exit()
        })
    }
}

main()
