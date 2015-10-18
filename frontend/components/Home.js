import 'pages/home.sass';
import page from 'page';
import {connect} from 'react-redux';

class Home extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    return <div> Home </div>
  }
  render1(){
    var user = _.get( this.props, 'user' );
    return (
      <table className="table">
        <thead>
          <tr >
            {
              Object.keys( user ).map( ( key ) => {
                return <th key={key} > { key } </th>;
              })
            }
          </tr>
        </thead>
        <tbody>
          <tr>
            {
              Object.keys( user ).map( ( key ) => {
                return <td key={key} > { user[key] } </td>;
              })
            }
          </tr>
        </tbody>
      </table>
    )
  }
};
export default Home;

var mapStateToProps = function( storeState ){
  return {
    user: storeState.get('user').toJS()
  }
};

var HomeContainer = connect(
  mapStateToProps            // subscribe to store update, expose store state
)(Home);
export default HomeContainer;
