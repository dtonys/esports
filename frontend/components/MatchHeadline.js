// DOTA2 match between Team1 and Team2
class MatchHeadline extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    var item = this.props.item;
    return (
      <div className="headline">
        <a  className="link"
            href={`/?gameName=${item.gameName}`}
            target="_blank" >{ item.gameName }</a>
          &nbsp;match between&nbsp;
        <a  className="link"
            href={`/?teamName=${item.outcomeNames[0]}`}
            target="_blank" >{ item.outcomeNames[0] }</a>
          &nbsp;and&nbsp;
        <a  className="link"
            href={`/?teamName=${item.outcomeNames[1]}`}
            target="_blank" >{ item.outcomeNames[1]}</a>
      </div>
    )
  }
}
export default MatchHeadline;
