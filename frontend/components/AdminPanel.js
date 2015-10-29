import page from 'page';
import 'components/forms.sass';
import 'components/forms_extend.sass';
import 'pages/matches.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

import moment from 'moment';

class AdminPanel extends React.Component{
  constructor( props ){
    super( props );
  }
  submitResolveMatch ( e, match ) {
    console.log("@@@SUBMIT FORM@@@");
    //fire api

    var data = {"winnerNum" : 2, "matchid" : match._id};

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
  submitCreateMatch () {
    var data = {
      'team1name' : this.linkState('team1name'),
      'team2name' : this.linkState('team2name'),
      'tourneyName' : this.linkState('tourneyName'),
      'gameName' : this.linkState('gameName')
    };
    this.props.postCreateMatch ( data )
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
                    <div className="headline">
                      <a  className="link"
                          href={`/?gameName=${item.gameName}`}
                          target="_blank"
                          onClick={ (e) => e.stopPropagation() } >{ item.gameName }</a>
                      &nbsp;match between&nbsp;
                      <a  className="link"
                          href={`/?teamName=${item.team1name}`}
                          target="_blank"
                          onClick={ (e) => e.stopPropagation() } >{ item.team1name }</a>
                      &nbsp;and&nbsp;
                      <a  className="link"item
                          href={`/?teamName=${item.team2name}`}
                          target="_blank"
                          onClick={ (e) => e.stopPropagation() } >{ item.team2name }</a>
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
                  <form onSubmit = { this.submitResolveMatch(this, item) } >
                    <div className="left-20" style={{ minHeight: "40px" }}  >
                      <input  className="left-100 btn"
                            type="submit"
                            value="Resolve Match"/>
                    </div>
                  </form>
                </div>
              )
            })
          }
        </div>

        <div className="left-100 margin-10">
          <br/><br/>
        </div>
        <div className="header">
          CREATE A MATCH
        </div>
        <div>
          <div className="left-48 choose-team">
            <input  className="input amt"
                    placeholder="Team 1 Name"
                    name="team1name"/>
            <div className="left-100 margin-10"></div>
            <input  className="input amt"
                    placeholder="Team 2 Name"
                    name="team2name"/>
            <div className="left-100 margin-10"></div>
            <input  className="input amt"
                    placeholder="Game Name"
                    name="gameName"/>
            <div className="left-100 margin-10"></div>
            <input  className="input amt"
                    placeholder="Tourney Name"
                    name="tourneyName"/>
          </div>
          <div className="left-4"> &nbsp; </div>
          <div className="left-48">
            <div  className="btn right-100" >
              Create Match
            </div>
          </div>
        </div>


      </div>
    )
  }
};

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
