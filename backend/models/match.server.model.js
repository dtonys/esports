'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Match Schema
 */
var MatchSchema = new Schema({
	//user that created this match
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	//Team 1 Name
	team1name: {
		type: String,
		default: String,
		trim: true
	},
	//Team 2 name
	team2name: {
		type: String,
		default: String,
		trim: true
	},
	//When the match starts
	matchStartTime: {
		type: Date,
		default: Date.now
	},
	//Name of the tourney (maybe needs to be an ID?)
	tourneyName: {
		type: String
	},
	//Name of the game (maybe needs to be an ID?)
	gameName: {
		type: String
	},
	//0 if not done yet, 1 if team1 won, 2 if team 2 won, 3 if draw/negated or somehting
	result: {
		type: Number,
		default: 0
	},
  //mailchimp segment identifier
  mailChimpSegmentId: {
    type: String
  },
	/*Status of match.
	0: "Blind Betting". Match is created. Bets should be blind, but get doubled stake.
	1: "Regular Betting". 24 hours before match. Bets are shown.
	2: "Match in Progress". Match is under way. No more bets allowed.
	3: "Match Resolving". Match is finished, and we're paying the match out.
	4: "Match Done". We're done paying the winners.
	*/
	status: {
		type: Number,
		default: 0
	}


});

mongoose.model('Match', MatchSchema);
