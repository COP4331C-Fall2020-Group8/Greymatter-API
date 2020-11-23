var express = require('express');
var router = express.Router();
var app = express();

var mongo = require('mongodb');
const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
//var assert = require('assert');

const client = mongo.MongoClient(url, {useUnifiedTopology: true});
client.connect();

router.post('/api/searchSet', async (req, res, next) => {
    // incoming: _id, search
    // outgoing: results[], error

    var error = "";
    var status;
    const { user_id, search } = req.body;
    
     if(search == null){
        res.status(200).json({error: error});
        return;
    }
    //var _search = search.trim();
    try {
        const db = client.db();
        const results = await db.collection('sets').find({ user_id: user_id }).toArray();
        /*, name: { $regex: '.*' + search + '.*' }, category: { $regex: '.*' + search + '.*' } }, {projection: {user_id:1 , name:1, category:1}})*/
        if (results.length == 0) {
            error = "No results from search.";
            status = 200;
        }
        else { status = 200; }
        var _ret = [];
        for (var i = 0; i < results.length; i++) {
            var name = results[i].name.toLowerCase();
            var category = results[i].category.toLowerCase();
            if (name.includes(search.toLowerCase()) || category.includes(search.toLowerCase()))
                _ret.push(results[i]);
        }
    }
    catch (e) {
        error = e.toString();
        res.status(500).json({ error: error })
        return;
    }
    var ret = { results: _ret, error: error };
    res.status(status).json(ret);
});

module.exports = router;
