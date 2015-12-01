'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Bet = mongoose.model('Bet'),
	Match = mongoose.model('Match'),
	_ = require('lodash'),
  sbfuncs = require('./sbfuncs.js'),
	request = require('request');
/**
 * Create a Bet
 */
exports.create = function(req, res) {

	var theuser = req.user;

	if ( !parseInt(req.body.amount) || parseInt(req.body.amount) < 5)
	{
		return res.status(400).send({message: 'You must bet at least 5 DOGE!'});
	}

  var current_time = new Date();

  //find the match

  Match.findById(req.body.match).
    exec(function(err, match) {
      if (err) return next(err);
      if (! match) {
        return res.status(400).send(
          {message: 'Match not found!'});
      }

      //Check timing/status of the match.
      //The match status must be 0 or 1, and must have a start time in the future.
      if ((current_time > match.matchStartTime) || (match.status > 1))
      {
        return res.status(400).send(
          {message: 'Betting is closed for this match!'});
      }

      //create the bet. we don't save it until later.
      var bet = new Bet(req.body);

      //Share is a copy of amount.
      bet.stake = bet.amount;
      //check timing of bet for doubled stake
      if (current_time < match.matchStartTime - 24) {
        bet.stake *= 2;
      }

      //need to save previous amount in case if we're adding.
      var betamount = bet.amount;

      if (bet.amount > theuser.dogeBalance)
      {
        return res.status(400).send(
          {message: 'You don\'t have enough for that!'});
      }

      //Check to see if the user already has a bet. (currently disabling this)
      //if so, we should just add it, instead of creating.
      /*
      Bet.find(
        { 'match' : req.body.match,
          'user' : theuser,
          'prediction' : req.body.prediction}).
        exec(function(err, previousbet) {
          if (err) return next(err);

          //We found a previous bet that's the same.
          if (previousbet)
          {
            console.log('PREVIOUS BET FOUND!');
            console.log('past bet:' + bet);
            bet = previousbet;
            bet.amount += betamount;

            console.log('current bet:' + bet);
          }
        });
      */

      //save the bet.
      bet.user = theuser;
      bet.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // change user's balance.
          var txobj = {
            cryptotype: "DOGE",
            address: "",
            balance_change: -betamount,
            txid: "",
            note: "Bet on " + match.outcomeNames[0] + " vs " + match.outcomeNames[1]
          };
          sbfuncs.createTransaction(theuser, txobj);

          console.log('before:' + match.betPot[0] + ", " + match.betPot[1]);
          //Save the match.
          match.betPot[bet.prediction] += betamount;
          match.markModified('betPot');
          match.save();
          console.log('after:' + match.betPot[0] + ", " + match.betPot[1]);

          res.jsonp(bet);

        }
      });

    });
};

/**
 * Show the current Bet
 */
exports.read = function(req, res) {
	res.jsonp(req.bet);
};

/**
 * Update a Bet
 */
exports.update = function(req, res) {
	var bet = req.bet ;

	bet = _.extend(bet , req.body);

	bet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(bet);
		}
	});
};

/**
 * Delete an Bet
 */
exports.delete = function(req, res) {
	var bet = req.bet ;

	bet.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(bet);
		}
	});
};

/**
 * List of Bets
 * This is linked to bets.client.controller.js's $scope.find, but i don't know how it links.
 *
 * It looks likes only the display name is returned, though.
 */
exports.list = function(req, res) {

	console.log('bets - list');

	Bet.find({'user':req.user}).
		sort('-created').
		//populate('user').
		populate('match').
		exec(function(err, bets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//console.log(bets);
			res.jsonp(bets);
		}
	});
};

//Currently unused, need to implement middleware for this properly.
exports.betsOfMatch = function(req, res, next, match_id) {
	console.log('bets - betsOfMatch');

	Bet.find({'match':match_id})
		.sort('-created').
		exec(function(err, bets) {
			if (err) return next(err);
			if (! bets) return next (new Error('Failed to load bets'));

			req.bets = bets;
			next();
		});
};

/**
 * Bet middleware
 */
exports.betByID = function(req, res, next, id) {
	Bet.findById(id).populate('user', 'displayName').exec(function(err, bet) {
		if (err) return next(err);
		if (! bet) return next(new Error('Failed to load Bet ' + id));
		req.bet = bet ;
		next();
	});
};


/**
 * Bet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.bet.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
