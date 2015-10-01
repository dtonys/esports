/**
 * Created by Joseph on 9/17/2015.
 *
 * stuff for handling transactions of user:
 * withdrawing and depositing currency
 */
'use strict';

var _ = require('lodash'),
    errorHandler = require('./errors.server.controller.js'),
    mongoose = require('mongoose'),
    BlockIo = require('block_io'),
    User = mongoose.model('User'),
    Transaction = mongoose.model('Transaction');
var block_io = new BlockIo('c3f9-2390-cd21-204b', 'OMFGbl0ck10', 2);


/**
 *
 */
exports.withdraw = function(req, res) {
    var user = req.user;
    var amount = req.body.amount;
    var address = req.body.address; //'2N15rWNxXozv1WoYhE9srgezLXgvgAs6WY6';
    var cryptotype = "DOGE";
    /*
    var amount = req.amount;
    var address = req.address;
     */

    //TODO: how to handle network fee? - currently we just eat it.

    //TODO: handle missing address?

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

            //TODO: catch blio error

            //var totalfee = blio_res.data.network_fee + blio_res.data.blockio_fee;

            var txobj = {
                cryptotype: cryptotype,
                address: address,
                balance_change: -amount,
                confirmations: 0,
                txid: blio_res.data.txid,
            };
            console.log(txobj);

            var transaction = new Transaction(txobj);
            transaction.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    user.dogeBalance -= amount;
                    user.save();
                    res.jsonp(blio_res);
                }

            });


    });
};
