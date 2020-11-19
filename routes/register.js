var express = require('express');
var router = express.Router();

var error = "";
var errArray;

const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
const mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection:error: '));

db.once('open', function()
    {
        // POST request only
        router.post('/api/register', async (req, res, next) =>
        {
            // Needed values
            const { id, password, name, email } = req.body

            // Checks if payload is missing fields.
            if (id == null || password == null || name == null || email == null)
            {
                error = "One or more needed fields doesn't exist. Review JSON input (Requires id, password, name, email)";
                res.status(400).json({ error:error });
                return;
            }

            // Retrieve schema defined in init.js
            const User = mongoose.model('Users');

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
                // Everything went fine
				error = "";
                var ret = { error: error };
                res.status(200).json(ret);
            })
        })
    })

module.exports = router;
