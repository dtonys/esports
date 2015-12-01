import util from 'FE_util.js';

// DOTA2 match between Team1 and Team2
class MatchHeadline extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    var item = this.props.item;
    var teamNameArr = _.pairs( util.teamNameMap );
    var team1_icon = '/img/dogecoin.png';
    var team2_icon = '/img/dogecoin.png';

    teamNameArr.forEach( function( _item, index ){
      if( item.outcomeNames[0] === _item[1].display_name ) team1_icon = `/img/team_logos/${_item[1].logo_url}`;
      if( item.outcomeNames[1] === _item[1].display_name ) team2_icon = `/img/team_logos/${_item[1].logo_url}`;
    });

    return (
      <div className="headline clearfix">
        <div className="left-44 team-wrap" style={ { overflow: 'hidden' } } >
          <img className="team-icon" src={ team1_icon } style={ {width: "40px", height: "40px"} } />
          <br className="phone-tablet" />
          <a  className="link team-name"
              href={`/?teamName=${item.outcomeNames[0]}`}
              target="_blank" >{ item.outcomeNames[0] }</a>
        </div>
        <div className="left-12" style={ { textAlign: 'center', marginTop: "10px" } } > vs </div>
        <div className="left-44 team-wrap" style={ { overflow: 'hidden' } } >
          <img className="team-icon" src={ team2_icon } style={ {width: "40px", height: "40px"} } />
          <br className="phone-tablet" />
          <a  className="link team-name"
              href={`/?teamName=${item.outcomeNames[1]}`}
              target="_blank" >{ item.outcomeNames[1]}</a>
        </div>
        { /* &nbsp;vs&nbsp; */ }
      </div>
    )
  }
}
export default MatchHeadline;
