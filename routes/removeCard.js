var express = require('express');
var router = express.Router();
var app = express();

var mongo = require('mongodb');
const url = process.env.MONGO_URI;
//var assert = require('assert');

const client = mongo.MongoClient(url, {useUnifiedTopology: true});
client.connect();

router.post('/api/removeCard', async (req, res, next) =>
{
    // incoming: id (The Card's ID)
    // outgoing: error

    const { id } = req.body;

    var error = "";
    var set_id = [];

    if (id == null)
    {
        error = "One or more needed fields are null. Check that your JSON Payload has the correct variables. (Requires: id)";
        res.status(400).json({ error:error });
        return;
    }

    try
    {
        const db = client.db();

        // Find results
        var tmp = await db.collection("cards").find(
            {"_id":mongo.ObjectID(id)}
        ).forEach(function(row)
        {
            console.log(row.set_id)
            set_id.push(row.set_id);
        })

        // If no matching ID was found
        if (set_id.length == 0)
        {
            res.status(401).json( {error:"This record doesn't exist. (Invalid ID)"})
            return;
        }

        const result = db.collection('cards').deleteOne({_id:mongo.ObjectID(id)}, function(err, result)
        {
            if (err != null)
                error = err;
        });

        // Remove one from num_sets
        const updateNumber = db.collection('sets').findOneAndUpdate(
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
