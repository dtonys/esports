import page from 'page';
import 'components/forms.sass';
import 'components/forms_extend.sass';
import 'pages/matches.sass';
import 'components/forms.sass';
import 'components/forms_extend.sass';

import reactMixin from 'react-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

import moment from 'moment';
import { forms } from '../helpers/forms.js';

import util from 'FE_util.js';

@reactMixin.decorate(forms)
@reactMixin.decorate(LinkedStateMixin)
class AdminPanel extends React.Component{
  constructor( props ){
    super( props );
    this.state = {
      'team1name' : '',
      'team2name' : '',
      'tourneyName' : '',
      'gameName' : '',
      'matchStartTime' : new Date().toISOString()
    }
  }
  submitResolveMatch(e, match, winnerNum ) {

    var data = {"winnerNum" : winnerNum, "matchid" : match._id};

    //fire api
    this.props.postResolveMatch ( data )
      .then( ( res ) => {
        var resbody = res.body;
        console.log('@@@then ' + resbody);
      })
      .catch( (res) => {
        var msg = _.get( res, 'response.body.message' ) || 'error';
        this.setState({
          errors: [msg]
        })
      });
  }
  submitCreateMatch( e ) {
    var data = this.state;
    console.log('data:' + data);


    this.props.postCreateMatch( data )
        .then( ( res ) => {
          var resbody = res.body;
          console.log('@@@then ' + resbody);
        })
        .catch( (res) => {
          var msg = _.get( res, 'response.body.message' ) || 'error';
          this.setState({
            errors: [msg]
          })
        });
  }
  render(){
    return (
      <div className="matches-page-container" >
        <div className="header">
          ADMIN PAGE
        </div>
        <br/><br/>


        <div className="matches-page-container">
          <div className="header">
            MATCHES
          </div>
          <div className="match-items">
            {
              this.props.adminPanel.map( ( item ) => {
                var startMoment = moment(item.matchStartTime);
                return (
                    <div  className="match-item clearfix"
                          key={item._id}>
                      <div className="left-80" >
                        id: { item._id }
                        <div>
                          Mailchimp: {item.mailChimpSegmentId }
                        </div>
                        <div className="headline">
                          <a  className="link"
                              href={`/?gameName=${item.gameName}`}
                              target="_blank"
                              onClick={ (e) => e.stopPropagation() } >{ item.gameName }</a>
                          &nbsp;match between&nbsp;
                          <a  className="link"
                              href={`/?teamName=${item.outcomeNames[0]}`}
                              target="_blank"
                              onClick={ (e) => e.stopPropagation() } >{ item.outcomeNames[0] }</a>
                          &nbsp;and&nbsp;
                          <a  className="link"item
                              href={`/?teamName=${item.outcomeNames[1]}`}
                              target="_blank"
                              onClick={ (e) => e.stopPropagation() } >{ item.outcomeNames[1] }</a>
                        </div>
                        <div className="start-date">
                          Match begins on: &nbsp;
                          { startMoment.format("dddd, MMMM Do YYYY, h:mm:ss a") }
                          &nbsp;&nbsp;
                          ( { startMoment.fromNow() } )
                        </div>
                        <div className="match-status">
                          Match status: &nbsp;
                          { item.status }
                        </div>
                      </div>
                      <div className="left-20" style={{ minHeight: "40px" }}  >
                        <input  className="left-100 btn" type="submit"
                                value={item.outcomeNames[0]}
                                onClick = { () => { this.submitResolveMatch(this, item, 0) } }>
                        </input>
                        <input  className="left-100 btn" type="submit"
                                value={item.outcomeNames[1]}
                                onClick = { () => { this.submitResolveMatch(this, item, 1) } }>
                        </input>
                      </div>
                    </div>
                )
              })
            }
          </div>
          <div className="header">
            CREATE A MATCH
          </div>
          <form className="generic-form container"
                onSubmit = {() => { this.submitCreateMatch(this) } } >
            <select className="select input amt"
                    placeholder="Game Name"
                    name="gameName"
                    valueLink={this.linkState('gameName')}>
              <option value=""></option>
              {
                Object.keys( util.gameNameMap ).map( ( item, index ) => {
                  return (
                    <option value="{item}">{item}</option>
                  )
                })
              }
            </select>
            <div className="left-100 margin-10"></div>
            <input className="input amt"
                   placeholder="Team 1 Name"
                   name="team1name"
                   valueLink={this.linkState('team1name')}/>
            <div className="left-100 margin-10"></div>
            <input  className="input amt"
                    placeholder="Team 2 Name"
                    name="team2name"
                    valueLink={this.linkState('team2name')}/>
            <div className="left-100 margin-10"></div>
            <input  className="input amt"
                    placeholder="Tourney Name"
                    name="tourneyName"
                    valueLink={this.linkState('tourneyName')}/>
            <div className="left-100 margin-10"></div>
            <input  className="input amt"
                    placeholder="Match Date"
                    name="matchStartTime"
                    valueLink={this.linkState('matchStartTime')}/>
            <div className="left-100 margin-10"></div>
            <input type="submit" value="Create Match"
                   className="input amt action-item submit btn left-50" />
          </form>
        </div>
      </div>
    )
  }
}

var mapStateToProps = function( storeState ){
  return {
    adminPanel: storeState.get('adminPanel').toJS()
  }
};

var AdminContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions
)(AdminPanel);

export default AdminContainer;
