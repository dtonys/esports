import page from 'page';
import 'components/forms.sass';
import 'components/forms_extend.sass';
import 'pages/sample.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

class Sample extends React.Component{
  constructor( props ){
    super( props );
    this.state = {
      test: '',
      btn_count: 0
    };
  }
  changeTest( e ){
    this.setState({
      test: e.target.value
    });
  }
  clickBtn( e ){
    this.setState({
      btn_count: ++this.state.btn_count
    });
  }
  getData( e ){
    var p = this.props.getMatches();
    p.then( ( res ) => {
      console.log( res.body );
      alert( JSON.stringify(res.body, null, 2) );
    });
  }
  render(){
    console.log( this.state );
    console.log( this.props );
    return (
      <div className="sample-page-container" >
        <div className="clearfix" >
          <div  className="btn left-50"
                onClick={ ::this.clickBtn } >
            Button - { this.state.btn_count.toString() }
          </div>
          <div  className="link left-50"
                onClick={ () => page("/") }> Link </div>
          <div className="margin-10 left-100"></div>
          <input  className="input"
                  type="text"
                  name="test"
                  placeholder="sample input"
                  onChange={ ::this.changeTest }/>
          <div className="margin-10 left-100"></div>
          <div  className="btn left-50"
                onClick={ ::this.getData }>
            Get Matches
          </div>
          <div className=""></div>
        </div>

      </div>
    )
  }
};

var mapStateToProps = function( storeState ){
  return {
    state: storeState.toJS()
  }
};

var SampleContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions
)(Sample);

export default Sample;
