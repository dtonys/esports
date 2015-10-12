import page from 'page';

// Navbar
class Navbar extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    var loggedIn = this.props.member;
    return (
      <div className="fixed-navbar" >
        <div className="navbar-left f-left phone-tablet link" onClick={ () => page('/') } >
          <div className="logo-text"> ESports </div>
          <div className="logo-icon"> D </div>
        </div>
        <div className="navbar-center desktop-only link" onClick={ () => page('/') } >
          <div className="logo-text"> ESports </div>
          <div className="logo-icon"> D </div>
        </div>
        { loggedIn ?
            <div className="navbar-right f-right" >
              <a className="link navbar-item right-50" onClick={ this.props.logout } > Logout </a>
            </div>  :
            <div className="navbar-right f-right" >
              <a className="link navbar-item right-50" onClick={ () => page('/login') } > Login </a>
              <a className="link navbar-item right-50" onClick={ () => page('/signup') } > Signup </a>
            </div>

        }
      </div>
    )
  }
};
export default Navbar;
