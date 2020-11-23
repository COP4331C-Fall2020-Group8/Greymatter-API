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
    
    var error = "";
    if (user_id == null)
    {
        // (Requires: user_id, name, category)
        error = "One or more needed fields are null. Check that your JSON Payload has the correct variables.";
        res.status(400).json({ error:error });
        return;
    }

    if (category == null || name == null)
    {
        error = "No Topic added. Topic name and Category name cannot be left empty.";
        res.status(400).json({ error:error });
        return;
    }

    // Add user info & initialize number of sets to 0 (new user)
    const newSet = { user_id:user_id,  name:name, num_cards:0, category:category };


    try
    {
        const db = client.db();
        const result = db.collection('sets').insertOne(newSet);

        // Add one from num_sets
        const updateNumber = db.collection('users').findOneAndUpdate(
            { "_id":user_id},
            { $inc : { "num_sets" : 1 } }
            );

    }
    catch(e)
    {
        error = e.getMessage();
        res.status(500).json( {error:error} );
        return;
    }

    var ret = { error:error };
    res.status(200).json(ret);
    
});

module.exports = router;