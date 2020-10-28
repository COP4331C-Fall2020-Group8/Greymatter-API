var express = require('express');
var router = express.Router();
var app = express();

var mongo = require('mongodb');
const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
//var assert = require('assert');

const client = mongo.MongoClient(url, {useUnifiedTopology: true});
client.connect();

router.post('/api/removeCard', async (req, res, next) =>
{
    // incoming: _id (The Card's ID)
    // outgoing: error

    const { _id } = req.body;

    var error = "";

    try
    {
        const db = client.db();
        const result = db.collection('Cards').deleteOne({_id:mongo.ObjectID(_id)}, function(err, result)
        {
            if (err != null)
                error = err;
        });
    }
    catch(e)
    {
        error = e.toString();
    }

    var ret = { error:error };
    res.status(200).json(ret);
    
});

module.exports = router;