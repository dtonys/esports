import 'components/forms.sass';
import 'components/forms_extend.sass';
import 'pages/profile.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

import reactMixin from 'react-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import _ from 'lodash';
import {toJS} from 'immutable';
import page from 'page';
import serialize from 'form-serialize';

import { validator, runValidators, validatorFactory } from '../helpers/validate.js';
import { forms } from '../helpers/forms.js';

var validPassword = function( path ){
  return validatorFactory(
    [
      validator.required,
      validator.min( 6 )
    ],
    path
  );
};
var validCurrent = validPassword( [ 'errors', 'currentPassword' ] );
var validNew = validPassword( [ 'errors', 'newPassword' ] );
var validVerify = validPassword( [ 'errors', 'verifyPassword' ] );

var validEmail = validatorFactory(
  [
    validator.required,
    validator.email,
    validator.max( 100 )
  ],
  ['errors','email']
);

@reactMixin.decorate(forms)
@reactMixin.decorate(LinkedStateMixin)
class Profile extends React.Component{
  constructor( props ){
    super( props );
    var section = this.props.route_ctx.params.section;

    this.state = {
      currentPassword: '',
      newPassword: '',
      verifyPassword: '',
      email: props.user && props.user.email ? props.user.email: '',
      password: {
        success: false,
        error: false
      },
      errors: {
        currentPassword: [],
        newPassword: [],
        verifyPassword: [],
        email: []
      },
      save_profile_success: false,
      email_toggle: section === 'email',
      password_toggle: section === 'password',
      notif_toggle: section === 'notifications'
    };
  }

