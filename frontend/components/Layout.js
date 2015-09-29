import 'layout/layout.sass';
import 'layout/layout_extend.sass';
import 'components/components.sass';

import Navbar from 'components/Navbar.js';
import ContentContainer from 'components/ContentContainer.js';

// layout
class Layout extends React.Component{
  constructor( props ){
    super( props );
  }
  render(){
    return (
      <div>
        <Navbar {...this.props} />
        <ContentContainer {...this.props} >
          { this.props.children }
        </ContentContainer >
      </div>
    )
  }
};
export default Layout;
