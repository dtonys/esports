import page from 'page';
import 'pages/matches.sass';
import 'components/forms.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

import moment from 'moment';

// Bet Status
const BET_CAN_DO        = 1;
const BET_DONE          = 2;
const BET_CLOSED        = 3;
// Match Status
const MATCH_READY       = 1;
const MATCH_PENDING     = 2;
const MATCH_RESOLVED    = 3;

class MatchDetail extends React.Component{
  constructor( props ){
    super( props );
  }

  render(){
    console.log( this.props.matchDetail );
    console.log( "this.props.matchDetail.matchStartTime" );
    var match = this.props.matchDetail.match;
    var startMoment = moment(match.matchStartTime);
    // m.format("dddd, MMMM Do YYYY, h:mm:ss a");

    var bet_status = BET_CAN_DO;
    var match_status = MATCH_READY;

    return (
      <div className="matches-page-container" >
        <div className="section _1">
          <div className="section-top clearfix">
            <div className="headline left-80">
              <a  className="link"
                  href={`/?gameName=${match.gameName}`}
                  target="_blank" >{ match.gameName }</a>
              &nbsp;match between&nbsp;
              <a  className="link"
                  href={`/?teamName=${match.team1name}`}
                  target="_blank" >{ match.team1name }</a>
              &nbsp;and&nbsp;
              <a  className="link"
                  href={`/?teamName=${match.team2name}`}
                  target="_blank" >{ match.team2name }</a>
            </div>
            <div className="bet-status left-20">
              { bet_status === BET_CAN_DO ?
                  <div className="status bet-can-do">
                    <div className="link btn" > Place Bet </div>
                  </div>
                :
                bet_status === BET_DONE ?
                  <div className="status bet-done">
                    <div className="btn disabled" > Bet placed </div>
                  </div>
                :
                bet_status === BET_CLOSED ?
                  <div className="status bet-closed">
                    <div className="btn disabled" > Betting closed </div>
                  </div>
                :
                  null
              }
            </div>
          </div>
          <div className="section-bot">
            <div className="match-status">
              { match_status === MATCH_READY ?
                <div className="status match-ready">
                  <div className="text start-date">
                    Start Date: { startMoment.format("dddd, MMMM Do YYYY, h:mm:ss a") }
                    &nbsp;&nbsp;
                    ( { startMoment.fromNow() } )
                  </div>
                </div>
                :
                match_status === MATCH_PENDING ?
                <div className="status match-pending">
                  <div className="text start-date">
                    Match Pending
                  </div>
                </div>
                :
                match_status === MATCH_RESOLVED ?
                <div className="status match-resolved">
                  <div className="text start-date">
                    Match Resolved
                  </div>
                </div>
                :
                null
              }
            </div>
          </div>
        </div>
        <div className="section _2">
          Place Bet / View Placed Bet
        </div>
        <div className="section _3">
          Match
        </div>


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
