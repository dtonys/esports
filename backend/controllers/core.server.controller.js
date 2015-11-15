'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  sbfuncs = require('./sbfuncs.js'),
  Transaction = mongoose.model('Transaction'),
	User = mongoose.model('User');

exports.resp = function(req, res) {
	console.log('recieved from blockio');

	//if body has data, we should do something to it.
	if (req.body.data)
	{
		//console.log(req.body);
		var reqdata = req.body.data;
    /*
    example:
     { network: 'DOGETEST',
     address: '2MyW4NU6SsvGn9jLw5jjDbX7k9Nkg4LiCUY',
     balance_change: '1123.00000000',
     amount_sent: '0.00000000',
     amount_received: '1123.00000000',
     txid: 'ef60a49a50ca1fc0c483d1c7f81bac176daf7479e96ec91ef7b29e4e9b81e840',
     confirmations: 0,
     is_green: true }
     */
		/* BALANCE CHANGE CHECK:
		if balance change is negative, we're ignoring it.
		his is because if someone is withdrawing to another address, we should
		andle user balance with the withdraw.
		 */
		if (reqdata.balance_change < 0)
		{
			console.log('withdraw from address: ' + reqdata.address + ' (not handling with webhook)');
			res.jsonp({});
			return;
		}



		/* Try to look this up in the database, using transaction id and address.
		if it already exists, compare confirmations to see what to do:
		*/
    //TODO: check to see if this is already in the database. identify using tranasaction id.
    Transaction.find({'tdid': reqdata.txid}).exec(function(err, txs) {

      if (txs.length > 0)
      {
        console.log('changing confirmations of tx ' + reqdata.txid + ':' +
          txs[0].confirmations + "->" + reqdata.confirmations);
        txs[0].confirmations = reqdata.confirmations;
        txs[0].save();
      }
      //No previous transactions found, so we create a new one.
      //Try to find a user, based on address.
      else
      {
        console.log('trying to find user with address: ' + reqdata.address);
        User.find({'dogecoinBlioAddress': reqdata.address})
          .limit(1)
          .exec(function(err, users) {
            //console.log('users:' + users);
            if (users.length > 0)
            {
              var theuser = users[0];
              console.log('found user: ' + theuser.username);

              var txobj = {
                cryptotype: reqdata.network,
                address: reqdata.address,
                balance_change: reqdata.amount_received,
                txid: reqdata.txid,
                note: "Deposit",
                confirmations:reqdata.confirmations
              };

              sbfuncs.createTransaction(theuser, txobj);

              //Need to return something to server to let them know we received it.
              res.jsonp({});
            }
            else
            {
              console.log('user not found.');
              //need to respond to webhook with blank.
              res.jsonp({});
            }
          });
      }


    });

	}
	else
	{
		console.log('blah, no data!');
    //need to respond to webhook with blank.
    res.jsonp({});
	}


};
