'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Match = mongoose.model('Match'),
	Bet = mongoose.model('Bet'),
	_ = require('lodash'),
  sbfuncs = require('./sbfuncs.js'),
	request = require('request');

/**
 * Create a Match
 */
exports.create = function(req, res) {

  var reqbody = req.body;
  reqbody.outcomeNames = [reqbody.team1name, reqbody.team2name];
  reqbody.betPot = [0, 0];

  var match = new Match(reqbody);
  match.user = req.user;



  //Save new segment on mailchimp.
  var mailchimp_segment_url = sbfuncs.mailchimp_endpoint + 'lists/' + sbfuncs.mailchimp_list_id + "/segments";
  var mailchimp_segment_data = { 'name': match.id };

  var mailchimp_obj = {
    url: mailchimp_segment_url,
    json: mailchimp_segment_data
  };
  //console.log('post:' + JSON.stringify(mailchimp_obj));

  request.post(mailchimp_obj, function(err, resp, body) {
    console.log('response code: ' + resp.statusCode);
    if (err) {
      console.log('error:' + err);
    }
    else {
      //console.log('body: ' + JSON.stringify(body));
      match.mailChimpSegmentId = body.id;
    }

    match.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        //Return Match Data
        res.jsonp(match);
      }
    });


  });
};

/**
 * Show the current Match, along with bets.
 */
exports.read = function(req, res) {

	/* stuff to use  when I can actually use betByMatch middlware.
	 //set bets to be a property of matches. (should be an array)
	 req.match.bets = req.bets;
	 console.log(req.bets);
	 res.jsonp(req.match);
	 */

	var the_result = {};
	the_result.match = req.match;
	//console.log(req.match);

	Bet.find({'match':req.match})
		.sort('-created')
		.populate('user', 'username')
		.exec(function(err, bets) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				the_result.bets = bets;
				res.jsonp(the_result);
			}
		});
};

/**
 * Cancel a match. Refund all people.
 */
exports.cancel = function(req, res) {

  var match = req.match ;
  match.result = matchres;
  match.status = 5;
  match.save();

  Bet.find({'match':match})
    .populate('user')
    .exec(function(err, bets) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var TEMPTOTAL = 0;
        //for each valid bet, give the user a refund.
        for (var j in bets)
        {
          var bet = bets[j];

          var playerpayout = bet.amount;

          //Save the bet's status
          // Maybe need to change this to += to properly keep track of payouts
          // (in case of server error double spending, etc).
          bet.status += playerpayout;
          bet.save();

          //Update user by giving him currency.
          var txobj = {
            cryptotype: "DOGE",
            address: bet.user.dogecoinBlioAddress,
            balance_change: playerpayout,
            txid: "",
            note: 'Refund for match'
          };

          sbfuncs.createTransaction(bet2.user, txobj);

          TEMPTOTAL += playerpayout;

        }
        console.log('CANCELED:' + TEMPTOTAL);
      }
    });

    //Redirect adminuser back to matches page.
  res.redirect('/#!/matches/' + match._id);
};

/*
//Resolving a match without having the match ID in the url.
exports.resolve = function(req, res) {
  var match = req.body.match;
  req.match = match;
};
*/

/** Resolve a match.
 * 1. check if user has permission?
 * 2. count up all the bets on each side.
 * 3.
 */
