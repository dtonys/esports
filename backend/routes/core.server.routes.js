'use strict';

module.exports = function(app) {

	// Root routing
	var core = require('../../backend/controllers/core.server.controller');
  var users = require('../../backend/controllers/users.server.controller');
  var admintools = require('../../backend/controllers/admintools.server.controller');


	app.route('/')
		.post(core.resp);

  /** ADMIN STUFF */
  app.route('/api/v1/admin/scrapeELS')
    .get(admintools.scrapeELS);
//users.isAdmin,

};
