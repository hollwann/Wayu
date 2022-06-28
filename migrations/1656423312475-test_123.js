exports.currentVersion = "1656423312475-test_123"
exports.lastVersion = "20220628131106-add-pets"
exports.timestamp = "2022-06-28T13:35:12.475Z"

exports.up = {
    create: {
        owner: {
            id: { type: 'int', primaryKey: true },
            name: 'string'
        }
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