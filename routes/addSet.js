var express = require('express');
var router = express.Router();
var app = express();

var mongo = require('mongodb');
const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
//var assert = require('assert');

const client = mongo.MongoClient(url, {useUnifiedTopology: true});
client.connect();

router.post('/api/addSet', async (req, res, next) =>
{
    // incoming: user_id (username), name, num_cards (default 0), category
    // outgoing: error

    const { user_id, name, category } = req.body;

    // Add user info & initialize number of sets to 0 (new user)
    const newSet = { user_id:user_id,  name:name, num_cards:0, category:category };
    var error = "";

    try
    {
        const db = client.db();
        const result = db.collection('Sets').insertOne(newSet);
    }
    catch(e)
    {
        error = e.toString();
    }

    var ret = { error:error };
    res.status(200).json(ret);
    
});

module.exports = router;