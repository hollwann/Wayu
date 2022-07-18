
exports.currentVersion = "1658151421987-test_1234"
exports.lastVersion = "1656423312475-test_123"
exports.timestamp =  "2022-07-18T13:37:01.987Z"

exports.up = {
	create: {
		cats: {
				id: { type: 'int', primaryKey: true },
				name: 'string'
		}
	},
	delete: {},
	modify: {}
}

exports.down = {
	create: {},
	delete: {},
	modify: {}
}
		