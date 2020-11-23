var express = require('express');
var router = express.Router();

var crypto = require('crypto');

const url = process.env.MONGO_URI;
const mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection:error: '));

db.once('open', function()
{
	router.post('/api/resetPassword', async (req, res) => {
		/*
		req.assert('email', 'Email is not valid').isEmail();
		req.assert('email', 'Email cannot be blank').notEmpty();
		req.assert('token', 'Token cannot be blank').notEmpty();
		req.sanitize('email').normalizeEmail({ remove_dots: false });
		*/

		/*
		// Check for validation errors
		var errors = req.validationErrors();
		if (errors) return res.status(400).send(errors);
		*/

		const { id, password, token } = req.body;

		const Token = mongoose.model('Tokens');
		const User = mongoose.model('Users');

		console.log(token);
		// Find a matching token
		Token.findOne({ token: token }, function (err, token) {
			if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

			// If we found a token, find a matching user
			User.findOne({ _id: token._userId }, function (err, user) {
				if (!user) return res.status(401).send({ msg: 'We were unable to find a user for this token.' });

				// Verify and save the user
				const salt = crypto.randomBytes(16).toString('hex');
				const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
				user.password = hashedPassword;
				user.save(function (err) {
					if (err) { return res.status(500).send({ msg: err.message }); }
					res.status(200).send({ msg: "Your password has been updated. Please log in." });
				});
			});
		});
	});
});

module.exports = router;
