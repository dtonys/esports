// Router
import page from 'page';
import qs from 'qs';
import _ from 'lodash';
import util from 'FE_util.js';

var routeMap = {
  '/': {
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Index.js')) )
    }
  },
  '/profile': {
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Profile.js')) )
    }
  },
  '/matches': {
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Matches.js')) )
    }
  },
  '*': {
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/NotFound.js')) )
    }
  }
};
class Router extends React.Component{
  constructor( props ){
    super(props);
    this.state = {
      component: '',
      loading: false,
      timeout: null
    };
    util.bindAll( this, 'setupRoutes', 'getData', 'setPage' );
  }
  componentDidMount(){
    this.setupRoutes();
  }
  setupRoutes(){
    for( var url in routeMap ){
      var routeData = routeMap[url];
      page( url, this.getData, this.setPage )
    };
    page.start();
  }
  getData(ctx, next ){
    routeMap[ctx.path].asyncRequire( ( Component ) => {   // get dependencies async via webpack
      ctx.Component = Component;
      clearTimeout( this.state.timeout );
      var timeout = setTimeout( () => {                   // get data via API call
        this.setState({ loading: false });
        next();
      }, 1000);

      this.setState({
        loading: true,
        timeout: timeout
      });
    })
  }
  setPage( ctx, next ){
    var Component = ctx.Component;
    this.setState({
      component: <Component params={ctx.params} querystring={ ctx.querystring } />
    })
  }
  render(){
    var loading = this.state.loading ? <div>Loading</div> : '';

    return (
      <div>
        { this.state.component }
        { loading }
      </div>
    )
  }
};

export default Router;

