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
        // POST request
        router.post('/api/getSetID', async (req, res, next) =>
        {
            // Needed values
            const { id, name } = req.body 

            // Checks if payload is missing fields.
            if (id == null || name == null)
            {
                error = "One or more needed fields doesn't exist. Review JSON input (Requires id, name)";
                res.status(400).json({ error:error });
                return;
            }
            
            // Retrieve schema defined in init.js
            const User = mongoose.model('Sets');

            // Function to get login results
            function retrieveSetID(uname, name, callback)
            {
                User.find({ user_id:uname, name:name }, function(err, sets)
                {
                    if (err)
                    {
                        callback(err, null);
                    }
                    else
                    {
                        callback(null, sets[0]);
                    }
                })
            }

            // Get login results
            retrieveSetID(id, name, function(err, set)
            {
                if (err)
                {
                    console.log(err);
                }

                // No username & pasword found
                if (set == undefined)
                {
                    res.status(400).json({ error: "No sets found with those inputs."});
                    return;
                }

                // Successful login
                var setid = set._id;
                res.status(200).json({ set_id:setid });
            });            
        })
    })

module.exports = router;