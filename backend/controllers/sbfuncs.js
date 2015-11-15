'use strict';

var errorHandler = require('./errors.server.controller.js'),
  mongoose = require('mongoose'),
  Transaction = mongoose.model('Transaction');

module.exports = {


  block_io_config : 'e093-6355-a839-6878',
    //vadejoseph: 'c3f9-2390-cd21-204b',
  block_io_pin : 'OMFGbl0ck10',
  block_io_vers: 2,

  mailchimp_endpoint : 'https://z:' + '2ce985b55fabca58d3e92f4183993a94-us8' + '@us8.api.mailchimp.com/3.0/',
  mailchimp_list_id : '2456ad2c1a',

  createTransaction: function (user, txobj)
  {
    /*
     var txobj = {
     cryptotype: cryptotype,

     Cases:
     1. Withdrawal: User specified address.
     2. Bet creation: Blank. This is going to our "pool".
     3. Bet Payout: User's address. This is going back to the user.
     4. Deposit: User's address.
     address: address,


     balance_change: -amount, //negative is leaving the wallet.
     confirmations: 0,
     txid: blio_res.data.txid
     };
    */

    //Change user's balance.
    user.dogeBalance += txobj.balance_change;
    user.save();

    //Save the transaction in database.
    var transaction = new Transaction(txobj);
    transaction.user = user;
    transaction.save(function(err) {
      if (err) {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log('ERROR CREATING TRANSACTION:' + errorHandler.getErrorMessage(err));
        /*
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
        */
      } else {
      }

    });
  }

};
