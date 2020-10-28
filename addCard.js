var express = require('express');
var router = express.Router();
var app = express();

var mongo = require('mongodb');
const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
//var assert = require('assert');

const client = mongo.MongoClient(url, {useUnifiedTopology: true});
client.connect();

router.post('/api/addCard', async (req, res, next) =>
{
    // incoming: user_id (username), set_id
    //          card object string (front and back)
    // outgoing: error

    const { user_id, set_id, card } = req.body;

    // Add user info & initialize number of sets to 0 (new user)
    const newCard = { user_id:user_id,  set_id:set_id, card:card };
    var error = "";

    try
    {
        const db = client.db();
        const result = db.collection('Cards').insertOne(newCard);
    }
    catch(e)
    {
        error = e.toString();
    }

    var ret = { error:error };
    res.status(200).json(ret);
    
});

module.exports = router;