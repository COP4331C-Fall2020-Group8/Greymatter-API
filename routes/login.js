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
        router.post('/api/login', async (req, res, next) =>
        {
            const { id, password } = req.body 

            if (id == null || password == null)
            {
                error = "One or more needed fields doesn't exist. Review JSON input (Requires id, password)";
                res.status(400).json({ error:error });
                return;
            }
            
            const User = mongoose.model('Users');

            function retrieveUserLogin(uname, pword, callback)
            {
                User.find({ _id:uname, password:pword }, function(err, users)
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

            retrieveUserLogin(id, password, function(err, user)
            {
                if (err)
                {
                    console.log(err);
                }

                if (user == undefined)
                {
                    res.status(400).json({ error: "Invalid username/password."});
                    return;
                }

                var message = "Welcome back, " + user.name.first + "!";
                console.log(message);
                res.status(200).json({ message:message });
            });            
        })
    })

module.exports = router;