/**
 * Created by Joseph on 11/10/2015.
 */
import page from 'page';
import 'pages/matches.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

class TransactionHistory extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    console.log( this.props.transactionHistory );
    return (
      <div className="matches-page-container" >
        <div className="header">
          TRANSACTION HISTORY
        </div>
        <div className="match-items">
          <div style={ {margin: "10px"} }>
            <div className="bet-list">
              {
                this.props.transactionHistory.map( ( tx ) => {
                  return (
                    <div className="bet-item" key={ tx._id } >
                      { tx.balance_change } b/c of { tx.note }
                    </div>
                  )
                })
              }
            </div>
          </div>
          {}
        </div>
      </div>
    )
  }
}
var mapStateToProps = function( storeState ){
  return {
    transactionHistory: storeState.get('transactionHistory').toJS()
  }
};

var TransactionHistoryContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions                     // expose dispatch function, dispatch hooked to action_creators
)(TransactionHistory);

export default TransactionHistoryContainer;
