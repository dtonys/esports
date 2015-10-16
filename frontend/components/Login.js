import 'components/forms.sass';
import 'components/forms_extend.sass';
import 'pages/login.sass';

import reactMixin from 'react-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {connect} from 'react-redux';

import _ from 'lodash';
import {toJS} from 'immutable';
import page from 'page';
import serialize from 'form-serialize';

import { validator, runValidators, validatorFactory } from '../helpers/validate.js';
import { forms } from '../helpers/forms.js';

var validUserName = validatorFactory(
  [
    validator.required,
    validator.max( 100 )
  ],
  ['errors','username']
);
var validPassword = validatorFactory(
  [
    validator.required,
    validator.min( 6 )
  ],
  ['errors','password']
);

@reactMixin.decorate(forms)
@reactMixin.decorate(LinkedStateMixin)
class Login extends React.Component{
  constructor( props ){
    super( props );
    this.state = {
      email: '',
      username: '',
      password: '',
      errors: {
        email: [],
        username: [],
        password: []
      }
    };
  }
  submitForm( e ){
    e.preventDefault();
    // extract form data
    var data = serialize( e.target, { hash: true } );
    // validate
    var data_valid = this.validateForm( data, [
      validUserName( data.username ),
      validPassword( data.password )
    ]);

    if( data_valid ){
      this.props.executeLogin(data, ( success ) => {
        if( success )this.props.loginRedirect();
      });
    }
  }
  render(){
    var usr_err = _.get( this.state, 'errors.username' );
    var usr_has_err = usr_err && usr_err.length;

    var pswd_err = _.get( this.state, 'errors.password' );
    var pswd_has_err = pswd_err && pswd_err.length;

    var server_error = _.get( this.props, 'login.error_message' );
    var server_has_error = server_error && !( usr_has_err || pswd_has_err );

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
          { server_has_error ?
              <div className="error input"> { server_error } </div> :
              null
          }
          { usr_has_err ?
            <div className="error input"> { usr_err[0] } </div> :
            null
          }
          <div className="margin-10"></div>
          <input  className="input"
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  // onBlur={ this.validateInputEvt.bind( this, validEmail ) }
                  valueLink={this.linkState('username')} />
          { pswd_has_err ?
              <div>
                <div className="margin-10"></div>
                <div className="error input"> { pswd_err[0] } </div>
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

var mapStateToProps = function( storeState ){
  return {
    login: storeState.get('login').toJS()
  }
};

var LoginContainer = connect(
  mapStateToProps            // subscribe to store update, expose store state
)(Login);

export default LoginContainer;
