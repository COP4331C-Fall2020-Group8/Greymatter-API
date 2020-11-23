var express = require('express');
var router = express.Router();

var crypto = require('crypto');

var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var error = "";
var errArray;

const url = process.env.MONGO_URI;
const mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection:error: '));

db.once('open', function()
    {
        // POST request only
        router.post('/api/register', async (req, res, next) =>
        {
			error = "";
            // Needed values
            const { id, password, name, email } = req.body

            // Checks if payload is missing fields.
            if (id == null || password == null || name == null || email == null)
            {
                error = "One or more needed fields doesn't exist. Review JSON input (Requires id, password, name, email)";
                res.status(400).json({ error:error });
                return;
            }

			// Validate email
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(email))
			{
				error = "Email address is not valid. Please try again with a valid email address.";
				res.status(402).json({ error:error });
				return;
			}

            // Retrieve schema defined in init.js
            const User = mongoose.model('Users');
			const Token = mongoose.model('Tokens');

            // Define new user to ad to DB
            const newUser = new User(
                {_id: id, password: password, name: name, num_sets: 0,
                email: email, isVerified: false});

            // Add document to users collection
            newUser.save(function (err, newUser)
            {
                if (err)
                {
                    error = err;

                    // This code is for duplicate _id keys
                    if (err.code == 11000)
                    {
                        res.status(401).json({ error: "That username is taken."});
                        return;
                    }

                    res.status(500).json({ error:error });
                    return;
                }

				var token = new Token({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });

				token.save(function (err)
				{
					if (err) { return res.status(500).send({ msg: err.message }); }

					var message = {
						to: newUser.email,
						from: 'noreplygreymatter@gmail.com',
						subject: 'Verify your Grey Matter account',
						text: 'Hello, \n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '\n'
					};


					sgMail
						.send(message)
						.then(() => {
							res.status(200).json({ msg: 'A verification email has been sent to ' + newUser.email + '.' });
						})
						.catch((error) => {
							return res.status(500).send({ msg: error.message });
						})
				});
            })
        })
    })

module.exports = router;
