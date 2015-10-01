/**
 * Created by Joseph on 9/17/2015.
 */
'use strict';

module.exports = function(app) {
    var users = require('../../backend/controllers/users.server.controller');
    var transactions = require('../../backend/controllers/transactions.server.controller');

    app.route('/api/v1/withdraw')
        .post(users.requiresLogin, transactions.withdraw);
};
