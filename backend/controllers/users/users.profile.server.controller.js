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
  var wasOptedIn = user.emailOptIn;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();

    //check to see if new email
    var newemail = user.email;
    var changedOptIn = (wasOptedIn == user.emailOptIn);

    //check to see if new email. if so, then update mailchimp.
    if ( (newemail != oldemail) || changedOptIn )
    {
      var mailchimp_subscriber_url = sbfuncs.mailchimp_endpoint + 'lists/' +
        sbfuncs.mailchimp_list_id + "/members/" + user.mailChimpHash;
      var mailchimp_data = {
        'status': (user.emailOptIn?'subscribed':'unsubscribed'),
        'email_address' : newemail,
        'merge_fields' : { 'FNAME' : user.username }
      };
      var put_obj = { url: mailchimp_subscriber_url, json: mailchimp_data };

      //console.log('putobj:' + JSON.stringify(put_obj));

      request.put(put_obj, function(err, resp, body) {
        if (err) {
          console.log('Error:' + err);
        }
        else {

          console.log('put resp body: ' + JSON.stringify(body));

          //check to see if the email was actually changed.
          if (body.email_address == undefined)
          {
            console.log('@@@ undefined body');
          }
          else if (body.email_address != newemail)
          {
            console.log('@@@@@DID NOT PROPERLY CHANGE EMAIL ADDRESS!');
            //If it wasn't, do a hack - delete the address, and create a new one.
            request.del(mailchimp_subscriber_url);

            var post_obj = { url: sbfuncs.mailchimp_endpoint + 'lists/' +
            sbfuncs.mailchimp_list_id + "/members/", json: mailchimp_data };

            request.post(post_obj, function(err, resp, body) {

              user.mailChimpHash = body.id;

              user.save(function(err) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err) });
                } else {
                  req.login(user, function(err) {
                    if (err) {  res.status(400).send(err); }
                    else { res.json(user); }
                  });
                }
              });

            });

          }

          //save the user. note: this is actually some copypasta of above
          //can change it once i understand how to properly make a function lol
          else
          {

            console.log('@@@@@we good!');

            user.mailChimpHash = body.id;

            user.save(function(err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err) });
              } else {
                req.login(user, function(err) {
                  if (err) {  res.status(400).send(err); }
                  else { res.json(user); }
                });
              }
            });


          }

        }
      });

    }
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