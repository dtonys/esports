// sample component, show JSON data
class SampleComponent extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    var item = this.props.item;
    return (
      <div>
        SampleComponent
        <pre>
          { JSON.stringify( this.props.data ) }
        </pre>
      </div>
    )
  }
}
export default SampleComponent;
