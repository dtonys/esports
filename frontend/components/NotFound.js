import page from 'page';
import 'pages/notfound.sass';

class NotFound extends React.Component{
  constructor( props ){
    super( props );
    console.log( props );
  }
  render(){
    return (
      <div className="_404-page-container" >
        Page Not Found
      </div>
    )
  }
};
export default NotFound;
