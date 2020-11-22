var express = require('express');
var router = express.Router();

const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
const mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection:error: '));

db.once('open', function()
{
	router.get('/confirmation/:token', async (req, res) => {
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

		const Token = mongoose.model('Tokens');
		const User = mongoose.model('Users');

		console.log(req.params.token);
		// Find a matching token
		Token.findOne({ token: req.params.token }, function (err, token) {
			if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

			// If we found a token, find a matching user
			User.findOne({ _id: token._userId }, function (err, user) {
				if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
				if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

				// Verify and save the user
				user.isVerified = true;
				user.save(function (err) {
					if (err) { return res.status(500).send({ msg: err.message }); }
					res.status(200).send("The account has been verified. Please log in.");
				});
			});
		});
	});
});

module.exports = router;
