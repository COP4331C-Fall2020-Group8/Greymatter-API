var express = require('express');
var router = express.Router();

var crypto = require('crypto');

var error = "";
var errArray;

const url = process.env.MONGO_URI;
const mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection:error: '));

db.once('open', function()
    {
        // POST request
        router.post('/api/login', async (req, res, next) =>
        {
            // Needed values
            const { id, password } = req.body

            // Checks if payload is missing fields.
            if (id == null || password == null)
            {
                error = "One or more needed fields doesn't exist. Review JSON input (Requires id, password)";
                res.status(400).json({ error:error });
                return;
            }

            // Retrieve schema defined in init.js
            const User = mongoose.model('Users');

            // Function to get login results
            function retrieveUserLogin(uname, callback)
            {
                User.find({ _id:uname }, function(err, users)
                {
                    if (err)
                    {
                        callback(err, null);
                    }
                    else
                    {
                        callback(null, users[0]);
                    }
                })
            }

            // Get login results
            retrieveUserLogin(id, function(err, user)
            {
                if (err)
                {
                    console.log(err);
                }

				var hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');

                // No username & pasword found
                if (user == undefined || hash !== user.password)
                {
                    res.status(401).json({ error: "Invalid username/password."});
                    return;
                }

				if (!user.isVerified)
				{
					res.status(402).send({ error: 'Your account has not been verified.' });
					return;
				}

                // Successful login
                var message = "Welcome back, " + user.name.first + "!";
                console.log(message);
                res.status(200).json({ message:message });
            });
        })
    })

module.exports = router;
