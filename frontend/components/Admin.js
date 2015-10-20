import page from 'page';
import 'components/forms.sass';
import 'components/forms_extend.sass';
import 'pages/sample.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

class Admin extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    console.log( this.state );
    console.log( this.props );
    return (
      <div className="sample-page-container" >
        Admin Page
      </div>
    )
  }
};

var mapStateToProps = function( storeState ){
  return {
    state: storeState.toJS()
  }
};

var AdminContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions
)(Admin);

export default Admin;
