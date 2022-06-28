'use strict';
exports.currentVersion = '20220628131106-add-pets'
exports.lastVersion = null
exports.timestamp = '2022-06-22T17:36:17.893Z'

exports.up = {
    create: {
        pets: {
            id: { type: 'int', primaryKey: true },
            name: 'string'
        },
    },
    delete: {},
    modify: {}
};

exports.down = {
    create: {},
    delete: {
        pets: {},
        owner: {},
    },
    modify: {}
};