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
        <a className="navbar-center desktop-only link" href="/" >
          <div className="logo-text"> SuchBet </div>
          <div className="logo-icon"></div>
        </a>
        <a className="icon-link navbar-left phone-tablet f-left" href="/" >
          <div className="logo-icon"></div>
        </a>

        { loggedIn ? this.renderLoggedIn() : this.renderLoggedOut() }
      </div>
    )
  }
  renderLoggedIn(){
    var open = this.state.dropdown_open ? 'open' : '';
    return (
      <span>
        <div className="navbar-left f-left stats">
          <div className="stat-text"> Address: { this.props.user.dogecoinBlioAddress } </div>
          <div className="stat-text"> Balance: { this.props.user.dogeBalance } </div>
        </div>
        <div className="navbar-right f-right" >
          <div className="dropdown right-55" >
            <div className={`dropdown-head ${open}`} onClick={ ::this.toggleDropDown } >
              { this.props.user.username } ▾
            </div>
            { this.state.dropdown_open ?
              <div className="dropdown-items">
                <div  className="link dropdown-item profile"
                      onClick={ () => { this.closeDropDown(); page('/withdraw'); } }>
                  Withdraw
                </div>
                <div  className="link dropdown-item profile"
                      onClick={ () => { this.closeDropDown(); page('/history'); } }>
                  Account Activity
                </div>
                <div  className="link dropdown-item profile"
                      onClick={ () => { this.closeDropDown(); page('/profile'); } }>
                  Settings
                </div>
                <div  className="link dropdown-item logout"
                      onClick={ () => { this.closeDropDown(); this.props.logout(); } } >
                  Logout
                </div>
              </div> :
              null
            }
          </div>
          <a  className="link navbar-item right-45 my-bets"
              href="/mybets" >
            <div className="wrap">
              <i className="fa fa-list"></i>
              <div className="text" > Bets </div>
            </div>
          </a>
        </div>
      </span>
    )
  }
  renderLoggedOut(){
    return (
      <div className="navbar-right f-right" >
        <a  className="link navbar-item right-50"
            href="/login">
            Login
        </a>
        <a  className="link navbar-item right-50"
            href="/signup">
            Signup
        </a>
      </div>
    )
  }
};
export default Navbar;
