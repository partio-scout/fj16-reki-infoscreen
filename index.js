var express = require('express');
var Promise = require('bluebird');
var request = require('superagent');
require('superagent-as-promised')(request);

var app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', function(req, res) {
  Promise.all([
    getCount(),
    getCount('Humina'),
    getCount('Hurma'),
    getCount('Polte'),
    getCount('Raiku'),
    getCount('Syke'),
    getCount('Unity'),
    getCount('Riehu')
  ]).then(function(counts) {
    var allCamp = counts[0];
    var subcamps = counts.splice(1);
    res.render('main', {
      allCamp: allCamp,
      subcamps: subcamps,
    });
  }).catch(function(err) {
    console.error(err);
    res.render('error');
  })
});

function getCount(subcamp) {
  var url = process.env.ENDPOINT;
  if (subcamp) {
    url += '?subCamp=' + subcamp;
  }
  return request.get(url)
    .then(function(response) {
      return {
        count: response.body.amount,
        subcamp: subcamp
      };
    });
}

app.listen(process.env.PORT || 4000, function() {
  console.log('Running...');
});
