import page from 'page';
import 'pages/matches.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

class MatchDetail extends React.Component{
  render(){
    console.log( this.props.matchDetail );
    console.log( "this.props.matchDetail.matchStartTime" );
    var match = this.props.matchDetail.match;
    return (
      <div className="matches-page-container" >
        <div className="header">
          { match.gameName } match between { match.team1name } and { match.team2name }
        </div>
        <div className="match-items">
          <div  className="match-item"
                key={match._id}
                onClick={ () => page(`/matches/${match._id}`) } >
            <div className="start-date">
              Match begins on: &nbsp;
              { new Date(match.matchStartTime).toString() }
            </div>
            <pre>
              { JSON.stringify( this.props.matchDetail, null, 2 ) }
            </pre>
          </div>
        </div>
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
