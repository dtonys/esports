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

  reqbody.user = req.user;

  sbfuncs.createMatch(reqbody, res);

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
  //Winner number
  //TODO: check to see if valid winner number.
  //TODO: wait for X number of people to submit an entry?
  var matchres = req.body.winnerNum;

  sbfuncs.resolveMatch(match, matchres, req, res);

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

  var queries = req.query;

  console.log('query:' + JSON.stringify(queries));


  var findquery = {};

  if (queries.gameName)
    findquery.gameName = queries.gameName;
  if (queries.tourneyName)
    findquery.tourneyName = queries.tourneyName;
  if (queries.teamName)
    findquery.outcomeNames = queries.teamName;


  var per_page = ((queries.per_page)?queries.per_page:40);
  var skipnum = (queries.page ? ((queries.page - 1) * per_page) : 0);


  /*Get:
  5 most recent matches.
  any upcoming matches.
  */
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	Match.find(findquery)

    //All matches have happened one week ago, or after.
    // .where('matchStartTime').gte(oneWeekAgo)

    //Sort by match start time
    .sort({matchStartTime: +1})
    .limit(per_page)
    .skip(skipnum)

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
