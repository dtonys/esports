import page from 'page';
import 'pages/matches.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

class MyBets extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    console.log( this.props.myBets );
    return (
      <div className="matches-page-container" >
        <div className="header">
          My Bets
        </div>
        <div className="match-items">
          <div style={ {margin: "10px"} }>
            <div className="bet-list">
              {
                this.props.myBets.map( ( bet ) => {
                  var teams = [
                    null,
                    bet.match.team1name,
                    bet.match.team2name
                  ]
                  return (
                    <div className="bet-item" key={ bet._id } >
                      { bet.amount } on { teams[bet.prediction] } by { this.props.user.username }
                    </div>
                  )
                })
              }
            </div>
          </div>
          { /*
            this.props.myBets.map( ( item ) => {
              return (
                <div  className="match-item"
                      key={item._id} >
                  <div className="start-date">
                      Bet Amount:
                    { item.amount.toString() }
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
    myBets: storeState.get('myBets').toJS()
  }
};

var MyBetsContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions                     // expose dispatch function, dispatch hooked to action_creators
)(MyBets);

export default MyBetsContainer;
