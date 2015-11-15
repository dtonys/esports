import page from 'page';
import 'pages/matches.sass';
import 'components/forms.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

import moment from 'moment';
import util from 'FE_util.js';

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
              var startMoment = moment(item.matchStartTime);
              var gameName = item.gameName || 'default';

              return (
                <div key={item._id} >
                  <div  className="match-item clearfix"
                        onClick={ () => page(`/matches/${item._id}`) } >
                    <div className="left-80" >
                      <img  className="icon_40x40"
                            src={ util.gameNameMap[gameName].icon_url } />
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
                      <div className="start-date">
                        Pot: {item.team1pot + item.team2pot}
                      </div>
                    </div>
                    <div className="left-20" style={{ minHeight: "40px" }} >
                      <div  className="btn bet-btn"
                            onClick={ (e) => { e.stopPropagation(); page(`/matches/${item._id}?bet=1`) } } >
                        <i className="fa fa-level-up"></i>
                      </div>
                    </div>
                  </div>
                  <div className="margin-10"></div>
                </div>
              )
            })
          }
          {/*
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
          */}
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
