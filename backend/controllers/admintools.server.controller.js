'use strict';
/**
 * Created by Joseph on 11/19/2015.
 */

var PythonShell = require('python-shell'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Match = mongoose.model('Match'),
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
        var repeatcount = 0;
        for (var i = 0; i < results.length; i++)
        {
          sbfuncs.createMatch(results[i], function(cm_res) {

            //if it's a non-empty object
            if (!_.isEmpty(cm_res))
            {
              matchlist.push(cm_res);
            }
            else
            {
              repeatcount += 1;
            }

            if ((matchlist.length + repeatcount) >= results.length)
            {
              //console.log('results:' + results);

              console.log('Created ' + matchlist.length + " new matches.");
              console.log('Found ' + repeatcount + " repeated matches.");

              res.jsonp(matchlist);
            }

          });
        }
    }

  });


  //var path = 'ty_notstarted.html';
  //
  //scrapeELSPage(path);
};
