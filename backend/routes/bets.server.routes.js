'use strict';

module.exports = function(app) {
	var users = require('../../backend/controllers/users.server.controller');
	var bets = require('../../backend/controllers/bets.server.controller');
	var matches = require('../../backend/controllers/matches.server.controller');

	// Bets Routes
	app.route('/bets')
		.get(bets.list)
		.post(users.requiresLogin, bets.create);

	app.route('/bets/:betId')
		.get(bets.read)
		//.put(users.requiresLogin, bets.hasAuthorization, bets.update)
		.delete(users.requiresLogin, bets.hasAuthorization, bets.delete);

	app.route('/matches/:matchId/bets/create')
		.get(users.requiresLogin, matches.read);

	//app.route('/matches/:matchId')
	//	.get(bets.betsOfMatch);


	// Finish by binding the Bet middleware
	app.param('betId', bets.betByID);
	app.param('matchId', matches.matchByID);
};
