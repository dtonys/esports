import MatchHeadline from 'components/MatchHeadline.js';
import MatchInfo from 'components/MatchInfo.js';

class MatchRow extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    var item = this.props.item;
    return (
      <div >
        <div  className="match-item clearfix"
              onClick={ () => page(`/matches/${item._id}`) } >
          <div className="left-80" >
            <div className="icon-wrap" >
              <img  className="icon_40x40"
                    src={ item.gameObj.icon_url } />
            </div>
            <MatchHeadline item={ item } />
            <MatchInfo item={ item } />
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
