var express = require('express');
var router = express.Router();
var app = express();

var mongo = require('mongodb');
const url = process.env.MONGO_URI;
//var assert = require('assert');

const client = mongo.MongoClient(url, {useUnifiedTopology: true});
client.connect();

router.post('/api/searchCard', async (req, res, next) =>
{
    // incoming: set_id, search
    // outgoing: results[], error

    // returns set's cards compared to search

    var error = "";

    const { set_id /*user_id*/ , search } = req.body;

    var _search = search.trim();
    var status = 200;
    try {
        const db = client.db();
        const results = await db.collection('cards').find({ set_id: set_id }).toArray();
        /*, name: { $regex: '.*' + search + '.*' }, category: { $regex: '.*' + search + '.*' } }, {projection: {user_id:1 , name:1, category:1}})*/
        if (results.length == 0) {
            error = "No results from search.";
            status = 200;
        }
        if(!search){
            var _ret = [];
            for(var i = 0; i < results.length; i++){
                _ret.push(results[i]);
            }
            var ret = { results: _ret, error: error };
            res.status(status).json(ret);
            return;
        }
        else { status = 200; }
        var _ret = [];
        for (var i = 0; i < results.length; i++) {
            var cardfront = results[i].card.front.toLowerCase();
            var cardback = results[i].card.back.toLowerCase();
            if (cardfront.includes(search.toLowerCase()) || cardback.includes(search.toLowerCase()))
                _ret.push(results[i]);
        }
    }
    catch (e) {
        error = e.toString();
        res.status(500).json({ error: error });
        return;
    }
    var ret = { results: _ret, error: error };
    res.status(status).json(ret);
});

module.exports = router;
