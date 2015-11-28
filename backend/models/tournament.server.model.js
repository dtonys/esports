'use strict';
/**
 * Created by Joseph on 11/17/2015.
 *
 * Basic schema for tournaments, that can be added dynamically.
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tournament Schema
 */
var TournamentSchema = new Schema({

  name: {
    type: String,
    required: "Tournament name required!"
  },

  //name for esportlivescore purposes
  ELS_url: {
    type: String
  }

  //active?

  //start date?

  //series?

  //pic name?


});

mongoose.model('Tournament', TournamentSchema);