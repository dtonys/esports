'use strict';
/**
 * Created by Joseph on 11/19/2015.
 */

var PythonShell = require('python-shell'),
  sbfuncs = require('./sbfuncs.js');

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
        var matchlist = [];
        for (var i = 0; i < results.length; i++)
        {
          matchlist.push(sbfuncs.createMatch(results[i]));
        }
        //console.log('results:' + results);

        res.jsonp(matchlist);
    }

  });


  //var path = 'ty_notstarted.html';
  //
  //scrapeELSPage(path);
};
