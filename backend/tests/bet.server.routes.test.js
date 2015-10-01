'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../app.js'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Bet = mongoose.model('Bet'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, bet;

/**
 * Bet routes tests
 */
describe('Bet CRUD tests', function() {
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

		// Save a user to the test db and create new Bet
		user.save(function() {
			bet = {
				name: 'Bet Name'
			};

			done();
		});
	});

	it('should be able to save Bet instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bet
				agent.post('/bets')
					.send(bet)
					.expect(200)
					.end(function(betSaveErr, betSaveRes) {
						// Handle Bet save error
						if (betSaveErr) done(betSaveErr);

						// Get a list of Bets
						agent.get('/bets')
							.end(function(betsGetErr, betsGetRes) {
								// Handle Bet save error
								if (betsGetErr) done(betsGetErr);

								// Get Bets list
								var bets = betsGetRes.body;

								// Set assertions
								(bets[0].user._id).should.equal(userId);
								(bets[0].name).should.match('Bet Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Bet instance if not logged in', function(done) {
		agent.post('/bets')
			.send(bet)
			.expect(401)
			.end(function(betSaveErr, betSaveRes) {
				// Call the assertion callback
				done(betSaveErr);
			});
	});

	it('should not be able to save Bet instance if no name is provided', function(done) {
		// Invalidate name field
		bet.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bet
				agent.post('/bets')
					.send(bet)
					.expect(400)
					.end(function(betSaveErr, betSaveRes) {
						// Set message assertion
						(betSaveRes.body.message).should.match('Please fill Bet name');

						// Handle Bet save error
						done(betSaveErr);
					});
			});
	});

	it('should be able to update Bet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bet
				agent.post('/bets')
					.send(bet)
					.expect(200)
					.end(function(betSaveErr, betSaveRes) {
						// Handle Bet save error
						if (betSaveErr) done(betSaveErr);

						// Update Bet name
						bet.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Bet
						agent.put('/bets/' + betSaveRes.body._id)
							.send(bet)
							.expect(200)
							.end(function(betUpdateErr, betUpdateRes) {
								// Handle Bet update error
								if (betUpdateErr) done(betUpdateErr);

								// Set assertions
								(betUpdateRes.body._id).should.equal(betSaveRes.body._id);
								(betUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Bets if not signed in', function(done) {
		// Create new Bet model instance
		var betObj = new Bet(bet);

		// Save the Bet
		betObj.save(function() {
			// Request Bets
			request(app).get('/bets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Bet if not signed in', function(done) {
		// Create new Bet model instance
		var betObj = new Bet(bet);

		// Save the Bet
		betObj.save(function() {
			request(app).get('/bets/' + betObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', bet.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Bet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bet
				agent.post('/bets')
					.send(bet)
					.expect(200)
					.end(function(betSaveErr, betSaveRes) {
						// Handle Bet save error
						if (betSaveErr) done(betSaveErr);

						// Delete existing Bet
						agent.delete('/bets/' + betSaveRes.body._id)
							.send(bet)
							.expect(200)
							.end(function(betDeleteErr, betDeleteRes) {
								// Handle Bet error error
								if (betDeleteErr) done(betDeleteErr);

								// Set assertions
								(betDeleteRes.body._id).should.equal(betSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Bet instance if not signed in', function(done) {
		// Set Bet user
		bet.user = user;

		// Create new Bet model instance
		var betObj = new Bet(bet);

		// Save the Bet
		betObj.save(function() {
			// Try deleting Bet
			request(app).delete('/bets/' + betObj._id)
			.expect(401)
			.end(function(betDeleteErr, betDeleteRes) {
				// Set message assertion
				(betDeleteRes.body.message).should.match('User is not logged in');

				// Handle Bet error error
				done(betDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Bet.remove().exec();
		done();
	});
});
