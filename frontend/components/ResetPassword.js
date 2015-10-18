import 'pages/reset_password.sass';
import 'components/forms.sass';
import 'components/forms_extend.sass';

class ResetPassword extends React.Component{
  constructor( props ){
    super( props );
    console.log( props );
  }
  submitForm( e ){
    e.preventDefault();
    alert('todo');
  }
  render(){
    return (
      <div className="reset-password-page-container" >
        <form className="generic-form container" onSubmit={ ::this.submitForm } >
          <div className="form-title" > Reset your password </div>
          <div className="margin-10"></div>
          <input  className="input"
                  type="text"
                  placeholder="Enter your username"
                  name="username" />
          <div className="margin-10"></div>
          <div className="action-items clearfix">
            <input type="submit" value="submit" className="action-item submit btn left-100" />
          </div>
        </form>
      </div>
    )
  }
};
export default ResetPassword;
