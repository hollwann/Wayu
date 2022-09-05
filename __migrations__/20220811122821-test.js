
'use strict'
exports.currentVersion = '20220811122821-test'
exports.lastVersion = null
exports.timestamp =  'Thu, 11 Aug 2022 12:28:21 GMT'

exports.up = {
    create: {'states': {'state': { 
                    notNull: true,
type: 'string',


                },
'stateId': { 
                    autoIncrement: true,
primaryKey: true,
type: 'int',


                },
},
'cities': {'city': { 
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
},
    delete: {},
    modify: {},
	
}
exports.down = {
	create: {},
	delete: {},
	modify: {}
}