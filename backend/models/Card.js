const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cardSchema = new Schema({
	user_id: {
		type: String,
		required: true
	},
	set_id: {
		type: ObjectId,
		required: true
	},
	card: [{
		front: String,
		back: String
	}]
}, {
	collection: 'Cards'
})

module.exports = mongoose.model('Card', cardSchema)
