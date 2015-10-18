import page from 'page';
import 'components/forms.sass';
import 'components/forms_extend.sass';
import 'pages/profile.sass';

import reactMixin from 'react-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import serialize from 'form-serialize';

import { validator, runValidators, validatorFactory } from '../helpers/validate.js';
import { forms } from '../helpers/forms.js';

@reactMixin.decorate(forms)
@reactMixin.decorate(LinkedStateMixin)
class Profile extends React.Component{
  constructor( props ){
    super( props );
    this.state = {
      current: '',
      new: '',
      verify: ''
    };
  }
  render(){
    var renderFn = ::this.renderProfile;
    var map = {
      'accounts': ::this.renderSocial,
      'password': ::this.renderPassword
    }
    if( this.props.params.section && map[this.props.params.section] )
      renderFn = map[this.props.params.section]

    return (
      <div className="profile-page-container" >
        { renderFn() }
      </div>
    )
  }
  renderInput( name ){
    return (
    <input  className="input"
            type="text"
            placeholder={ name }
            name={ name }
            valueLink={this.linkState(name)} />
    )
  }
  submitForm( e ){
    e.preventDefault();
    alert('submitForm');
  }
  renderProfile(){
    return (
      <div className="">
        <form className="generic-form container" onSubmit={ ::this.submitForm }>
          <div className="form-title" > Edit your profile </div>
          <div className="margin-10"></div>
          { this.renderInput("email") }
          <div className="margin-10"></div>
          <input type="submit" value="submit" className="action-item submit btn left-100" />
        </form>
      </div>
    )
  }
  renderSocial(){
    return (
      <div className=""> Manage Social </div>
    )
  }
  renderPassword(){
    return (
      <div className="">
        <form className="generic-form container" onSubmit={ ::this.submitForm }>
          <div className="form-title" > Change Password </div>
          <div className="margin-10"></div>
          { this.renderInput("current") }
          <div className="margin-10"></div>
          { this.renderInput("new") }
          <div className="margin-10"></div>
          { this.renderInput("verify") }
          <div className="margin-10"></div>
          <input type="submit" value="submit" className="action-item submit btn left-100" />
        </form>
      </div>
    )
  }

}
export default Profile;
