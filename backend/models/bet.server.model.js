'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

function bet_amount_validator(val)  {
	console.log('validating');
	return parseInt(val) > 0;
}

function cast_to_int(val) {
	console.log('casting');
	return parseInt(val);
}

var valid_bet_amount = [bet_amount_validator,'Input a valid amount to bet!'];

/**
 * Bet Schema
 */
var BetSchema = new Schema({

	//Timestamp of when the bet was created.
	created: {
		type: Date,
		default: Date.now
	},

	//User ID that placed the bet.
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},

	//Match ID.
	match: {
		type: Schema.ObjectId,
		ref: 'Match'
	},

	//Amount that the user has bet.
	amount: {
		set: cast_to_int,
		min: 1,
		type: Number,
		required: 'Input a valid amount to bet!'
	},

	//Stake: Amount that the user "owns" in this. Typically the same as amount, unless there are modifiers.
	stake: {
		set: cast_to_int,
		min: 1,
		type: Number,
    default: 1,
		required: 'Share failed!'
	},

	// Prediction on who will win. 1 = team1, 2 = team2, 3 = draw
	prediction: {
		required: 'Select an outcome to bet on!',
		type: Number
	},

	//Status of the bet. On match resolution, if the player got a payout, the status is changed to the payout.
	status: {
		type: Number,
		default: 0
	}
});

mongoose.model('Bet', BetSchema);
