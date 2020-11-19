var express = require('express');
var router = express.Router();
var app = express();

var mongo = require('mongodb');
const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
//var assert = require('assert');

const client = mongo.MongoClient(url, {useUnifiedTopology: true});
client.connect();

router.post('/api/updateCard', async (req, res, next) =>
{
    // incoming: id, front, back
    // outgoing: error

    // has to take in card front and back regardless of whether it is being updated or not

    var error = "";
    var ObjectID = require('mongodb').ObjectID;
    const { id , front, back } = req.body;

    //var _search = search.trim();
    var query = { "_id": ObjectID(id) };
    var replacement = {
        $set: {
            "card": {
                "front": front,
                "back": back
            }
        }
    };
    const options = { multi: true };
    try {
        const db = client.db();
        const results = await db.collection('cards').updateOne(query, replacement, options);

        /*if (results == null) { 
            error = "Unable to find Set";
        }*/
        //error = results;
        /*, name: { $regex: '.*' + search + '.*' }, category: { $regex: '.*' + search + '.*' } }, {projection: {user_id:1 , name:1, category:1}})*/
        /*if (results.length == 0) { 
            error = "No results from search.";
        }*/

        //var _ret = [];
        /*for (var i = 0; i < results.length; i++) { 
            var cardfront = results[i].card.front.toLowerCase();
            var cardback = results[i].card.back.toLowerCase();
            if(cardfront.includes(search.toLowerCase()) || cardback.includes(search.toLowerCase()))
                _ret.push(results[i]);
        }*/
    }
    catch (e) {
        error = e.toString();
        res.status(500).json({ error: error })
        return;
    }
    var ret = { error: error };
    res.status(200).json(ret);
});

module.exports = router;
