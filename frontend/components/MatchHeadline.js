// DOTA2 match between Team1 and Team2
class MatchHeadline extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    var item = this.props.item;
    return (
      <div className="headline clearfix">
        <div className="left-46 team-wrap" style={ { overflow: 'hidden' } } >
          <a  className="link"
              href={`/?teamName=${item.outcomeNames[0]}`}
              target="_blank" >{ item.outcomeNames[0] }</a>
        </div>
        <div className="left-6" style={ { textAlign: 'center' } } > vs </div>
        <div className="left-46 team-wrap" style={ { overflow: 'hidden' } } >
          <a  className="link"
              href={`/?teamName=${item.outcomeNames[1]}`}
              target="_blank" >{ item.outcomeNames[1]}</a>
        </div>
        { /* &nbsp;vs&nbsp; */ }
      </div>
    )
  }
}
export default MatchHeadline;
