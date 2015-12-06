// ContentContainer

class ContentContainer extends React.Component{
  constructor( props ){
    super( props );
    this.load_more_threshhold = 200;
    this.load_more = false;
  }
  scrollEvent( e ){
    var { scrollTop, clientHeight, scrollHeight } = this.refs.scrollWrap;
    // expose scroll events to the world without re-rendering everything
    window.EE.emit('scrollWrap.scroll', {
      scrollTop: scrollTop,
      clientHeight: clientHeight,
      scrollHeight: scrollHeight
    });
    // var dist = this.refs.scrollWrap.scrollTop + this.refs.scrollWrap.clientHeight;
    // var max = this.refs.scrollWrap.scrollHeight;
    // this.load_more = ( max - dist <= this.load_more_threshhold );
    // console.log( " this.load_more >> ", this.load_more );
  }
  render(){
    return (
      <div ref="scrollWrap" className="fixed-scroll-wrap" onScroll={ ::this.scrollEvent } >
        {
          React.Children.map(this.props.children, ( child ) => {
            if( child ) return React.cloneElement(child, { load_more: this.load_more })
          })
        }
      </div>
    )
  }
};
export default ContentContainer;
