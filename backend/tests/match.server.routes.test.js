'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../app'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Match = mongoose.model('Match'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, match;

/**
 * Match routes tests
 */
describe('Match CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Match
		user.save(function() {
			match = {
				name: 'Match Name'
			};

			done();
		});
	});

	it('should be able to save Match instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Match
				agent.post('/matches')
					.send(match)
					.expect(200)
					.end(function(matchSaveErr, matchSaveRes) {
						// Handle Match save error
						if (matchSaveErr) done(matchSaveErr);

						// Get a list of Matches
						agent.get('/matches')
							.end(function(matchesGetErr, matchesGetRes) {
								// Handle Match save error
								if (matchesGetErr) done(matchesGetErr);

								// Get Matches list
								var matches = matchesGetRes.body;

								// Set assertions
								(matches[0].user._id).should.equal(userId);
								(matches[0].name).should.match('Match Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Match instance if not logged in', function(done) {
		agent.post('/matches')
			.send(match)
			.expect(401)
			.end(function(matchSaveErr, matchSaveRes) {
				// Call the assertion callback
				done(matchSaveErr);
			});
	});

	it('should not be able to save Match instance if no name is provided', function(done) {
		// Invalidate name field
		match.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Match
				agent.post('/matches')
					.send(match)
					.expect(400)
					.end(function(matchSaveErr, matchSaveRes) {
						// Set message assertion
						(matchSaveRes.body.message).should.match('Please fill Match name');

						// Handle Match save error
						done(matchSaveErr);
					});
			});
	});

	it('should be able to update Match instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Match
				agent.post('/matches')
					.send(match)
					.expect(200)
					.end(function(matchSaveErr, matchSaveRes) {
						// Handle Match save error
						if (matchSaveErr) done(matchSaveErr);

						// Update Match name
						match.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Match
						agent.put('/matches/' + matchSaveRes.body._id)
							.send(match)
							.expect(200)
							.end(function(matchUpdateErr, matchUpdateRes) {
								// Handle Match update error
								if (matchUpdateErr) done(matchUpdateErr);

								// Set assertions
								(matchUpdateRes.body._id).should.equal(matchSaveRes.body._id);
								(matchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Matches if not signed in', function(done) {
		// Create new Match model instance
		var matchObj = new Match(match);

		// Save the Match
		matchObj.save(function() {
			// Request Matches
			request(app).get('/matches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Match if not signed in', function(done) {
		// Create new Match model instance
		var matchObj = new Match(match);

		// Save the Match
		matchObj.save(function() {
			request(app).get('/matches/' + matchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', match.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Match instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Match
				agent.post('/matches')
					.send(match)
					.expect(200)
					.end(function(matchSaveErr, matchSaveRes) {
						// Handle Match save error
						if (matchSaveErr) done(matchSaveErr);

						// Delete existing Match
						agent.delete('/matches/' + matchSaveRes.body._id)
							.send(match)
							.expect(200)
							.end(function(matchDeleteErr, matchDeleteRes) {
								// Handle Match error error
								if (matchDeleteErr) done(matchDeleteErr);

								// Set assertions
								(matchDeleteRes.body._id).should.equal(matchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Match instance if not signed in', function(done) {
		// Set Match user
		match.user = user;

		// Create new Match model instance
		var matchObj = new Match(match);

		// Save the Match
		matchObj.save(function() {
			// Try deleting Match
			request(app).delete('/matches/' + matchObj._id)
			.expect(401)
			.end(function(matchDeleteErr, matchDeleteRes) {
				// Set message assertion
				(matchDeleteRes.body.message).should.match('User is not logged in');

				// Handle Match error error
				done(matchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Match.remove().exec();
		done();
	});
});
