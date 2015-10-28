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
                      key={item._id}
                      onClick={ () => page(`/matches/${item._id}`) } >
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
                  <div className="left-20" style={{ minHeight: "40px" }} >
                    <div  className="btn bet-btn"
                          onClick={ (e) => { e.stopPropagation(); page(`/matches/${item._id}?bet=1`) } } >
                      Resolve Match
                    </div>
                  </div>
                  <div className="left-20" style={{ minHeight: "40px" }} >
                    <div  className="btn bet-btn"
                          onClick={ (e) => { e.stopPropagation(); page(`/matches/${item._id}?bet=1`) } } >
                      Resolve Match
                    </div>
                  </div>
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
  console.log('mapStateToProps:' + storeState);
  return {
    adminPanel: storeState.get('adminPanel').toJS()
  }
};

var AdminContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions
)(AdminPanel);

export default AdminContainer;
