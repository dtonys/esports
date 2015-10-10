'use strict';

module.exports = function(app) {

	// Root routing
	var core = require('../../backend/controllers/core.server.controller');
	app.route('/')
		.post(core.resp);

	/*
	var users = require('../../backend/controllers/users.server.controller');
	var matches = require('../../backend/controllers/matches.server.controller');

	// Matches Routes
	app.route('/')
		.get(matches.list)
		.post(users.requiresLogin, matches.create);
	 // Finish by binding the Match middleware
	 app.param('matchId', matches.matchByID);
	*/
};
