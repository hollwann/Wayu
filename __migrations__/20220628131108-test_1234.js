'use strict'
exports.currentVersion = '20220628131108-test_1234'
exports.lastVersion = '20220628131107-test_123'
exports.timestamp = '2022-07-18T13:37:01.987Z'

exports.up = {
    create: {
        cats: {
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
        cats: {},
    },
    modify: {},
}
