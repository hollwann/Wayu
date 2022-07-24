'use strict'
exports.currentVersion = '20220628131107-test_123'
exports.lastVersion = '20220628131106-add-pets'
exports.timestamp = '2022-06-28T13:35:12.475Z'

exports.up = {
    create: {
        owner: {
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
        owner: {},
    },
    modify: {},
}