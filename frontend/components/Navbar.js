import page from 'page';

// Navbar
class Navbar extends React.Component{
  constructor( props ){
    super( props );
    this.state = {
      dropdown_open: false
    };
  }
  toggleDropDown( e ){
    this.setState({
      dropdown_open: !this.state.dropdown_open
    });
  }
  closeDropDown( e ){
    this.setState({
      dropdown_open: false
    });
  }
  // doLogout(){
  //   this.closeDropDown();
  //   this.props.logout();
  // }
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
        { loggedIn ? this.renderLoggedIn() : this.renderLoggedOut() }
      </div>
    )
  }
  renderLoggedIn(){
    var open = this.state.dropdown_open ? 'open' : '';
    return (
      <div className="navbar-right f-right" >
        <div className="dropdown right-55" >
          <div className={`link dropdown-head ${open}`} onClick={ ::this.toggleDropDown } >
            { this.props.user.username }
          </div>
          { this.state.dropdown_open ?
            <div className="dropdown-items">
              <div  className="link dropdown-item profile"
                    onClick={ () => { this.closeDropDown(); page('/profile'); } }>
                Edit Profile
              </div>
              <div  className="link dropdown-item social"
                    onClick={ () => { this.closeDropDown(); page('/profile/accounts'); } } >
                Social Accounts
              </div>
              <div  className="link dropdown-item social"
                    onClick={ () => { this.closeDropDown(); page('/profile/password'); } } >
                Change Password
              </div>
              <div  className="link dropdown-item logout"
                    onClick={ () => { this.closeDropDown(); this.props.logout(); } } >
                Logout
              </div>
            </div> :
            null
          }
        </div>
      </div>
    )
  }
  renderLoggedOut(){
    return (
      <div className="navbar-right f-right" >
        <a className="link navbar-item right-50" onClick={ () => page('/login') } > Login </a>
        <a className="link navbar-item right-50" onClick={ () => page('/signup') } > Signup </a>
      </div>
    )
  }
};
export default Navbar;
