const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let setSchema = new Schema({
	user_id: {
		type: String,
		required: true
	},
	num_cards: {
		type: Number,
		default: 0
	},
	category: String
}, {
	collection: 'Sets'
})

module.exports = mongoose.model('Set', setSchema)
