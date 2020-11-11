const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
	_id: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	name: [{
		first: String,
		last: String
	}],
	email: {
		type: String,
		unique: true
	},
	num_sets: {
		type: Number,
		default: 0
	}
}, {
	collection: 'Users'
})

modules.exports = mongoose.model('User', userSchema)

