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
  submitForm ( e ) {
    console.log("@@@SUBMIT FORM@@@");
    //fire api

    var data = {"winnerNum" : 2};

    this.props.postResolveMatch ( data )
      .then( ( res ) => {
        var resbody = res.body;
        console.log('@@@then ' + resbody);
        /*
        var bet = res.body;
        bet.user = {
          username: this.props.user.username
        };
        this.setState({
          bet_success: true,
          bets: [bet].concat( this.state.bets )
        })
        */
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
                  </div>
                  <form onSubmit = { ::this.submitForm } >
                    <div className="left-20" style={{ minHeight: "40px" }}  >
                      <input  className="left-100 btn"
                            type="submit"
                            value="resolve match"/>
                    </div>
                  </form>
                </div>
              )
            })
          }
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
