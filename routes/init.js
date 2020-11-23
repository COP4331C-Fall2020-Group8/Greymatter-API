var express = require('express');
const { ObjectID } = require('mongodb');
var router = express.Router();

const url = process.env.MONGO_URI;
const mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection:error: '));

// Intitialize schema for future use.
db.once('open', function()
{
    console.log("Connection established. Initializing schema...")
    const userSchema = new mongoose.Schema(
        {
            _id: String,
            password: String,
            name: Object,
            num_sets: Number,
            email: String,
            isVerified: Boolean,
			salt: String
        });

    mongoose.model('Users', userSchema);

    const setSchema = new mongoose.Schema(
        {
            _id: ObjectID,
            user_id: String,
            name: String,
            num_cards: Number,
            category: String
        });

    mongoose.model('Sets', setSchema);

	const tokenSchema = new mongoose.Schema(
		{
			_userId: {
				type: String,
				required: true
			},
			token: {
				type: String,
				required: true
			},
			createdAt: {
				type: Date,
				required: true,
				default: Date.now,
				expires: 43200
			}
		});

	mongoose.model('Tokens', tokenSchema);

    console.log("Initialization complete.");
})

module.exports = router;
