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
    this.bet_status = BET_CAN_DO;
    this.match_status = MATCH_READY;
    this.state = {
      betting: false
    };
  }
  openBet( e ){
    if( this.bet_status !== BET_CAN_DO ) return;
    this.setState({
      betting: true
    });
  }
  render(){
    console.log( this.props.matchDetail );
    console.log( "this.props.matchDetail.matchStartTime" );
    var match = this.props.matchDetail.match;
    var startMoment = moment(match.matchStartTime);
    // m.format("dddd, MMMM Do YYYY, h:mm:ss a");

    var betting = this.state.betting;

    var _disabled = (this.bet_status === BET_DONE || this.bet_status === BET_CLOSED) ? 'disabled' : '';

    return (
      <div className="matches-page-container" >
        <div className="section _1 clearfix">
          <div className={`section-left ${ betting ? "left-100" : "left-80" }`}>
            <div className="headline">
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
            <div className="match-status">
              { this.match_status === MATCH_READY ?
                <div className="status match-ready">
                  <div className="text start-date">
                    Start Date: { startMoment.format("dddd, MMMM Do YYYY, h:mm:ss a") }
                    &nbsp;&nbsp;
                    ( { startMoment.fromNow() } )
                  </div>
                </div>
                :
                this.match_status === MATCH_PENDING ?
                <div className="status match-pending">
                  <div className="text start-date">
                    Match Pending
                  </div>
                </div>
                :
                this.match_status === MATCH_RESOLVED ?
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
          { !betting ?
              <div  className={`section-right btn left-20 ${_disabled}`}
                    onClick={ ::this.openBet }>
                <div className="bet-status">
                  { this.bet_status === BET_CAN_DO ?
                      <div className="status bet-can-do">
                        <div className="link" > Place Bet </div>
                      </div>
                    :
                    this.bet_status === BET_DONE ?
                      <div className="status bet-done">
                        <div className="" > Bet placed </div>
                      </div>
                    :
                    this.bet_status === BET_CLOSED ?
                      <div className="status bet-closed">
                        <div className="" > Betting closed </div>
                      </div>
                    :
                      null
                  }
                </div>
              </div>
            :
              null
          }
        </div>
        { betting ?
          <div className="section _2 clearfix">
            <div className="left-40">
              <input  className="input amt"
                        type="text"
                        placeholder="Enter amount to bet"
                        name="username" />
            </div>
            <div className="left-20 for"> for </div>
            <div className="left-40 choose-team">
              <div className="btn team-1"> { match.team1name } </div>
              <div className="btn team-2"> { match.team2name } </div>
            </div>
            <div className="left-100 margin-20"></div>
            <div className="left-50 btn">
              Submit Bet
            </div>
          </div>
          :
          null
        }
        <div className="section _3">
          Match
        </div>
        <pre>
          { JSON.stringify( this.props.matchDetail, null, 2 ) }
        </pre>
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
