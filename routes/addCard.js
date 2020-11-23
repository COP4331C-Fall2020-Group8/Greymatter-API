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
    var search = [];

    if (user_id == null || set_id == null || card == null)
    {
        //  (Requires: user_id, set_id, card)
        error = "One or more needed fields are null. Check that your JSON Payload has the correct variables.";
        res.status(400).json({ error:error });
        return;
    }

    try
    {
        const db = client.db();
        
        // Find results
        var tmp = await db.collection("sets").find(
        {"_id":mongo.ObjectID(set_id)}
        ).forEach(function(row)
        {
            search.push(row.user_id);
        })
            
        // If no matching ID was found
        if (search.length == 0)
        {
            res.status(401).json( {error:"There is no such Set ID. (Invalid ID)"})
            return;
        }
        
        const updateNumber = db.collection('sets').findOneAndUpdate(
            { "_id":mongo.ObjectID(set_id)},
            { $inc : { "num_cards" : 1 } }
            );
        
        const result = db.collection('cards').insertOne(newCard);



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