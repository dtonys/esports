/**
 * Created by Joseph on 11/17/2015.
 */
'use strict';

module.exports = function(app) {
  var users = require('../../backend/controllers/users.server.controller');
  var tournaments = require('../../backend/controllers/tournaments.server.controller');

  app.route('/api/v1/tournaments')
    .get(users.isAdmin, tournaments.list)
    .post(users.isAdmin, tournaments.create);
};