exports.resolve = function(req, res) {
  var match = req.match ;
	console.log('RESOLVING MATCH:' + match.gameName + " - " + match.tourneyName +
    "(" + match.outcomeNames[0] + " vs " + match.outcomeNames[1] + ")");

  var payoutnote = "Payout for " + match.outcomeNames[0] + " vs " + match.outcomeNames[1];
  //Winner number
  //TODO: check to see if valid winner number.
  //TODO: wait for X number of people to submit an entry?
  var matchres = req.body.winnerNum;


  var match = req.match ;
  match.result = matchres;
  match.status = 3;
  match.save();

  //emails of users that bet on this match.
  var match_emails = [];

	Bet.find({'match':match})
		.populate('user')
		.exec(function(err, bets) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				////////// BET PAYOUT START ///////////////

				//get the total bet amounts
				var totals = [0, 0];
        var shares = [0, 0];
				for (var i in bets)
				{
					var bet = bets[i];
					if (parseInt(bet.amount) > 0)
					{
            totals[bet.prediction] += bet.amount;
            shares[bet.prediction] += bet.stake;
					}
				}

				console.log('1 total:' + totals[0]);
				console.log('2 total:' + totals[1]);

				var TEMPTOTAL = 0;

				//Calculate payout to distribute to players, by:
        //1. winner total (stakes) is shares[matchres]
        //2. payout is sum of all the non-winning total.
				var winnertot = shares[matchres];
				var payout = 0;
        for (var p = 0; p < totals.length; p++)
        {
          if (p === matchres) continue;
          payout += totals[p];
        }

				//Take 5% rake from loser
				payout = Math.ceil(payout * 0.95);

				//for each valid bet, get the ratio
				for (var j in bets)
				{
					var bet2 = bets[j];

					//If a correct bet, and the bet amount is more than 0
					if (bet2.prediction === matchres && bet2.amount > 0 && bet2.stake > 0)
					{
						var betratio = bet2.stake / winnertot;

						//give player back his bet, and the payout.
						var playerpayout = bet2.amount + Math.ceil(betratio * payout);

            console.log(bet2.user.username + ':' + bet2.amount + '->' + playerpayout + ' (' + bet2.user.email + ')');

						//Save the bet's status
						// Maybe need to change this to += to properly keep track of payouts
						// (in case of server error double spending, etc).
						bet2.status += playerpayout;
						bet2.save();


            //Update user by giving him currency.
            var txobj = {
              cryptotype: "DOGE",
              address: bet2.user.dogecoinBlioAddress,
              balance_change: playerpayout,
              txid: "",
              note: payoutnote
            };
            sbfuncs.createTransaction(bet2.user, txobj);

						TEMPTOTAL += playerpayout;
					}
          match_emails.push(bet2.user.email);
				}

				//Printing information about stuff.
				console.log('total payout:' + TEMPTOTAL);
				var TEMPRAKE = totals[0] + totals[1] - TEMPTOTAL;
				console.log('rake:' + TEMPRAKE);


        match.status = 5;
        match.save();


        //TODO:Send a mailchimp email out to all people who bet in the match.
        //Problem: cannot have more than 10 conditions. so, need to find a way to manually add shit to a segment.
        /** 1. update the segment */
        /*
        var mailchimp_segment_url = sbfuncs.mailchimp_endpoint + 'lists/' +
          sbfuncs.mailchimp_list_id + "/segments/" + match.mailChimpSegmentId;

        var mailchimpconditions = [];
        for (var i = 0; i < match_emails.length; i++)
        {
          mailchimpconditions.push({
            "condition_type": "EmailAddress",
            "field": "merge0",
            "op": "is",
            "value": match_emails[i]
          });
        }

        var mailchimp_segment_data = {
          'name': match.id,
          'options': {
            'match': 'any',
            'conditions': mailchimpconditions
          }
        };

        var mailchimp_obj = {
          url: mailchimp_segment_url,
          json: mailchimp_segment_data
        };
        console.log('patch:' + JSON.stringify(mailchimp_obj));

        request.patch(mailchimp_obj, function(err, resp, body) {
          console.log('response code: ' + resp.statusCode);
          if (err) {
            console.log('error:' + err);
          }
          else {
            console.log('body: ' + JSON.stringify(body));
          }
        });
        */

        /** 2. create the email and send it to the segment we created above. */


        /*
         var mailchimp_data = {
         'status' : 'subscribed',
         'email_address' : user.email,
         'merge_fields' : {
         'FNAME' : user.username
         }};



         */
			}
		});


    //Redirect adminuser back to matches page.
	res.redirect('/#!/matches/' + match._id);
};

/**
 * Update a Match
 */
exports.update = function(req, res) {
	var match = req.match ;
	console.log('MATCH UPDATING!!!!!!!!!!!!!!!!!');

	match = _.extend(match , req.body);

	match.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(match);
		}
	});
};

/**
 * Delete an Match
 */
exports.delete = function(req, res) {
	var match = req.match ;

	match.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(match);
		}
	});
};

/**
 * List of Matches
 */
exports.list = function(req, res) {

  /*Get:
  5 most recent matches.
  any upcoming matches.
  */
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	Match.find()

    //All matches have happened one week ago, or after.
    // .where('matchStartTime').gte(oneWeekAgo)

    //Sort by match start time
    .sort('+matchStartTime')

    .exec(function(err, matches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(matches);
		}
	});
};

/**
 * Match middleware
 */
exports.matchByID = function(req, res, next, id) {

	console.log('matchbyid');

	Match.findById(id).
		exec(function(err, match) {
			if (err) return next(err);
			if (! match) return next(new Error('Failed to load Match ' + id));
			req.match = match ;
			next();
		});
};

/**
 * Match authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.match.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
