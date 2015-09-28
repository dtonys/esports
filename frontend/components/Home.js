import page from 'page';
import 'pages/home.sass';

class Home extends React.Component{
  constructor( props ){
    super( props );
    console.log( props );
  }
  render(){
    return (
      <div >
        Home Page
        <button onClick={ () => page('/') }> Home </button>
        <button onClick={ () => page('/profile') }> Profile </button>
        <button onClick={ () => page('/matches') }> Matches </button>
      </div>
    )
  }
};
export default Home;
