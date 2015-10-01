'use strict';

var BlockIo = require('block_io');
var block_io = new BlockIo('c3f9-2390-cd21-204b', 'OMFGbl0ck10', 2);

module.exports = {

    get_user_balance: function (req, res, next)
    {
        console.log('ok');
        /*
        //Get address of user
        block_io.get_address_balance({'address':'123123'},
            function(blio_req, blio_res)
            {

            });


        //get all active bets of user,

        return 30;
        */
    }

};
