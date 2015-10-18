import page from 'page';
import 'pages/matches.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

class Matches extends React.Component{
  render(){
    return (
      <div className="matches-page-container" >
        <div className="header">
          Matches
        </div>
        <div className="match-items">
          {
            this.props.matches.map( ( item ) => {
              return (
                <div  className="match-item"
                      key={item._id}
                      onClick={ () => page(`/matches/${item._id}`) } >
                  <div className="start-date">
                    Match begins on: &nbsp;
                    { new Date(item.matchStartTime).toString() }
                  </div>
                  <pre>
                    { JSON.stringify( item, null, 2 ) }
                  </pre>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
var mapStateToProps = function( storeState ){
  return {
    matches: storeState.get('matches').toJS()
  }
};

var MatchesContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions                     // expose dispatch function, dispatch hooked to action_creators
)(Matches);

export default MatchesContainer;
