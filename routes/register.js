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

    // Add user info & initialize number of sets to 0 (new user)
    const newUser = { _id:_id, password:password,  name:name, numsets:0,
                    email:email};
    var error = "";

    try
    {
        const db = client.db();
        const result = db.collection('Users').insertOne(newUser);
    }
    catch(e)
    {
        error = e.toString();
    }

    var ret = { error:error };
    res.status(200).json(ret);
    
});

module.exports = router;