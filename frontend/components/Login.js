import 'components/forms.sass';
import 'components/forms_extend.sass';
import 'pages/login.sass';

import reactMixin from 'react-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import _ from 'lodash';
import {Map, List, fromJS, toJS} from 'immutable';
import page from 'page';
import serialize from 'form-serialize';

import * as validate from '../validate.js';
const validators = validate.validators;
import util from 'FE_util.js';

var validEmail = {
  validators: [
    validators.required,
    validators.email,
    validators.max( 100 )
  ],
  key_path: ['errors','email']
};
var validPassword = {
  validators: [
    validators.required,
    validators.min( 6 )
  ],
  key_path: ['errors','password']
};

@reactMixin.decorate(LinkedStateMixin)
class Login extends React.Component{
  constructor( props ){
    super( props );
    this.state = {
      email: '',
      password: '',
      errors: {
        email: [],
        password: []
      }
    };
  }
  submitForm( e ){
    e.preventDefault();
    // extract form data
    var data = serialize( e.target, { hash: true } );
    // validate
    var data_valid = this.validateForm( data );
    if( data_valid ) this.props.postLogin({});
  }
  validateForm( data = {} ){
    var form_valid = true;
    var state = fromJS( this.state );
    var result;

    result = this.validateInput( validEmail, data.email, state );
    state = result.update;
    form_valid = form_valid && result.valid;

    result = this.validateInput( validPassword, data.password, state );
    state = result.update;
    form_valid = form_valid && result.valid;

    this.setState( state.toJS() );
    return form_valid;
  }
  validateInputEvt( { validators, key_path }, e ){
    var str = e.target.value;
    var state = fromJS( this.state );
    state = this.validateInput( { validators, key_path }, str, state ).update;
    this.setState( state.toJS() );
  }
  validateInput( { validators, key_path }, str, state ){
    var errors = validate.run( str, validators);
    var update = state.setIn( key_path , List(errors) );
    var valid = !errors.length;
    return { valid, update }
  }
  render(){
    var email_errors = _.get( this.state, 'errors.email' );
    var password_errors = _.get( this.state, 'errors.password' );
    return (
      <div className="login-page-container" >
        <form className="generic-form container" onSubmit={ ::this.submitForm } >
          <div className="form-title" > Log In </div>
          <div className="margin-10"></div>
          <div className="social-options" >
            <img className="social-option-img" src="/img/facebook.png" />
            <img className="social-option-img" src="/img/twitter.png" />
            <img className="social-option-img" src="/img/google.png" />
            <img className="social-option-img" src="/img/linkedin.png" />
            <img className="social-option-img" src="/img/github.png" />
          </div>
          { email_errors && email_errors.length ?
            <div className="error input"> { email_errors[0] } </div> :
            null
          }
          <div className="margin-10"></div>
          <input  className="input"
                  type="text"
                  placeholder="Enter your email"
                  name="email"
                  // onBlur={ this.validateInputEvt.bind( this, validEmail ) }
                  valueLink={this.linkState('email')} />
          { password_errors && password_errors.length ?
              <div>
                <div className="margin-10"></div>
                <div className="error input"> { password_errors[0] } </div>
              </div> :
              null
          }
          <div className="margin-10"></div>
          <input  className="input"
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  // onBlur={ this.validateInputEvt.bind( this, validPassword ) }
                  valueLink={this.linkState('password')} />
          <div className="margin-10"></div>
          <div className="action-items">
            <input type="submit" value="submit" className="action-item submit btn left-50" />
            <div className="action-item link left-50"
              onClick={ () => page('/') }>
                Forgot Password?
            </div>
          </div>
        </form>
      </div>
    )
  }
};
export default Login;
