import page from 'page';
import 'pages/notfound.sass';

class NotFound extends React.Component{
  constructor( props ){
    super( props );
    console.log( props );
  }
  render(){
    return (
      <div>
        NotFound
        <button onClick={ () => page('/') }> Home </button>
      </div>
    )
  }
};
export default NotFound;
