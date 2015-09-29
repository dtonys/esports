import page from 'page';
import 'pages/matches.sass';

class Matches extends React.Component{
  render(){
    return (
      <div>
        Matches Page
        <button onClick={ () => page('/') }> Home </button>
        <button onClick={ () => page('/profile') }> Profile </button>
        <button onClick={ () => page('/matches') }> Matches </button>
      </div>
    )
  }
}
export default Matches;
