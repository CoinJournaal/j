var express = require("express"),
    app = express();
var fs = require("fs");
const translate = require('google-translate-api');
var steem = require('steem');
var https = require('https');

var port = process.env.PORT || 5000;

global.res1;

app.use(express.static(__dirname + '/public'));

app.get("/sayHello", function (request, response) {
  var user_name = request.query.user_name;
  //postArticle(request.query.postingKey,'Auto-generated Steemit Post Test','auto-generated-steemit-post-test','Dit is een test. Excuus voor de spam.','test','api');
  response.end("Hello " + user_name + "!");
});

app.get("/tl", function (request, response) {
    translate('This is a test', {from: 'en', to: 'nl'}).then(res => {
        console.log(res.text);
        //=> Ik spreek Nederlands!
        console.log(res.from.text.autoCorrected);
        //=> true
        console.log(res.from.text.value);
        //=> I [speak] Dutch!
        console.log(res.from.text.didYouMean);
        //=> false
    }).catch(err => {
        console.error(err);
    });
});

app.get("/cp", function (request, response) {
    var url = 'https://cryptopanic.com/api/posts/?auth_token=31dc4817cba448911e694b5c2437c5215c6fbaaf&filter=bullish';

    https.get(url, function(res){
        var body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            var cpResponse = JSON.parse(body);
            console.log("Got a response: ", cpResponse.count);
            
            
            var keysArray = Object.keys(cpResponse.results);
            for (var i = 0; i < 5; i++) {
               var key = keysArray[i]; // here is "name" of object property
               var value = cpResponse.results[key]; // here get value "by name" as it expected with objects
               console.log(key, value);
            }
            
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
});

app.listen(port);
console.log("Listening on port ", port);

var postArticle = function (postingKey, title, permlink, article, tag1, tag2)
{
  steem.broadcast.comment(
    postingKey, // posting wif
    '', // author, leave blank for new post
    tag1, // first tag
    'CoinJournaal', // username
    permlink, // permlink
    title, // Title
    article, // Body of post
    // json metadata (additional tags, app name, etc)
    { tags: [tag2], app: 'steemjs' },
    function (err, result) {
      if (err)
        alert('Failure! ' + err);
      else
        alert('Success!');
    }
  );
}
