// utils used on FE only
var util = require('shared_util');

util.frontend = function(){
  console.log('frontend util');
};

util.bindAll = function( context, ...fn_names ){
  fn_names.forEach( ( fn_name ) => {
    context[fn_name] = context[fn_name].bind(context)
  });
}

module.exports = util;
