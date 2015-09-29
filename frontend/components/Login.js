import 'components/forms.sass';
import 'components/forms_extend.sass';
import 'pages/login.sass';

import page from 'page';

class Login extends React.Component{
  constructor( props ){
    super( props );
    console.log( props );
  }
  render(){
    return (
      <div className="login-page-container" >
        <div className="generic-form container" >
          <div className="form-title" > Log In </div>
          <div className="margin-10"></div>
          <div className="social-options" >
            <img className="social-option-img" src="/img/facebook.png" />
            <img className="social-option-img" src="/img/twitter.png" />
            <img className="social-option-img" src="/img/google.png" />
            <img className="social-option-img" src="/img/linkedin.png" />
            <img className="social-option-img" src="/img/github.png" />
          </div>
          <div className="margin-10"></div>
          <input className="input" type="text" placeholder="Enter your email" />
          <div className="margin-10"></div>
          <input className="input" type="password" placeholder="Enter your password" />
          <div className="margin-10"></div>
          <div className="action-items">
            <div className="action-item submit btn left-50">
              Submit
            </div>
            <div className="action-item link left-50"
              onClick={ () => page('/') }>
                Forgot Password?
            </div>
          </div>
        </div>
      </div>
    )
  }
};
export default Login;
