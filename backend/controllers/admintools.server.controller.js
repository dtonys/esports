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

  //scrape for new matches.
  PythonShell.run('./scripts/scraper_esportlivescore.py',
    {
      mode:'json',
      args:['ty_finished.html', '1', '0']
      //args:['ty_notstarted.html', '0', '7']
    },
    function(err, results) {
      if (err) {
        return res.status(400).send({message: err, stacktrace:err.stack});
      } else {
        /*
        var matchlist = [];
        var repeatcount = 0;
        for (var i = 0; i < results.length; i++)
        {
          sbfuncs.createMatch(results[i], function(cm_res) {

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
        */
        for (var i = 0; i < results.length; i++)
        {
          var the_result = results[i].scraped_result;
          console.log(JSON.stringify(results[i]));

          var match_to_find = results[i];

          delete results[i]['scraped_result'];
          delete results[i]['matchStartTime'];
          //match_to_find.matchStartTime = new Date(Date.parse(match_to_find.matchStartTime));
          console.log(JSON.stringify(results[i]));

          var processed = 0;
          //need to copy everything except the thing
          Match.find(results[i], function(found_matches) {
            if (found_matches && found_matches.length > 0)
            {
              console.log('FOUND IT!!!!!!!!' + results[i]);
              sbfuncs.resolveMatch(found_matches[0], the_result, req, res);
            }
            else
            {
              console.log("Match isn't in database.");
            }

            processed += 1;
            if (processed >= results.length)
            {
              res.jsonp({});
            }

          });
        }

    }
  });
};
