import MatchHeadline from 'components/MatchHeadline.js';

class MatchRow extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    var item = this.props.item;
    return (
      <div key={item._id} >
        <div  className="match-item clearfix"
              onClick={ () => page(`/matches/${item._id}`) } >
          <div className="left-80" >
            <img  className="icon_40x40"
                  src={ item.gameObj.icon_url } />
            <MatchHeadline item={ item } />
            <div className="start-date">
              Match begins on: &nbsp;
              { item.startMoment.format("dddd, MMMM Do YYYY, h:mm:ss a") }
              &nbsp;&nbsp;
              ( { item.startMoment.fromNow() } )
            </div>
            <div className="start-date">
              Pot: {item.betTotal}
            </div>
          </div>
          <div className="left-20" style={{ minHeight: "40px" }} >
            <div  className="btn bet-btn gold"
                  onClick={ (e) => { e.stopPropagation(); page(`/matches/${item._id}?bet=1`) } } >
              <img className="bet-icon" src="/img/chip_icon.png" />
              <div className="text" > Bet </div>
            </div>
          </div>
        </div>
        <div className="margin-10"></div>
      </div>
    )
  }
}
export default MatchRow;
