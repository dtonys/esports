// ContentContainer
class ContentContainer extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    return (
      <div className="fixed-scroll-wrap" >
        { this.props.children }
      </div>
    )
  }
};
export default ContentContainer;
