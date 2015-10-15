import {Map, List, fromJS, toJS} from 'immutable';
import { validators, runValidators } from '../helpers/validate.js';

var forms = {};

forms.thing = function(  ){
}

// validate a single input via evt, firing a setState
forms.validateEvt = function( { validators = [], error_path }, e ){
  var str = e.target.value;
  var state = fromJS( this.state );
  update = this.validateInput( { validators, error_path }, str, state ).update;
  this.setState( update.toJS() );
}

// run validators for given string, returning errors array.
// errors array saved to error_path
// return { valid, updated state }
forms.validateString = function( { validators = [], error_path }, str, state ){
  var errors = runValidators( str, validators);
  var update = state.setIn( error_path , List(errors) );
  var valid = !errors.length;
  return { valid, update }
};

// form_data,
// inputArray = [
//  {
//    validators, error_path, data_key
//  }
// ]
forms.validateForm = function( form_data, inputArray ){
    var form_valid = true;
    var state = fromJS( this.state );
    var result;

    inputArray.forEach( ({validators, error_path, string}) => {
      result = this.validateString( {validators, error_path}, string, state );
      state = result.update;
      form_valid = form_valid && result.valid;
    });

    // show errors if any
    this.setState( state.toJS() );
    return form_valid;
};

export { forms };
