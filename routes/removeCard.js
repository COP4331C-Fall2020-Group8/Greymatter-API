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
    var set_id = [];

    try
    {
        const db = client.db();

        // Find results
        var tmp = await db.collection("Cards").find(
            {"_id":mongo.ObjectID(_id)}
        ).forEach(function(row)
        {
            console.log(row.set_id)
            set_id.push(row.set_id);
        })

        // If no matching ID was found
        if (set_id.length == 0)
        {
            res.status(400).json( {error:"This record doesn't exist. (Invalid ID)"})
            return;
        }

        const result = db.collection('Cards').deleteOne({_id:mongo.ObjectID(_id)}, function(err, result)
        {
            if (err != null)
                error = err;
        });

        // Remove one from num_sets
        const updateNumber = db.collection('Sets').findOneAndUpdate(
            { "_id":mongo.ObjectID(set_id[0])},
            { $inc : { "num_cards" : -1 } }
            );
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