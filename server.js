// TODO filter reddit, write to file

var express = require("express"),
    app = express();
var fs = require("fs");
const translate = require('google-translate-api');
var steem = require('steem');
var https = require('https');
var http = require('http');
var google = require('google');

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
    var url = 'https://cryptopanic.com/api/posts/?auth_token='+ request.query.cptoken +'&filter=bullish';

    https.get(url, function(res){
        var body = '';
        
        var title = new Array();

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            var cpResponse = JSON.parse(body);
            console.log("Got a response: ", cpResponse.count);
            
            
            var keysArray = Object.keys(cpResponse.results);
            for (var i = 0; i < 3; i++) {
               var key = keysArray[i]; // here is "name" of object property
               var value = cpResponse.results[key]; // here get value "by name" as it expected with objects
               //console.log(key, value);
                
                var keysArray2 = Object.keys(value);
                var domainKey = keysArray2[0];
                var titleKey = keysArray2[3];
               // console.log("Domain " + value[domainKey]);
                console.log("Title " + i + " "+ value[titleKey]);
                
                if(value[domainKey].indexOf("reddit") == -1) { // filter Reddit posts
                    console.log("niet gefilterd");
                    title.push(value[titleKey]);
                    google.resultsPerPage = 5;
                    google.timeSpan = 'd'; // information indexed in the past day 
                    
                    google.number = i;

                    google(value[domainKey] + ' ' + value[titleKey], function (err, res){
                      if (err) console.error(err)

                      for (var j = 0; j < res.links.length; ++j) {
                        var link = res.links[j];
                        if(link.title.indexOf("News for") !== 0) { // filter News for items without links
                            console.log("");
                            //console.log("Title " + value[titleKey]);
                            console.log("Google HREF " + link.href);
                            //console.log("Link " + link.link);
                            
                            http.number = google.number;                            
                            
                            http.get('http://api.smmry.com/&SM_API_KEY='+request.query.smmrytoken+'&SM_LENGTH=1&SM_URL='+link.href, function(res){
                                var body = '';
                                
                                res.number = http.number;

                                res.on('data', function(chunk){
                                    body += chunk;
                                });

                                res.on('end', function(){
                                    var smmryResponse = JSON.parse(body);
                                    // check undefined
                                    if (typeof smmryResponse.sm_api_title != 'undefined') {
                                        console.log("Doorgeef Title " + title[res.number]);
                                        console.log("Smmry Title " + smmryResponse.sm_api_title);
                                        console.log("Smmry Content " + smmryResponse.sm_api_content);
                                    }
                                    else {
                                        console.log("smmry undefined");
                                    }
                               
                                    /*var keysArray3 = Object.keys(smmryResponse);
                                      for(var k = 0; k < keysArray3.length; ++k) {
                                          var key2 = keysArray3[k];
                                          var value2 = smmryResponse[key2];
                                        console.log(key2, value2);
                                      }*/
                                });
                            });
                            
                            break;
                            /* console.log(link.title + ' - ' + link.href)
                            console.log(link.description + "\n")

                              var keysArray3 = Object.keys(link);
                              for(var k = 0; k < keysArray3.length; ++k) {
                                  var key2 = keysArray3[k];
                                  var value2 = link[key2];
                                console.log(key2, value2);
                              }*/

                        }
                      }
                    });
                }
                else {
                    console.log("Filtered Reddit Post");
                }
            }
            
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
    response.end("Done");
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
