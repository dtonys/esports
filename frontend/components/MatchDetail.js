import page from 'page';
import 'pages/matches.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

class MatchDetail extends React.Component{
  render(){
    return (
      <div className="matches-page-container" >
        Match Detail Page
        { JSON.stringify( this.props.matchDetail ) }
      </div>
    )
  }
}
var mapStateToProps = function( storeState ){
  return {
    matchDetail: storeState.get('matchDetail').toJS()
  }
};

var MatchDetailContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions                     // expose dispatch function, dispatch hooked to action_creators
)(MatchDetail);

export default MatchDetailContainer;
