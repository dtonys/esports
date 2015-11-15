import page from 'page';
import 'pages/matches.sass';
import 'components/forms.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';
import { enforce } from '../helpers/validate.js';

import serialize from 'form-serialize';
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
      betting: this.props.route_ctx.queryparams['bet'] ? true : false,
      prediction: -1,
      amount: '',
      errors: [],
      bet_success: false,
      bets: this.props.matchDetail.bets
    };
  }
  openBet( e ){
    if( this.bet_status !== BET_CAN_DO ) return;
    this.setState({
      betting: true
    });
  }
  selectTeam( num, e ){
    this.setState({
      prediction: num
    });
  }
  setAmount( e ){
    this.setState({
      amount: e.target.value
    });
  }
  submitForm( e ){
    e.preventDefault();
    var errors = [];
    // extract form data
    var data = serialize( e.target, { hash: true } );
    data.match = this.props.matchDetail.match._id;
    if( this.state.prediction > -1) data.prediction = this.state.prediction;
    // validate
    //Data prediction cannot be null, and can be 0 (since that's a valid outcome).
    if( !data.prediction && data.prediction != 0)  errors.push('Select a team to bet on');
    if( !data.amount )      errors.push('Input a valid amount');
    if( errors.length ){
      this.setState({
        errors: errors
      });
      return;
    }
    // fire API
    this.props.postBet( data )
              .then( ( res ) => {
                var bet = res.body;
                bet.user = {
                  username: this.props.user.username
                };
                this.setState({
                  bet_success: true,
                  bets: [bet].concat( this.state.bets )
                })
              })
              .catch( (res) => {
                var msg = _.get( res, 'response.body.message' ) || 'error';
                this.setState({
                  errors: [msg]
                })
              });
  }
  render(){
    var match = this.props.matchDetail.match;
    var bets = this.state.bets;
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
                  href={`/?teamName=${match.outcomeNames[0]}`}
                  target="_blank" >{ match.outcomeNames[0] }</a>
              &nbsp;and&nbsp;
              <a  className="link"
                  href={`/?teamName=${match.outcomeNames[1]}`}
                  target="_blank" >{ match.outcomeNames[1]}</a>
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
            { this.state.bet_success ?
                this.renderPostBetSuccess() :
                this.renderPostBetForm()
            }
          </div>
          :
          null
        }
        { console.log( "bets.length ", bets.length ) }
        { bets.length ?
            <div className="section _3">
              { this.renderCurrentBets() }
            </div> :
            null
        }
        {/*
            <pre>
              { JSON.stringify( this.props.matchDetail, null, 2 ) }
            </pre>
        */}

      </div>
    )
  }
  renderPostBetSuccess(){
    return (
      <div className="bet-success-msg">
        Bet Post Success!
      </div>
    );
  }
  renderPostBetForm(){
    var match = this.props.matchDetail.match;
    return (
      <form onSubmit={ ::this.submitForm } >
        { this.state.errors.length ?
          <div>
            <div className="bet-error error left-100"> { this.state.errors[0] } </div>
            <div className="left-100 margin-10"></div>
          </div>
          :
          null
        }
        <div className="left-48 choose-team">
          <div  className={`btn team-1 left-100 ${this.state.prediction === 0 ? 'chosen' : ''}`}
                onClick={ this.selectTeam.bind(this, 0) } >
            { match.outcomeNames[0] } ( {match.betPot[0]} )
          </div>
          <div className="left-100 margin-10"></div>
          <div  className={`btn team-2 left-100 ${this.state.prediction === 1 ? 'chosen' : ''}`}
                onClick={ this.selectTeam.bind(this, 1) }>
            { match.outcomeNames[1] } ( {match.betPot[1]} )
          </div>
        </div>
        <div className="left-4"> &nbsp; </div>
        <div className="left-48">
          <input  className="input amt"
                    type="number"
                    placeholder="Bet amount"
                    name="amount"
                    value={ this.state.amount }
                    onChange={ ::this.setAmount } />
          <div className="left-100 margin-10"></div>
          <input  className="left-100 btn"
                  type="submit"
                  value="Submit Bet"/>
        </div>
      </form>
    );
  }
  renderCurrentBets(){
    var bets = this.state.bets;
    var teams = this.props.matchDetail.match.outcomeNames;
    return (
      <div>
        <div className="section-header clearfix">
          <div className="current-bets align-left left-80" >
            { bets.length } open bets
          </div>
        </div>
        <div className="section-content">
          <div className="bet-list">
            {
              bets.map( ( bet ) => {
                return (
                  <div className="bet-item" key={ bet._id } >
                    { bet.amount } on { teams[bet.prediction] } by { bet.user.username }
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className=""></div>
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
