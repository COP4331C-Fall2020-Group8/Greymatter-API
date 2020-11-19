var express = require('express');
var router = express.Router();

const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
const mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection:error: '));

db.once('open', function()
{
    router.post('/api/verifyUser', async(req, res, next) =>
    {
        // Needed values
        const { id } = req.body;

        if (id == null)
        {
            error = "One or more needed fields doesn't exist. Review JSON input (Requires id, password, name, email)";
            res.status(400).json({ error:error });
            return;
        }

        const User = mongoose.model('Users');


        function toggleVerify(username, callback)
        {
            User.find({_id:username}, function(err, users)
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

        toggleVerify(id, function(err, user)
        {
            if (err)
            {
                console.log(err);
            }

            if (user == undefined)
            {
                res.status(401).json({ error: "That user doesn't exist."});
                return;
            }

            user.isVerified = true;

            user.save();

            res.status(200).json({error: "User has been verified."});
            return;

        })
    })
})

module.exports = router;