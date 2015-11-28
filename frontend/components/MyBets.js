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
            { this.props.myBets.length ?
                this.renderBetList.call(this) :
                this.renderNoResults.call(this)
            }
          </div>
        </div>
      </div>
    )
  }
  renderNoResults(){
    return (
      <div className="mybets-no-results" >
        You have not placed any bets yet.
        <br />
        Go to the
        <a href="/" className="link" > Matches </a> page to get started.
      </div>
    )
  }
  renderBetList(){
    return (
      <div className="bet-list">
        {
          this.props.myBets.map( ( bet ) => {
            return (
              <div className="bet-item" key={ bet._id } >
                { bet.amount } on { bet.match.outcomeNames[bet.prediction] }
              </div>
            )
          })
        }
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
