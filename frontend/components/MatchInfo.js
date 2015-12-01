// sample component, show JSON data
class MatchInfo extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    var item = this.props.item;
    return (
      <div className="clearfix" >
        <div className="left-50" >
          <div className="tournament-area">
            { item.tourneyName }
          </div>
          <div className="pot-number" >
            <i className="fa fa-shopping-basket"></i>
            Pot: {item.betTotal} Ɖ
          </div>
        </div>
        <div className="left-50" >
          <div className="start-date-area">
            <i className="fa fa-calendar" style={ { marginRight: '5px' } } ></i>
            { item.startMoment.format("dddd, MMMM Do YYYY") }
            <br />
            <i className="fa fa-clock-o" style={ { marginRight: '5px' } } ></i>
            { item.startMoment.fromNow() }
          </div>
        </div>
      </div>
    )
  }
}
export default MatchInfo;
