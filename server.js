var express = require("express"),
    app = express();
var fs = require("fs");
const translate = require('google-translate-api');

var port = process.env.PORT || 5000;

global.res1;

app.use(express.static(__dirname + '/public'));

app.get("/sayHello", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

app.listen(port);
console.log("Listening on port ", port);

translate('The European Central Bank has moderated its stance on cryptocurrency regulation Wednesday, Feb. 7, describing it as "Not exactly very high on its to-do list" in a brief interview with CNBC. The ECB\'s Chair of the Supervisory Board Daniele Nouy added that although she had "No clue" whether new regulatory moves on crypto would come from Europe in the future, involvement of ECB-regulated banks in the sphere was "Very, very low".', {from: 'en', to: 'nl'}).then(res => {
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
