import page from 'page';
import 'pages/matches.sass';
import 'components/forms.sass';
import 'components/forms_extend.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

import moment from 'moment';
import util from 'FE_util.js';

import SampleComponent from 'components/SampleComponent.js';
import MatchRow from 'components/MatchRow.js';

class Matches extends React.Component{
  render(){
    return (
      <div className="matches-page-container" >
        <div className="header">
          Matches
        </div>
        {
          this.props.matches.length ?
            this.renderMatchItems.call( this ) :
            this.renderNoResults.call( this )
        }
      </div>
    )
  }
  renderMatchItems(){
    return (
      <div className="match-items">
      {
        this.props.matches.map( ( item ) => {
          item.startMoment = moment(item.matchStartTime);
          item.gameName = item.gameName || 'default';
          item.gameObj = util.gameNameMap[item.gameName] ? util.gameNameMap[item.gameName] : util.gameNameMap['default'];
          item.betTotal = item.betPot.reduce( ( prev, curr ) => {
            return prev + curr;
          });
          return (
            <MatchRow item={ item } />
          )
        })
      }
      </div>
    )
  }
  renderNoResults(){
    return (
      <div className="no-results" >
        There are no matches available right now.
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
