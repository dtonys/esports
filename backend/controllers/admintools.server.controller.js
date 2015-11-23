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
exports.scrapeELSnew = function (req, res) {
  console.log('Scraping ELS for new matches.');

  //scrape for new matches.
  PythonShell.run('./scripts/scraper_esportlivescore.py',
    {
      mode: 'json',
      args: ['ty_notstarted.html', '0', '7']
    },
    function (err, results) {
      if (err) {
        return res.status(400).send({message: err, stacktrace: err.stack});
      } else {
        var matchlist = [];
        var repeatcount = 0;
        for (var i = 0; i < results.length; i++) {
          sbfuncs.createMatch(results[i], function (cm_res) {

            //if it's a non-empty object
            if (!_.isEmpty(cm_res))
              matchlist.push(cm_res);
            else
              repeatcount += 1;

            if ((matchlist.length + repeatcount) >= results.length) {
              console.log('Created ' + matchlist.length + " new matches.");
              console.log('Found ' + repeatcount + " repeated matches.");

              res.jsonp(matchlist);
            }

          });
        }

      }
    });
};

exports.scrapeELSfinished = function (req, res) {
  console.log('Scraping ELS for finished matches.');

  //scrape for new matches.
  PythonShell.run('./scripts/scraper_esportlivescore.py',
    {
      mode: 'json',
      args: ['ty_finished.html', '1', '0']
    },
    function (err, results) {
      if (err) {
        return res.status(400).send({message: err, stacktrace: err.stack});
      } else {
        for (var i = 0; i < results.length; i++) {
          var the_result = results[i].scraped_result;
          delete results[i]['scraped_result'];

          var processed = 0;
          //need to copy everything except the thing
          Match.find(results[i], function (err, found_matches) {

            if (found_matches == null || found_matches.length < 1) {
              console.log("Match isn't in database.");
            }
            else if (found_matches[0].status > 2) {
              console.log("Match has already been resolved.");
            }
            else {
              sbfuncs.resolveMatch(found_matches[0], the_result, req, res);
            }

            processed += 1;
            if (processed >= results.length) {
              res.jsonp({});
            }

          });
        }

      }
    });
};
