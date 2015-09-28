// Router
import page from 'page';
import qs from 'qs';
import _ from 'lodash';
import util from 'FE_util.js';

import Layout from 'components/Layout.js';

// all routes must be explicitely listed here
var routeMap = {
  '/': {
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Home.js')) )
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
  '/matches/:id': {
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
      timeout: null,
      route_ctx: null
    };
    util.bindAll( this, 'setupRoutes', 'getData' );
  }
  componentDidMount(){
    this.setupRoutes();
  }
  setupRoutes(){
    page('*', function( ctx, next ){
      ctx.queryparams = qs.parse(ctx.querystring);
      next();
    });
    for( var url in routeMap ){
      var routeData = routeMap[url];
      page( url, this.getData.bind(this, routeData) );
    };
    page.start();
  }
  getData(routeData, ctx, next ){
    routeData.asyncRequire( ( Component ) => {   // get dependencies async via webpack
      clearTimeout( this.state.timeout );
      var timeout = setTimeout( () => {                   // get data via API call
        this.setState({ loading: false });
      }, 50);
      ctx.Component = Component;
      this.setState({
        loading: true,
        timeout: timeout,
        route_ctx: ctx
      });
    })
  }
  render(){
    var loading = this.state.loading ? <div>Loading</div> : null;

    var RoutedComponent = this.state.route_ctx && this.state.route_ctx.Component ?
                            this.state.route_ctx.Component : null;

    return (
      <Layout route_ctx={this.state.route_ctx} >
        { RoutedComponent ? <RoutedComponent route_ctx={this.state.route_ctx} /> : '' }
        { loading ? <div> Loading... </div> : '' }
      </Layout>
    )
  }
};

export default Router;

