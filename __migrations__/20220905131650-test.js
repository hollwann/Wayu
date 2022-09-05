
'use strict'
exports.currentVersion = '20220905131650-test'
exports.lastVersion = null
exports.timestamp = 'Mon, 05 Sep 2022 13:16:50 GMT'

exports.up = {
    create: {
        'cities': {
            'city': {
                notNull: true,
                type: 'string',
            },
            'cityId': {
                autoIncrement: true,
                primaryKey: true,
                type: 'int',
                unique: true,

            },
        },
        'states': {
            'state': {
                notNull: true,
                type: 'string',
            },
            'stateId': {
                autoIncrement: true,
                primaryKey: true,
                type: 'int',
            },
        },
    },
    delete: {},
    modify: {},

}
exports.down = {
    create: {},
    delete: {},
    modify: {},
}