'use strict'
exports.currentVersion = '20220628131106-add-pets'
exports.lastVersion = null
exports.timestamp = '2022-06-22T17:36:17.893Z'

exports.up = {
    create: {
        fish: {
            id: { primaryKey: true, type: 'int' },
            name: 'string',
        },
        pets: {
            id: { primaryKey: true, type: 'int' },
            name: 'string',
        },
    },
    delete: {},
    modify: {},
}

exports.down = {
    create: {},
    delete: {
        fish: {},
        pets: {},

    },
    modify: {},
}