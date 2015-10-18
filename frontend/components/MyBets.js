import page from 'page';
import 'pages/matches.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

class MyBets extends React.Component{
  render(){
    return (
      <div className="mybets-page-container" >
        <div className="header">
          My Bets
        </div>
        <div className="bet-items">
          {
            this.props.bets.map( ( item ) => {
              return (
                <div  className="bet-item"
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
          }
        </div>
      </div>
    )
  }
}
var mapStateToProps = function( storeState ){
  return {
    bets: storeState.get('bets').toJS()
  }
};

var MyBetsContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions                     // expose dispatch function, dispatch hooked to action_creators
)(MyBets);

export default MyBetsContainer;
