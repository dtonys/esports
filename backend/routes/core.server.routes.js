'use strict';

module.exports = function(app) {

	// Root routing
	var core = require('../../backend/controllers/core.server.controller');
  var users = require('../../backend/controllers/users.server.controller');
  var admintools = require('../../backend/controllers/admintools.server.controller');


	app.route('/')
		.post(core.resp);

  //TODO: ALL THESE NEED TO BE ADMIN ONLY (use users.isAdmin). DISABLED IT FOR TESTING PURPOSES

  /** ADMIN STUFF */
  //Scrape esportlivescore.com for new matches
  app.route('/api/v1/admin/scrapeELSnew')
    .get(admintools.scrapeELSnew);

  //Scrape sportlivescore.com for recently finished matches.
  app.route('/api/v1/admin/scrapeELSfinished')
    .get(admintools.scrapeELSfinished);

  app.route('/api/v1/admin/abios_tournaments')
    .get(admintools.findAbiosTournaments);

  app.route('/api/v1/admin/els_tournaments')
    .get(admintools.findELSTournaments);

};
