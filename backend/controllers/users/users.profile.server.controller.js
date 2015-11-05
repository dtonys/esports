'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
  sbfuncs = require('../sbfuncs'),
  request = require('request'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

  //save old email
  var oldemail = user.email;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();

    //check to see if new email
    var newemail = user.email;

    //check to see if new email. if so, then update mailchimp.
    if (newemail != oldemail)
    {

      var mailchimp_url = sbfuncs.mailchimp_endpoint + 'lists/' +
        sbfuncs.mailchimp_list_id + "/members/" + user.mailChimpHash;
      var mailchimp_data = {
        'status': 'subscribed',
        'email_address' : newemail
      };
      var put_obj = { url: mailchimp_url, json: mailchimp_data };
      console.log('putobj:' + JSON.stringify(put_obj));
      request.patch(put_obj, function(err, resp, body) {
        if (err) {
          console.log('Error:' + err);
        }
        else {
          console.log('body: ' + JSON.stringify(body));
        }
      });

    }


		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};