'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	User = mongoose.model('User');


exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.resp = function(req, res) {
	console.log('recieved from blockio');

	//if body has data, we should do something to it.
	if (req.body.data)
	{
		//console.log(req.body);
		var reqdata = req.body.data;

		/* BALANCE CHANGE CHECK:
		if balance change is negative, we're ignoring it.
		his is because if someone is withdrawing to another address, we should
		andle user balance with the withdraw.
		 */
		if (reqdata.balance_change < 0)
		{
			console.log('withdraw from address: ' + reqdata.address);
			res.jsonp({});
			return;
		}



		/* Try to look this up in the database, using transaction id and address.
		if it already exists, compare confirmations to see what to do:
		*/



		//Try to find a user, based on address.
		console.log('trying to find user with address: ' + reqdata.address);
		User.find({'dogecoinBlioAddress': reqdata.address})
			.limit(1)
			.exec(function(err, users) {
				//console.log('users:' + users);
				if (users.length > 0)
				{
					var theuser = users[0];
					theuser.dogeBalance += parseInt(reqdata.balance_change);
					console.log('found user: ' + theuser.username);
					theuser.save();
					res.jsonp({});
				}
				else
				{
					console.log('user not found.');
				}
			});

		//
		/*
		console.log('address: ' + reqdata.address);
		console.log('txid: ' + reqdata.txid);
		console.log('confirmation: ' + reqdata.confirmations);

		console.log('amount: ' + reqdata.balance_change);
		console.log('-------------------------');
		*/

		//check to see if this is already in the database. identify using address and


		//try to find a user, based on the address.


	}
	else
	{
		console.log('blah, no data!');
		//need to respond to webhook with blank.
		res.jsonp({});
	}

};
