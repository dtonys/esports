'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
    // User Routes
    var users = require('../../backend/controllers/users.server.controller');

    // Setting up the users profile api
    app.route('/api/v1/users/me').get(users.me);
    app.route('/api/v1/users').put(users.update);
    app.route('/api/v1/users/accounts').delete(users.removeOAuthProvider);

    // Setting up the users password api
    app.route('/api/v1/users/password').post(users.changePassword);
    app.route('/api/v1/auth/forgot').post(users.forgot);
    app.route('/api/v1/auth/reset/:token').get(users.validateResetToken);
    app.route('/api/v1/auth/reset/:token').post(users.reset);

    // Setting up the users authentication api
    app.route('/api/v1/auth/signup').post(users.signup);
    app.route('/api/v1/auth/signin').post(users.signin);
    app.route('/api/v1/auth/signout').get(users.signout);

    // Setting the facebook oauth routes
    app.route('/api/v1/auth/facebook').get(passport.authenticate('facebook', {
        scope: ['email']
    }));
    app.route('/api/v1/auth/facebook/callback').get(users.oauthCallback('facebook'));

    // Setting the twitter oauth routes
    app.route('/api/v1/auth/twitter').get(passport.authenticate('twitter'));
    app.route('/api/v1/auth/twitter/callback').get(users.oauthCallback('twitter'));

    // Setting the google oauth routes
    app.route('/api/v1/auth/google').get(passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));
    app.route('/api/v1/auth/google/callback').get(users.oauthCallback('google'));

    // Setting the linkedin oauth routes
    app.route('/api/v1/auth/linkedin').get(passport.authenticate('linkedin'));
    app.route('/api/v1/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

    // Setting the github oauth routes
    app.route('/api/v1/auth/github').get(passport.authenticate('github'));
    app.route('/api/v1/auth/github/callback').get(users.oauthCallback('github'));

    // Finish by binding the user middleware
    app.param('userId', users.userByID);
};
