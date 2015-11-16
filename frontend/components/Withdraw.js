import page from 'page';
import 'components/forms.sass';
import 'components/forms_extend.sass';
import 'pages/withdraw.sass';

import reactMixin from 'react-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

import serialize from 'form-serialize';

@reactMixin.decorate(LinkedStateMixin)
class Withdraw extends React.Component{
  constructor( props ){
    super( props );
    this.state = {
      amount: '',
      address: '',
      errors: [],
      withdraw_success: false
    };
  }
  submitForm( e ){
    e.preventDefault();
    var errors = [];
    var data = serialize( e.target, { hash: true } );

    //TODO: validate amount (< 100) and address?

    if( errors.length ){
      this.setState({
        errors: errors
      });
      return;
    }
    //alert( JSON.stringify( data, null, 2 ) );
    // fire API
    this.props.postWithdraw(data)
      .then( ( res ) => {

        this.setState({
          withdraw_success: true
        });

        //TODO: update user address

      })
      .catch( (res) => {
        var msg = _.get( res, 'response.body.message' ) || 'error';
        this.setState({
          errors: [msg]
        })
      });
  }
  render(){
    console.log( this.state );
    console.log( this.props );
    return (
      <div className="withdraw-page-container" >
        <form className="generic-form container clearfix" onSubmit={ ::this.submitForm } >
          { this.state.errors.length ?
            <div>
              <div className="bet-error error left-100"> { this.state.errors[0] } </div>
              <div className="left-100 margin-10"></div>
            </div>
            :
            null
          }
          <div className="form-title" > Withdraw </div>
          <div className="margin-10"></div>
          <input  className="input"
                  type="text"
                  placeholder="Enter amount to withdraw"
                  name="amount"
                  valueLink={ this.linkState('amount') } />
          <div className="margin-10"></div>
          <input  className="input"
                  type="text"
                  placeholder="Enter target wallet address"
                  name="address"
                  valueLink={ this.linkState('address') } />
          <div className="margin-10"></div>
          <input type="submit" value="submit" className="action-item submit btn left-100" />
        </form>
      </div>
    )
  }
};

var mapStateToProps = function( storeState ){
  return {
    state: storeState.toJS()
  }
};

var WithdrawContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions
)(Withdraw);

export default WithdrawContainer;
