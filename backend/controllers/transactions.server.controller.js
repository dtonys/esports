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
    sbfuncs = require('./sbfuncs.js'),
    Transaction = mongoose.model('Transaction');
var block_io = new BlockIo(sbfuncs.block_io_config, sbfuncs.block_io_pin, sbfuncs.block_io_vers);

exports.list = function(req, res) {

  Transaction.find({'user':req.user}).
    sort('-timestamp').
    exec(function(err, txs) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        //console.log(bets);
        res.jsonp(txs);
      }
    });

};

/**
 *
 */
exports.withdraw = function(req, res) {
    var user = req.user;
    var amount = req.body.amount;
    var address = req.body.address; //'2N15rWNxXozv1WoYhE9srgezLXgvgAs6WY6';
    var cryptotype = "DOGE";

    //TODO: how to handle network fee? - currently we just eat it.

    //TODO: handle missing address?

    if (!amount || amount < 100)
    {
      return res.status(400).send({message: 'You must withdraw at least 100 DOGE!'});
    }

    //simple check for address
    if (!address || address.length < 5)
    {
      return res.status(400).send({message: 'Please provide an address to withdraw to!'});
    }


    //Check balance. return error if amount isn't enough.
    //TODO: need to check balance in database? not sure if this balance is accurate or can be manipulated
    if (user.dogeBalance < amount)
    {
      return res.status(400).send({message: "You don't have that much!"});
    }

  //using block io, withdraw to the address.
  block_io.withdraw({'amounts': amount, 'to_addresses': address},
    function (blio_req, blio_res) {

      console.log();

      //TODO: catch blio error
      if (blio_res == "fail") {
        return res.status(400).send({message: 'Invalid Address!'});
      }
      else {
        var totalfee = parseFloat(blio_res.data.network_fee) +
          parseFloat(blio_res.data.blockio_fee);

        var txobj = {
          cryptotype: cryptotype,
          address: address,
          balance_change: -amount,
          confirmations: 0,
          txid: blio_res.data.txid,
          fee: totalfee,
          note: 'Withdrawal'
        };
        console.log(txobj);

        sbfuncs.createTransaction(user, txobj);
        res.jsonp(blio_res);

      }

    });
};
