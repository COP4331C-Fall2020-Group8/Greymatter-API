const { json } = require('express');
var express = require('express');
var router = express.Router();
var app = express();

var cors = require('cors');
app.use(cors());

var mongo = require('mongodb');
const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
//var assert = require('assert');

const client = mongo.MongoClient(url, {useUnifiedTopology: true});
client.connect();

router.post('/api/removeSet', async (req, res, next) =>
{
    // incoming: _id (The Set's ID)
    // outgoing: error

    const { id } = req.body;

    var error = "";
    var user_id = [];

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
        var tmp = await db.collection("sets").find(
            {"_id":mongo.ObjectID(id)}
        ).forEach(function(row)
        {
            user_id.push(row.user_id);
        })

        // If no matching ID was found
        if (user_id.length == 0)
        {
            res.status(401).json( {error:"This record doesn't exist. (Invalid ID)"})
            return;
        }

        // Remove document
        const result = db.collection('sets').deleteOne({_id:mongo.ObjectID(id)}, function(err, result)
        {
            if (err != null)
                error = err;
        });

        // Remove one from num_sets
        const updateNumber = db.collection('users').findOneAndUpdate(
            { "_id":user_id[0]},
            { $inc : { "num_sets" : -1 } }
            );
    }
    catch(e)
    {
        error = e.toString();
        res.status(500).json( {error:error} );
        return;
    }

    var ret = { error:error };
    res.status(200).json(ret);

});

module.exports = router;
