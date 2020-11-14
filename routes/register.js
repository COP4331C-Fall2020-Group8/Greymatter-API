var express = require('express');
var router = express.Router();
var app = express();

var mongo = require('mongodb');
const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
//var assert = require('assert');

const client = mongo.MongoClient(url, {useUnifiedTopology: true});
client.connect();

router.post('/api/register', async (req, res, next) =>
{
    // incoming: _id (username), password, name object string (first and last name)
    // outgoing: error

    const { _id, password, name, email} = req.body;

    var isVerified = false;

    // Add user info & initialize number of sets to 0 (new user)
    const newUser = { _id:_id, password:password,  name:name, numsets:0,
                    email:email, isVerified:isVerified};

    var error = "";

    if (_id == null || password == null || name == null || email == null)
    {
    
        error = "One or more needed fields are null. Check that your JSON Payload has the correct variables. (Requires: _id, password, name, email)";
        res.status(400).json({ error:error });
        return;
    }

    try
    {
        const db = client.db();
        const result = db.collection('Users').insertOne(newUser);
    }
    catch(e)
    {
        error = e.toString();
        res.status(500).json({ error:error });
        return;
    }

    var ret = { error:error };
    res.status(200).json(ret);
    
});

module.exports = router;