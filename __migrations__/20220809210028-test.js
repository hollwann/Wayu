
'use strict'
exports.currentVersion = '20220809210028-test'
exports.lastVersion = null
exports.timestamp = 'Tue, 09 Aug 2022 21:00:28 GMT'

exports.up = {
	create: {
		'cities': {
			'city': { 'autoIncrement': false, 'constructor': undefined, 'defaultValue': null, 'getConfig': undefined, 'getValue': undefined, 'length': null, 'notNull': false, 'primaryKey': false, 'type': 'string', 'unique': false },
			'cityId': { 'autoIncrement': true, 'constructor': undefined, 'defaultValue': null, 'getConfig': undefined, 'getValue': undefined, 'length': null, 'notNull': true, 'primaryKey': true, 'type': 'int', 'unique': false },
		},
		'states': {
			'state': { 'autoIncrement': false, 'constructor': undefined, 'defaultValue': null, 'getConfig': undefined, 'getValue': undefined, 'length': null, 'notNull': false, 'primaryKey': false, 'type': 'string', 'unique': false },
			'stateId': { 'autoIncrement': true, 'constructor': undefined, 'defaultValue': null, 'getConfig': undefined, 'getValue': undefined, 'length': null, 'notNull': true, 'primaryKey': true, 'type': 'int', 'unique': false },
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