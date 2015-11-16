/**
 * Created by Joseph on 4/30/2015.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    txid: {
      type: String,
      default: ''
    },
    address: {
      type:String,
      default: ''
    },
    cryptotype: {
      type: String,
      required: 'Need a cryptotype'
    },
    confirmations: {
      type: Number,
      min: 0,
      default: 0
    },
    balance_change: {
        type: Number,
        required: 'Need a balance change #'
    },
    curr_balance: {
        type: Number,
        default: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    fee: {
      type: Number,
      default: 0
    },
    note: {
      type: String,
      default: ''
    },
    //User ID that placed this.
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: 'Need a user'
    }
});

mongoose.model('Transaction', TransactionSchema);
