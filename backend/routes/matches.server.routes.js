'use strict';

module.exports = function(app) {
	var users = require('../../backend/controllers/users.server.controller');
	var matches = require('../../backend/controllers/matches.server.controller');
	var bets = require('../../backend/controllers/bets.server.controller');

	// Matches Routes
	app.route('/api/v1/matches')
		.get(matches.list)
		.post(users.requiresLogin, matches.create);

	app.route('/api/v1/matches/:matchId')
		.get(matches.read)
		.put(matches.update)//users.requiresLogin, matches.hasAuthorization,
		.delete(users.requiresLogin, matches.hasAuthorization, matches.delete);

	app.route('/api/v1/resolve/:matchId')
		.post(users.isAdmin, matches.resolve);

	// Finish by binding the Match middleware
	app.param('matchId', matches.matchByID);

	//app.param('betsByMatch', bets.betsOfMatch);
};
