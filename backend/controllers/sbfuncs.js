'use strict';

var errorHandler = require('./errors.server.controller.js'),
  mongoose = require('mongoose'),
  Match = mongoose.model('Match'),
  Transaction = mongoose.model('Transaction');

module.exports = {


  block_io_config : 'c3f9-2390-cd21-204b',
    //suchbet: 'e093-6355-a839-6878',
    //vadejoseph: 'c3f9-2390-cd21-204b',
  block_io_pin : 'OMFGbl0ck10',
  block_io_vers: 2,

  mailchimp_endpoint : 'https://z:' + '2ce985b55fabca58d3e92f4183993a94-us8' + '@us8.api.mailchimp.com/3.0/',
  mailchimp_list_id : '2456ad2c1a',

  createMatch: function(match_obj, res)
  {
    match_obj.betPot = [0, 0];
    var match = new Match(match_obj);


    /*
     //Save new segment on mailchimp.
     var mailchimp_segment_url = sbfuncs.mailchimp_endpoint + 'lists/' + sbfuncs.mailchimp_list_id + "/segments";
     var mailchimp_segment_data = { 'name': match.id };

     var mailchimp_obj = {
     url: mailchimp_segment_url,
     json: mailchimp_segment_data
     };
     //console.log('post:' + JSON.stringify(mailchimp_obj));

     request.post(mailchimp_obj, function(err, resp, body) {
     console.log('response code: ' + resp.statusCode);
     if (err) {
     console.log('error:' + err);
     }
     else {
     //console.log('body: ' + JSON.stringify(body));
     match.mailChimpSegmentId = body.id;
     }
     });
     */

    match.save(function(err) {
      if (res)
      {
        if (err) {
          console.log(err);
          return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }
        //Return Match Data
        else { res.jsonp(match); }
      }
    });
    return match;
  },


  createTransaction: function (user, txobj, res)
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
    user.dogeBalance += parseInt(txobj.balance_change);
    user.save();

    //Save the transaction in database.
    var transaction = new Transaction(txobj);
    transaction.user = user;
    transaction.curr_balance = user.dogeBalance;
    transaction.save(function(err) {
      if (err) {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log('ERROR CREATING TRANSACTION:' + errorHandler.getErrorMessage(err));

        if (res) {
          return res.status(400).send({ message: errorHandler.getErrorMessage(err)});
        }
      } else {
      }

    });
  }

};
