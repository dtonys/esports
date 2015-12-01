/**
 * Created by Joseph on 11/17/2015.
 *
 * stuff for keeping track of tournaments.
 */

'use strict';

var _ = require('lodash'),
  errorHandler = require('./errors.server.controller.js'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  sbfuncs = require('./sbfuncs.js'),
  Tournament = mongoose.model('Tournament');


exports.list = function(req, res) {
  Tournament.find()
    .exec(function(err, tournaments) {
      if (err) {
        return res.status(400).send({message: errorHandler.getErrorMessage(err)});
      }
      else
      {
        //needs to return an object, so we're plucking the tournament names first, then
        //putting objects back into them.
        var plucked = _.pluck(tournaments, "name");
        var objectified = _.object(plucked, tournaments);
        res.jsonp(objectified);
      }
    })
};

exports.create = function(req, res) {
  var tournament = new Tournament(req.body);
  tournament.save(function(err) {
    if (err) {
      return res.status(400).send({message: errorHandler.getErrorMessage(err)});
    }
    else
    {
      res.jsonp(tournament);
    }
  });
};