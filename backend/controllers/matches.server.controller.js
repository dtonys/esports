'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Match = mongoose.model('Match'),
	Bet = mongoose.model('Bet'),
	_ = require('lodash'),
	request = require('request');

/**
 * Create a Match
 */
exports.create = function(req, res) {
	var match = new Match(req.body);
	match.user = req.user;

	console.log('team1name' + match.team1name);
	console.log('team2name' + match.team2name);
	console.log('tourneyname' + match.tourneyName);
	console.log('gamename' + match.gameName);

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

/** Resolve a match.
 * 1. check if user has permission?
 * 2. count up all the bets on each side.
 * 3.
 */
exports.resolve = function(req, res) {
	console.log('I AM RESOLVING!!!!');

  //Winner number
  //TODO: check to see if valid winner number.
  //TODO: wait for X number of people to submit an entry?
  var matchres = req.body.winnerNum;

	var the_result = {};
	the_result.match = req.match;
	//console.log(req.match);

	var match = req.match ;
	match.result = matchres;
    match.status = 3;
	match.save();

	Bet.find({'match':req.match})
		.populate('user', 'dogecoinBlioAddress dogeBalance username')
		.exec(function(err, bets) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				////////// BET PAYOUT START ///////////////

				//get the total bet amounts
				var totals = [0, 0];
				for (var i in bets)
				{
					var bet = bets[i];
					if (parseInt(bet.amount) > 0)
					{
						if (bet.prediction === 1)
							totals[0] += bet.amount;
						else if (bet.prediction === 2)
							totals[1] += bet.amount;
					}
				}

				console.log('1 total:' + totals[0]);
				console.log('2 total:' + totals[1]);

				var TEMPTOTAL = 0;

				//Payout to distribute to players.
				var winnertot = 0;
				var payout = 0;
				if (matchres === 1) {
					payout = totals[1];
					winnertot = totals[0];
				}
				else if (matchres === 2) {
					payout = totals[0];
					winnertot = totals[1];
				}

				//Take 5% rake from loser
				payout = Math.ceil(payout * 0.95);

				//for each valid bet, get the ratio
				for (var j in bets)
				{
					var bet2 = bets[j];

					//If a correct bet, and the bet amount is more than 0
					if (bet2.prediction === matchres && parseInt(bet2.amount) > 0)
					{
						var betratio = bet2.amount / winnertot;

						//give player back his bet, and the payout.
						var playerpayout = bet2.amount + Math.ceil(betratio * payout);

						//Save the bet's status
						// Maybe need to change this to += to properly keep track of payouts
						// (in case of server error double spending, etc).
						bet2.status += playerpayout;
						bet2.save();

						console.log(bet2.user.username + ':' + bet2.amount + '->' + playerpayout);

						//Update user by giving him currency.
						bet2.user.dogeBalance += playerpayout;
						bet2.user.save();

						TEMPTOTAL += playerpayout;
					}
				}

				//Printing information about stuff.
				console.log('total payout:' + TEMPTOTAL);
				var TEMPRAKE = totals[0] + totals[1] - TEMPTOTAL;
				console.log('rake:' + TEMPRAKE);
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
	Match.find().sort('-matchStartTime').populate('user', 'displayName').exec(function(err, matches) {
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
