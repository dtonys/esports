'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Bet = mongoose.model('Bet'),
	Match = mongoose.model('Match'),
	_ = require('lodash'),
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

	//create the bet. we don't save it until later.
	var bet = new Bet(req.body);

	if (bet.amount > theuser.dogeBalance)
	{
		return res.status(400).send(
			{message: 'You don\'t have enough for that!'});
	}

	//TODO: check timing of bet for doubled stake
	// if match date already started, we deny it.
	// if it's before 24 hours, then we double the bet's stake.



	bet.user = theuser;
	bet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(bet);

			// change user's balance.
			theuser.dogeBalance -= bet.amount;
			theuser.save();
		}
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
