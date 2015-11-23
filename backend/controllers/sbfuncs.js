'use strict';

var errorHandler = require('./errors.server.controller.js'),
  mongoose = require('mongoose'),
  Match = mongoose.model('Match'),
  Bet = mongoose.model('Bet'),
  Transaction = mongoose.model('Transaction');

var createMatch = function(match_obj, res, callback)
{
  if (typeof res === 'function') {
    callback = res;
    res = null;
  }

  Match.count(match_obj, function(err, matchcount) {

    //Check for a repeat if we're not expecting a response.
    if (res == null && matchcount > 0)
    {
      console.log('This match already exists in the database!');

      if (callback != null)
        return callback({});
    }
    else
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
        if (res) {
          if (err) {
            console.log(err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }
          //Return Match Data
          else { res.jsonp(match); }
        }
      });

      if (callback != null)
        return callback(match);

    }

  });
};

//assumes the match is valid.
var resolveMatch = function(match, matchres, req, res)
{
  console.log('RESOLVING MATCH:' + match.gameName + " - " + match.tourneyName +
    "(" + match.outcomeNames[0] + " vs " + match.outcomeNames[1] + ")");

  var payoutnote = "Payout for " + match.outcomeNames[0] + " vs " + match.outcomeNames[1];

  match.result = matchres;
  match.status = 3;
  match.save();

  //emails of users that bet on this match.
  var match_emails = [];

  Bet.find({'match':match})
    .populate('user')
    .exec(function(err, bets) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        ////////// BET PAYOUT START ///////////////

        //get the total bet amounts
        var totals = [0, 0];
        var shares = [0, 0];
        for (var i in bets)
        {
          var bet = bets[i];
          if (parseInt(bet.amount) > 0)
          {
            totals[bet.prediction] += bet.amount;
            shares[bet.prediction] += bet.stake;
          }
        }

        console.log('1 total:' + totals[0]);
        console.log('2 total:' + totals[1]);

        var TEMPTOTAL = 0;

        //Calculate payout to distribute to players, by:
        //1. winner total (stakes) is shares[matchres]
        //2. payout is sum of all the non-winning total.
        var winnertot = shares[matchres];
        var payout = 0;
        for (var p = 0; p < totals.length; p++)
        {
          if (p === matchres) continue;
          payout += totals[p];
        }

        //Take 5% rake from loser
        payout = Math.ceil(payout * 0.95);

        //for each valid bet, get the ratio
        for (var j in bets)
        {
          var bet2 = bets[j];

          //If a correct bet, and the bet amount is more than 0
          if (bet2.prediction === matchres && bet2.amount > 0 && bet2.stake > 0)
          {
            var betratio = bet2.stake / winnertot;

            //give player back his bet, and the payout.
            var playerpayout = bet2.amount + Math.ceil(betratio * payout);

            console.log(bet2.user.username + ':' + bet2.amount + '->' + playerpayout + ' (' + bet2.user.email + ')');

            //Save the bet's status
            // Maybe need to change this to += to properly keep track of payouts
            // (in case of server error double spending, etc).
            bet2.status += playerpayout;
            bet2.save();


            //Update user by giving him currency.
            var txobj = {
              cryptotype: "DOGE",
              address: bet2.user.dogecoinBlioAddress,
              balance_change: playerpayout,
              txid: "",
              note: payoutnote
            };

            createTransaction(bet2.user, txobj);

            TEMPTOTAL += playerpayout;
          }
          match_emails.push(bet2.user.email);
        }

        //Printing information about stuff.
        console.log('total payout:' + TEMPTOTAL);
        var TEMPRAKE = totals[0] + totals[1] - TEMPTOTAL;
        console.log('rake:' + TEMPRAKE);


        match.status = 5;
        match.save();


        //TODO:Send a mailchimp email out to all people who bet in the match.
        //Problem: cannot have more than 10 conditions. so, need to find a way to manually add shit to a segment.
        /** 1. update the segment */
        /*
         var mailchimp_segment_url = sbfuncs.mailchimp_endpoint + 'lists/' +
         sbfuncs.mailchimp_list_id + "/segments/" + match.mailChimpSegmentId;

         var mailchimpconditions = [];
         for (var i = 0; i < match_emails.length; i++)
         {
         mailchimpconditions.push({
         "condition_type": "EmailAddress",
         "field": "merge0",
         "op": "is",
         "value": match_emails[i]
         });
         }

         var mailchimp_segment_data = {
         'name': match.id,
         'options': {
         'match': 'any',
         'conditions': mailchimpconditions
         }
         };

         var mailchimp_obj = {
         url: mailchimp_segment_url,
         json: mailchimp_segment_data
         };
         console.log('patch:' + JSON.stringify(mailchimp_obj));

         request.patch(mailchimp_obj, function(err, resp, body) {
         console.log('response code: ' + resp.statusCode);
         if (err) {
         console.log('error:' + err);
         }
         else {
         console.log('body: ' + JSON.stringify(body));
         }
         });
         */

        /** 2. create the email and send it to the segment we created above. */


        /*
         var mailchimp_data = {
         'status' : 'subscribed',
         'email_address' : user.email,
         'merge_fields' : {
         'FNAME' : user.username
         }};



         */
      }
    });
  //res.jsonp({});
};

var createTransaction = function (user, txobj, res)
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
};

module.exports = {


  block_io_config : 'c3f9-2390-cd21-204b',
    //suchbet: 'e093-6355-a839-6878',
    //vadejoseph: 'c3f9-2390-cd21-204b',
  block_io_pin : 'OMFGbl0ck10',
  block_io_vers: 2,

  mailchimp_endpoint : 'https://z:' + '2ce985b55fabca58d3e92f4183993a94-us8' + '@us8.api.mailchimp.com/3.0/',
  mailchimp_list_id : '2456ad2c1a',

  createTransaction:createTransaction,
  createMatch:createMatch,
  resolveMatch:resolveMatch


};
