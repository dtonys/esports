/**
 * Created by Joseph on 9/17/2015.
 *
 * stuff for handling transactions of user:
 * withdrawing and depositing currency
 */
'use strict';

var _ = require('lodash'),
    //errorHandler = require('errors.server.controller.js'),
    mongoose = require('mongoose'),
    BlockIo = require('block_io'),
    User = mongoose.model('User');
var block_io = new BlockIo('c3f9-2390-cd21-204b', 'OMFGbl0ck10', 2);


/**
 *
 */
exports.withdraw = function(req, res) {
    console.log('OMFG WITHDRAW!!!!!!');
    var user = req.user;
    var amount = 100;
    var address = '2N15rWNxXozv1WoYhE9srgezLXgvgAs6WY6';
    /*
    var amount = req.amount;
    var address = req.address;
     */

    //TODO: how to handle network fee?

    console.log(user);

    //Check balance. return error if amount isn't enough.
    //TODO: need to check balance in database? not sure if this balance is accurate or can be manipulated
    if (user.dogeBalance < amount)
    {
        res.jsonp({'error':'balance too low'});
        return;
    }


    //using block io, withdraw to the address.
    block_io.withdraw({'amounts': amount, 'to_addresses': address},
        function(blio_req, blio_res) {
            res.jsonp(blio_res);
    });
};
