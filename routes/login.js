var express = require('express');
var router = express.Router();
var app = express();

var mongo = require('mongodb');
const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
//var assert = require('assert');

const client = mongo.MongoClient(url, {useUnifiedTopology: true});
client.connect();

router.post('/api/login', async (req, res, next) =>
{
    // incoming: _id (username), password
    // outgoing: firstName, lastName, error, message

    const { _id, password} = req.body;
    
    if (_id == null || password == null)
    {
    
        error = "One or more needed fields are null. Check that your JSON Payload has the correct variables. (Requires: _id, password)";
        res.status(400).json({ error:error });
        return;
    }
    
    // Add user info & initialize number of sets to 0 (new user)
    const newUser = { _id:_id, password:password };
    var error = "";

    const db = client.db();
    const results = await db.collection("Users").find({ _id:_id, password:password }).toArray();

    var fn = "";
    var ln = "";


    if ( results.length > 0)
    {
        fn = results[0].name.first;
        ln = results[0].name.last;
    }
    else
    {
        error = "Invalid username/password.";
        res.status(200).json(ret);
    }

    var ret = { firstName:fn, lastName:ln, error:'', message:"Welcome back, " + fn};
    res.status(200).json(ret);    
});

module.exports = router;