  updateProfile( e ){
    e.preventDefault();
    var data = serialize( e.target, { hash: true } );
    // alert( JSON.stringify(data, null, 2) );

    var data_valid = this.validateForm( data, [
      validEmail(data.email)
    ]);
    if( !data_valid ) return;

    this.props.putMe( data )
      .then( () => {
        this.setState({
          save_profile_success: true
        });
      })
  }
  updatePassword( e ){
    e.preventDefault();
    var data = serialize( e.target, { hash: true } );
    // alert( JSON.stringify(data, null, 2) );

    // FE Validate
    var data_valid = this.validateForm( data, [
      validCurrent(data.currentPassword),
      validNew(data.newPassword),
      validVerify(data.verifyPassword)
    ]);
    if( !data_valid ) return;

    // FE validate
    this.props.postMePassword( data )
      .then( ( res ) => {
        this.setState({
          currentPassword: '',
          newPassword: '',
          verifyPassword: '',
          password: {
            error: false,
            success: res.body.message
          }
        })
      })
      .catch( ( res ) => {
        this.setState({
          currentPassword: '',
          newPassword: '',
          verifyPassword: '',
          password: {
            error: res.response.body.message,
            success: false
          }
        })
      })
  }
  submitForm( e ){
    e.preventDefault();
    alert('submitForm');
  }
  toggleState( state_key ){
    this.setState({
      [state_key]: !this.state[state_key]
    })
  }
  render(){
    return (
      <div className="profile-page-container" >
        { this.renderProfile() }
        <div className="margin-10"></div>
        { this.renderPassword() }
        <div className="margin-10"></div>
        { this.renderNotifSettings() }
        <div className="margin-10"></div>
      </div>
    )
  }
  renderInput( { name, type, placeholder } ){
    type = type || 'text';
    placeholder = placeholder || name;
    return (
      <input  className="input"
              type={ type }
              placeholder={ placeholder }
              name={ name }
              valueLink={this.linkState(name)} />
    )
  }
  renderProfile(){
    var email_err = _.get( this.state, 'errors.email' );
    var has_email_err = email_err && email_err.length;

    return (
      <div className="">
        <form className="generic-form container clearfix"
              onSubmit={ ::this.updateProfile } >
          <div  className="form-title"
                onClick ={ this.toggleState.bind(this, 'email_toggle' )}>
            Change Email
          </div>
          <div className="form-toggle" >
            { this.state.email_toggle ?
                <div className="on"> ▲ </div>
              :
                <div className="off"> ▼ </div>
            }
          </div>
            { this.state.email_toggle ? renderFormContents.call(this) : null }
        </form>
      </div>
    )

    function renderFormContents(){
      return (
        <div>
          <div className="margin-10"></div>
          { this.state.save_profile_success ?
              <div>
                <div className="success input"> Profile Saved Successfully </div>
                <div className="margin-10"></div>
              </div> :
              null
          }
          {
            has_email_err ?
              <div>
                <div className="error input"> { email_err[0] } </div>
                <div className="margin-10"></div>
              </div> :
              null
          }
          { this.renderInput({ name: "email", type: "email"}) }
          <div className="margin-10"></div>
          <input type="submit" value="submit" className="action-item submit btn left-100" />
        </div>
      )
    }

  }
  // renderSocial(){
  //   // TODO: social
  //   return (
  //     <div className="">
  //       <form className="generic-form container clearfix" >
  //         <div className="form-title" > Connect other social accounts: </div>
  //         <div className="social-options" >
  //           <img className="social-option-img" src="/img/facebook.png" />
  //           <img className="social-option-img" src="/img/twitter.png" />
  //           <img className="social-option-img" src="/img/google.png" />
  //           <img className="social-option-img" src="/img/linkedin.png" />
  //           <img className="social-option-img" src="/img/github.png" />
  //         </div>
  //       </form>
  //     </div>
  //   )
  // }
  renderPassword(){
    var curr_err = _.get( this.state, 'errors.currentPassword' );
    var has_curr_err = curr_err && curr_err.length;

    var new_err = _.get( this.state, 'errors.newPassword' );
    var has_new_err = new_err && new_err.length;

    var verify_err = _.get( this.state, 'errors.verifyPassword' );
    var has_verify_err = verify_err && verify_err.length;

    var server_error = _.get( this.state, 'password.error' );

    return (
      <div className="">
        <form className="generic-form container clearfix"
              onSubmit={ ::this.updatePassword } >
          <div  className="form-title"
                onClick ={ this.toggleState.bind(this, 'password_toggle' ) }  >
            Change Password
          </div>
          <div className="form-toggle" >
            { this.state.password_toggle ?
                <div className="on"> ▲ </div>
              :
                <div className="off"> ▼ </div>
            }
          </div>
          { this.state.password_toggle ? renderFormContents.call(this) : null }
        </form>
      </div>
    )

    function renderFormContents(){
      return (
        <div>
         { server_error ?
              <div>
                <div className="margin-10"></div>
                <div className="error input"> { server_error } </div>
              </div> :
              null
          }
          { this.state.password.success ?
              <div>
                <div className="margin-10"></div>
                <div className="success input"> { this.state.password.success } </div>
              </div> :
              null
          }
          <div className="margin-10"></div>
          {
            has_curr_err ?
              <div>
                <div className="error input"> { curr_err[0] } </div>
                <div className="margin-10"></div>
              </div> :
              null
          }
          { this.renderInput({
              name: "currentPassword",
              type: "password",
              placeholder: "Enter current password"
            })
          }
          <div className="margin-10"></div>
          {
            has_new_err ?
              <div>
                <div className="error input"> { new_err[0] } </div>
                <div className="margin-10"></div>
              </div> :
              null
          }
          { this.renderInput({
              name: "newPassword",
              type: "password",
              placeholder: "Enter new password"
            })
          }
          <div className="margin-10"></div>
          {
            has_verify_err ?
              <div>
                <div className="error input"> { verify_err[0] } </div>
                <div className="margin-10"></div>
              </div> :
              null
          }
          { this.renderInput({
              name: "verifyPassword",
              type: "password",
              placeholder: "Confirm new password"
            })
          }
          <div className="margin-10"></div>
          <input type="submit" value="submit" className="action-item submit btn left-100" />
        </div>
      )
    }

  }
  renderNotifSettings(){
    return (
      <form className="generic-form container clearfix">
        <div  className="form-title"
              onClick ={ this.toggleState.bind(this, 'notif_toggle' )} >
          Notification Settings
        </div>
        <div className="form-toggle" >
          { this.state.notif_toggle ?
              <div className="on"> ▲ </div>
            :
              <div className="off"> ▼ </div>
          }
        </div>
        { this.state.notif_toggle ? renderFormContents.call(this) : null }
      </form>
    )

    function renderFormContents(){
      return (
        <div>
          <input id="emailOptIn"
                 type="checkbox"
                 name="emailOptIn"
                 valueLink={this.linkState("emailOptIn")}
                 className = "checkbox"/>
          <label htmlFor="emailOptIn" className="label">
            <div className="checked-box"></div>
            <div className="unchecked-box"></div>
            Email Opt In
          </label>
        </div>
      )
    }
  }
}

// export specific areas of state tree
var mapStateToProps = function( storeState ){
  return {
    user: storeState.get('user') ? storeState.get('user').toJS() : null
  }
};

var ProfileContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions
)(Profile);

export default ProfileContainer;
