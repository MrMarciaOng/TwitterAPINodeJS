# TwitterAPINodeJS
Search tweets via Twitter API and store the tweets in MySQL table 

npm install dependencies
https://www.npmjs.com/package/flexqp-transaction
https://www.npmjs.com/package/moment
https://www.npmjs.com/package/twitter

#Refer to index.js at ./routes/index.js

Include this at the top of the file
var qp = require('flexqp-transaction');
qp.presetConnection(require('../dbconfig.json'));
var testdbconfig = require('../dbconfig.json');
var moment = require("moment")
var Twitter = require('twitter');

Edit dbconfig.json at root folder 
Example: 
{
    "host" : "127.0.0.1",
    "user" : "root",
    "password" : "password@123",
    "database" : "test"

}

Setup Application authentication at ./routes/index.js
var client = new Twitter({
  consumer_key: 'XXX',
  consumer_secret: 'XXX',
  bearer_token: 'XXX'
});

Setup query date range in queryAPI function 
