var express = require('express');
var router = express.Router();

const url = 'mongodb+srv://greymatterDB:BGRjw7aR8kfAQq0T@greymatter.we1hx.mongodb.net/GreyMatter?retryWrites=true&w=majority';
const mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

var User;

db.on('error', console.error.bind(console, 'connection:error: '));

db.once('open', function()
{
    console.log("Connection established. Initializing schema...")
    const userSchema = new mongoose.Schema(
        {
            _id: String,
            password: String,
            name: Object,
            num_sets: Number,
            email: String,
            isVerified: Boolean
        });
    
    User = mongoose.model('Users', userSchema);

    console.log("Initialization complete.");
})

module.exports = router;
