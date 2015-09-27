import page from 'page';

class Profile extends React.Component{
  render(){
    return (
      <div>
        Profile Page
        <button onClick={ () => page('/') }> Home </button>
        <button onClick={ () => page('/profile') }> Profile </button>
        <button onClick={ () => page('/matches') }> Matches </button>
      </div>
    )
  }
}
export default Profile;
