# TwitterAPINodeJS
Search tweets via Twitter API and store the tweets in MySQL table 

This project is for NTU assignment CZ4034-INFORMATION RETRIEVAL<br />

npm install dependencies<br />
https://www.npmjs.com/package/flexqp-transaction<br />
https://www.npmjs.com/package/moment<br />
https://www.npmjs.com/package/twitter <br />

#Refer to index.js at ./routes/index.js<br />

Include this at the top of the file <br />
var qp = require('flexqp-transaction');  <br />
qp.presetConnection(require('../dbconfig.json'));  <br />
var testdbconfig = require('../dbconfig.json');  <br />
var moment = require("moment");  <br />
var Twitter = require('twitter');  <br />

Edit dbconfig.json at root folder <br />
Example: <br />
{<br />
    "host" : "127.0.0.1", <br />
    "user" : "root", <br />
    "password" : "password@123", <br />
    "database" : "test" <br />

} <br />

Setup Application authentication at ./routes/index.js <br />
var client = new Twitter({ <br />
  consumer_key: 'XXX', <br /> 
  consumer_secret: 'XXX', <br />
  bearer_token: 'XXX' <br />
});<br />

Setup query date range in queryAPI function 
