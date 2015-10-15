import 'components/forms.sass';
import 'components/forms_extend.sass';
import 'pages/signup.sass';

import reactMixin from 'react-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {connect} from 'react-redux';

import {toJS} from 'immutable';
import page from 'page';
import serialize from 'form-serialize';

import { validator, runValidators, validatorFactory } from '../helpers/validate.js';
import { forms } from '../helpers/forms.js';

var validEmail = validatorFactory(
  [
    validator.required,
    validator.email,
    validator.max( 100 )
  ],
  ['errors','email']
);
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
class Signup extends React.Component{
  constructor( props ){
    super( props );
    console.log( props );
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
      validEmail( data.email ),
      validUserName( data.username ),
      validPassword( data.password )
    ]);
    if( data_valid ){
      this.props.executeSignup(data, ( success ) => {
        if( success )this.props.loginRedirect();
      });
    }
  }
  render(){
    console.log( JSON.stringify(this.state) );
    console.log( JSON.stringify(this.props.signup) );

    var usr_err = _.get( this.state, 'errors.username' );
    var usr_has_err = usr_err && usr_err.length;

    var email_err = _.get( this.state, 'errors.email' );
    var email_has_err = email_err && email_err.length;

    var pswd_err = _.get( this.state, 'errors.password' );
    var pswd_has_err = pswd_err && pswd_err.length;

    var server_error = _.get( this.props, 'signup.error_message' );
    var server_has_error = server_error && !( usr_has_err || pswd_has_err );

    return (
      <div className="signup-page-container" >
        <form className="generic-form container" onSubmit={ ::this.submitForm } >
          <div className="form-title" > Sign Up</div>
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
            <div>
              <div className="error input"> { usr_err[0] } </div>
              <div className="margin-10"></div>
            </div> :
            null
          }
          <div className="margin-10"></div>
          <input  className="input"
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  valueLink={this.linkState('username')} />
          <div className="margin-10"></div>
          { email_has_err ?
            <div>
              <div className="error input"> { email_err[0] } </div>
              <div className="margin-10"></div>
            </div>  :
            null
          }
          <input  className="input"
                  type="text"
                  placeholder="Enter your email"
                  name="email"
                  valueLink={this.linkState('email')} />
          <div className="margin-10"></div>
          { pswd_has_err ?
              <div>
                <div className="error input"> { pswd_err[0] } </div>
                <div className="margin-10"></div>
              </div> :
              null
          }
          <input  className="input"
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  valueLink={this.linkState('password')} />
          <div className="margin-10"></div>
          <div className="action-items">
            <input type="submit" value="submit" className="action-item submit btn left-50" />
            <div className="action-item link left-50"
              onClick={ () => page('/login') }>
                Log In
            </div>
          </div>
        </form>
      </div>
    )
  }
};

var mapStateToProps = function( storeState ){
  return {
    signup: storeState.get('signup').toJS()
  }
};

var SignupContainer = connect(
  mapStateToProps            // subscribe to store update, expose store state
)(Signup);
export default SignupContainer;
