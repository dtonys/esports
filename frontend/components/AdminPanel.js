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

@reactMixin.decorate(forms)
@reactMixin.decorate(LinkedStateMixin)
class AdminPanel extends React.Component{
  constructor( props ){
    super( props );
    this.state = {
      'team1name' : '',
      'team2name' : '',
      'tourneyName' : '',
      'gameName' : ''
    }
  }
  submitResolveMatch( e , match ) {

    var data = {"winnerNum" : 2, "matchid" : match._id};

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

    data.matchStartTime = "2015-11-30T18:12:05.658Z";

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
                  <form onSubmit = { () => { this.submitResolveMatch(this, item) } } >
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
        <div className="section _1 clearfix">
          <div className="header">
            CREATE A MATCH
          </div>
          <form className="generic-form container"
                onSubmit = {() => { this.submitCreateMatch(this) } } >
            <div className="left-48 choose-team">
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
                      placeholder="Game Name"
                      name="gameName"
                      valueLink={this.linkState('gameName')}/>
              <div className="left-100 margin-10"></div>
              <input  className="input amt"
                      placeholder="Tourney Name"
                      name="tourneyName"
                      valueLink={this.linkState('tourneyName')}/>
            </div>
            <div className="left-4"> &nbsp; </div>
            <input type="submit" value="Create Match" className="action-item submit btn left-50" />
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
