var express = require('express');
var app = express();

var mongo = require('mongodb');
const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
var assert = require('assert');

const client = mongo.MongoClient(url, {useUnifiedTopology: true});
client.connect();

app.post('/api/login', async (req, res, next) =>
{
    // incoming: _id (username), password
    // outgoing: firstName, lastName, error, message

    const { _id, password} = req.body;

    // Add user info & initialize number of sets to 0 (new user)
    const newUser = { _id:_id, password:password };
    var error = "";

    const db = client.db();
    const results = await db.collection("Users").find({ _id:_id, password:password }).toArray();

    var fn = "";
    var ln = "";

    if ( results.length > 0)
    {
        fn = results[0].name.first;
        ln = results[0].name.last;
    }

    var ret = { firstName:fn, lastName:ln, error:'', message:"Welcome back, " + fn};
    results.status(200).json(ret);    
});

var app = express();