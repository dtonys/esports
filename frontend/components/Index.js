import page from 'page';

class Index extends React.Component{
  constructor( props ){
    super( props );
    console.log( props );
  }
  render(){
    return (
      <div>
        Index Page
        <button onClick={ () => page('/') }> Home </button>
        <button onClick={ () => page('/profile') }> Profile </button>
        <button onClick={ () => page('/matches') }> Matches </button>
      </div>
    )
  }
};
export default Index;
