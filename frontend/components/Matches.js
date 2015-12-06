import page from 'page';
import 'pages/matches.sass';
import 'components/forms.sass';
import 'components/forms_extend.sass';

import {connect} from 'react-redux';
import * as actions from '../actions/action_creators.js';

import moment from 'moment';
import util from 'FE_util.js';

import SampleComponent from 'components/SampleComponent.js';
import MatchRow from 'components/MatchRow.js';

// time states
const ALL       = 'ALL';
const UPCOMING  = 'UPCOMING';
const PAST      = 'PAST';

class Matches extends React.Component{
  constructor( props ){
    super( props );
    this.state = {
      'filter': UPCOMING,
      'loading_more': false
    };

    // load more params
    this.load_more_threshhold = 200;
    this.page = 2;

    this.checkScroll = this.checkScroll.bind(this);
  }
  componentDidMount(){
    window.EE.on('scrollWrap.scroll', this.checkScroll );
  }
  componentWillUnmount(){
    window.EE.off('scrollWrap.scroll', this.checkScroll );
  }
  checkScroll({ scrollTop, clientHeight, scrollHeight }){
    var dist = scrollTop + clientHeight;
    var max = scrollHeight;
    var load_more = ( max - dist <= this.load_more_threshhold );
    if( !this.state.loading_more && load_more ){
      this.props.getMoreMatches({ page: this.page });
      this.page++;
    }
  }
  timeFilter( state ){
    var now = (new Date()).getTime();
    return this.props.matches.filter( item => {
      var matchStartTime = (new Date( item.matchStartTime )).getTime()
      if( state === UPCOMING )  return matchStartTime > now;
      if( state === PAST )      return matchStartTime < now;
      if( state === ALL )       return true;
    })
  }
  filterList( time_state ){
    console.log( 'filterList ', time_state);
    this.setState({
      'filter': time_state
    });
  }
  render(){
    console.log( "props.foo", this.props.foo );
    var matches = this.timeFilter( this.state.filter ) ;
    return (
      <div className="matches-page-container" >
        <div className="header">
          Matches
        </div>
        { this.renderFilters.call( this ) }
        <div className="margin-10" ></div>
        {
          matches.length ?
            this.renderMatchItems.call( this, matches ) :
            this.renderNoResults.call( this )
        }
      </div>
    )
  }
  renderFilters(){
    var filter = this.state.filter;
    var upcoming_active =  filter === UPCOMING && 'active';
    var past_active =  filter === PAST && 'active';
    var all_active =  filter === ALL && 'active';

    return (
      <div className="filters clearfix" >
        <div  className={` filter btn silver left-30 ${ upcoming_active } `}
              onClick={ this.filterList.bind(this, UPCOMING ) } > Upcoming </div>
        <div className="left-5" > &nbsp; </div>
        <div  className={` filter btn silver left-30 ${ past_active } `}
              onClick={ this.filterList.bind(this, PAST ) } > Past </div>
        <div className="left-5" > &nbsp; </div>
        <div  className={` filter btn silver left-30 ${ all_active } `}
              onClick={ this.filterList.bind(this, ALL ) } > All </div>
      </div>
    )
  }
  renderMatchItems( matches ){
    return (
      <div className="match-items">
      {
        matches.map( ( item ) => {
          item.startMoment = moment(item.matchStartTime);
          item.gameName = item.gameName || 'default';
          item.gameObj = util.gameNameMap[item.gameName] ? util.gameNameMap[item.gameName] : util.gameNameMap['default'];
          item.betTotal = item.betPot.reduce( ( prev, curr ) => {
            return prev + curr;
          });
          return (
            <MatchRow key={item._id} item={ item } />
          )
        })
      }
      </div>
    )
  }
  renderNoResults(){
    return (
      <div className="no-results" >
        There are no matches available right now.
      </div>
    )
  }
}
var mapStateToProps = function( storeState ){
  return {
    matches: storeState.get('matches').toJS(),
    moreMatchesLoading: storeState.get('moreMatchesLoading'),
    matchesEnd: storeState.get('matchesEnd')
  }
};

var MatchesContainer = connect(
  mapStateToProps,            // subscribe to store update, expose store state
  actions                     // expose dispatch function, dispatch hooked to action_creators
)(Matches);

export default MatchesContainer;
