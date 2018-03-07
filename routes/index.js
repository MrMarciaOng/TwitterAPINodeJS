var express = require('express');
var router = express.Router();

var qp = require('flexqp-transaction');
qp.presetConnection(require('../dbconfig.json'));
var testdbconfig = require('../dbconfig.json');
var moment = require("moment")
var Twitter = require('twitter');

/* GET home page. */
router.get('/', function (req, res, next) {
  qp.executeAndFetch('SELECT * FROM test.laptop', [], function (error, result) {
    if (error) {
      error.status = 406;
      return next(error);
    }
    res.json(result);
  })

});



var client = new Twitter({
  consumer_key: 'xxx',
  consumer_secret: 'xxx',
  bearer_token: 'xxx'
});

router.get('/test', async function (req, res, next) {

  var searchQuery = {};
  // var fromDate = new Date('2018-02-01');
  // var toDate = new Date('2018-02-28');
  // let temptoDate = moment(toDate);
  // let tempfromDate = moment(fromDate);

  var tweets = await queryAPI(null);
  console.log(tweets);

  await saveToDb(tweets);
 
  do {
    tweets = await queryAPI(tweets.next);
    console.log(tweets);
    await saveToDb(tweets);
    console.log(tweets.next);
  } while (tweets.next != null)

});

function queryAPI(nextTEXT) {
  return new Promise((resolve, reject) => {

    var fromDate = new Date('2017-12-01');
    var toDate = new Date('2017-12-31');
    let temptoDate = moment(toDate);
    let tempfromDate = moment(fromDate);

    if (nextTEXT != null) {

      client.get('tweets/search/30day/IRcrawl30.json', { query: 'lang:en gun control #guncontrol', maxResults: '100', next: nextTEXT }, function (error, tweets, response) {

        if (error) {
          reject(error);
          return
        }
        else {
          resolve(tweets);

        }
      });
    } else {

      client.get('tweets/search/30day/IRcrawl30.json', { query: 'lang:en gun control #guncontrol', maxResults: '100' }, function (error, tweets, response) {

        if (error) {
          reject(error);
          return
        }
        else {
          resolve(tweets);

        }
      });

    }

  })
}


async function saveToDb(tweets) {

  for (let x = 0; x < tweets.results.length; x++) {
    var connection = await qp.connectWithTbegin();
    console.log(x);
    if (x == 53) {
      console.log(x);
    }
    try {

      var data = {};
      // id, text, user_lang, lang, retweet_count, created_at, full_text, hashtags, user_screenname
      data.id = tweets.results[x].id;
      data.text = tweets.results[x].text;
      data.user_lang = tweets.results[x].user.lang;
      data.user_screenname = tweets.results[x].user.screen_name;
      data.lang = tweets.results[x].lang;
      data.retweet_count = tweets.results[x].retweet_count;
      let now = moment(tweets.results[x].created_at);
      data.created_at = now.format("YYYY-MM-DD HH:MM:SS");
      if (tweets.results[x].entities.hashtags.length != 0) {
        var tempString = '';
        for (let u = 0; u < tweets.results[x].entities.hashtags.length; u++) {
          tempString += tweets.results[x].entities.hashtags[u].text;
          tempString += ","
        }
        data.hashtags = tempString;
      }
      var resultbefore = await qp.execute('select *  from test.gc where id = ? ', [data.id], connection);
      if (resultbefore.length == 0) {
        var result = await qp.execute('insert into test.gc set ?', [data], connection);
      }



      qp.commitAndCloseConnection(connection);

    }
    catch (error) {
      qp.rollbackAndCloseConnection(connection);

      console.log(error);

    }
  }

}

// var schedule = require('node-schedule');
// var counter = 0; 
// var j = schedule.scheduleJob('0 * * * * *', async function () {
//   var connection = await qp.connectWithTbegin();
//   try{
//       var result = await qp.execute('insert into test.laptop set speed = ?', [counter], connection);
//       counter++;
//       var result2 = await qp.execute('select  * from test.laptop where model = ? ', [result.insertId], connection);
//       console.log("model"+result2[0].model + " speed "+ result2[0].speed);
//       qp.commitAndCloseConnection(connection);

//   }
//   catch(error){
//       qp.rollbackAndCloseConnection(connection);
//       error.status = 406;
//      console.log("ERROR");
//   }
// });

module.exports = router;
