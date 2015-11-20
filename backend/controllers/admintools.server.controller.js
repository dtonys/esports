/**
 * Created by Joseph on 11/19/2015.
 */
'user strict';


var PythonShell = require('python-shell');

/**
 * Scrapes esportlivescore.com for infos
 */
exports.scrapeELS = function(req, res) {
  console.log('going');

  PythonShell.run('./scripts/scraper_esportlivescore.py',
    {mode:'json'},
    function(err, results) {
      if (err) {
        return res.status(400).send({message: err, stacktrace:err.stack});
      } else {
        console.log('results:' + results);


        res.jsonp(results);
    }

  });


  //var path = 'ty_notstarted.html';
  //
  //scrapeELSPage(path);
};
