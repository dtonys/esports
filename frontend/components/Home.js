import 'pages/home.sass';
import page from 'page';
import {connect} from 'react-redux';

class Home extends React.Component{
  constructor( props ){
    super( props );
    console.log( props );
  }
  render(){
    return <div> Home </div>
  }
  render1(){
    var person_data = _.get( this.props, 'person_data' );
    return (
      <table className="table">
        <thead>
          <tr >
            {
              Object.keys( person_data ).map( ( key ) => {
                return <th key={key} > { key } </th>;
              })
            }
          </tr>
        </thead>
        <tbody>
          <tr>
            {
              Object.keys( person_data ).map( ( key ) => {
                return <td key={key} > { person_data[key] } </td>;
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
    person_data: storeState.get('person_data').toJS()
  }
};

var HomeContainer = connect(
  mapStateToProps            // subscribe to store update, expose store state
)(Home);
export default HomeContainer;
