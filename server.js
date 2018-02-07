var express = require("express"),
    app = express();
var fs = require("fs");
const translate = require('google-translate-api');
var steem = require('steem');

var port = process.env.PORT || 5000;

global.res1;

app.use(express.static(__dirname + '/public'));

app.get("/sayHello", function (request, response) {
  var user_name = request.query.user_name;
    postArticle(request.query.postingKey,'Auto-generated Steemit Post Test','auto-generated-steemit-post-test','Dit is een test. Excuus voor de spam.','test','api');
  response.end("Hello " + user_name + "!");
});

app.listen(port);
console.log("Listening on port ", port);

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

function postArticle(postingKey, title, permlink, article, tag1, tag2)
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
