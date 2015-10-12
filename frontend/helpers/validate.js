var error_map = {
  required: () => 'Required Field',
  email: () => 'Invalid Email',
  _min: (num) => num+' characters required',
  _max: (num) => num+' max characters'
};

/**
 * validate.run
 * return array of error msg
 */
function runValidators( str, validationFns ){
  var errorList = [];
  for( let fn of validationFns ){
    let valid = fn( str );
    if( valid === false ){
      errorList.push( fn.error_message || '' )
    }
  }
  return errorList;
}

/**
 * validate.validators
 *   return string result if valid
 *   return false if invalid
 */
var validators = {};
validators.required = function(str){
  var valid = !!str;
  return valid ? str : false;
}
validators.email = function(str){
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var valid = re.test(str);
  return valid ? str : false;
}

// factory
validators.max = function(limit){
  function _max( str ){
    var valid = str && str.length && str.length <= limit;
    return valid ? str : false;
  }
  _max.error_message = error_map['_max'](limit);
  return _max;
}

validators.min = function(limit){
  function _min( str ){
    var valid = str && str.length && str.length >= limit;
    return valid ? str : false;
  }
  _min.error_message = error_map['_min'](limit);
  return _min;
}

// attach error messages
for( let key in validators ){
  validators[key].error_message = error_map[key] ? error_map[key]() : 'error';
}

export { validators, runValidators }
