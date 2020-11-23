var express = require('express');
var router = express.Router();

var crypto = require('crypto');

var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var error = "";

const url = process.env.MONGO_URI;
const mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection:error: '));

db.once('open', function()
	{
		router.post('/api/forgotPassword', async (req, res, next) =>
			{
				error = "";

				// Needed values
				const { id } = req.body

				if (id == null)
				{
					error = "No user specified.";
					res.status(400).json({ error:error });
					return;
				}

				const User = mongoose.model('Users');
				const Token = mongoose.model('Tokens');


				User
					.findOne({ _id: id })
					.then(function (user) {
						if (!user)
						{
							error = "No user found with that username";
							res.status(400).json({ error:error });
							return;
						}

						var token = new Token({ _userId: id, token: crypto.randomBytes(16).toString('hex') });

						token.save(function (err)
						{
							if (err) { return res.status(500).send({ msg: err.message }); }

							var message = {
								to: user.email,
								from: 'noreplygreymatter@gmail.com',
								subject: 'Reset your Grey Matter password',
								text: 'Hello, \n\n' + 'Please reset your password by clicking the link: \nhttp:\/\/grey-matter.netlify.app\/resetPassword\/' + id + '\/' + token.token + '\n'
							};

							sgMail
								.send(message)
								.then(() => {
									res.status(200).json({ msg: 'A verification email has been sent to ' + user.email + '.' });
								})
								.catch((error) => {
									return res.status(500).send({ msg: error.message });
								})
						})
					})


			})
	})

module.exports = router;
