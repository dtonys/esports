// Router
import page from 'page';
import qs from 'qs';
import _ from 'lodash';
import util from 'FE_util.js';

import Layout from 'components/Layout.js';

var default_guest_redirect = '/login';
var default_member_redirect = '/';
var all = {
  guest: true,
  member: true
};
var guest_only = {
  guest: true,
  member: false
};
var member_only = {
  guest: false,
  member: true
};
var admin_only = {
  guest: false,
  member: false,
  admin: true
};
// '/profile': {
//   access:
//   {
//     member: true,           // allow loggedin users
//     guest: '/login'         // redirect to specified url
//   }

// all routes must be explicitely listed here
var routeMap = {
  '/': {
    access: all,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Home.js')) )
    }
  },
  '/login': {
    access: all,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Login.js')) )
    }
  },
  '/signup': {
    access: all,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Signup.js')) )
    }
  },
  '/profile': {
    access: member_only,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Profile.js')) )
    }
  },
  '/matches': {
    access: all,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Matches.js')) )
    }
  },
  '/matches/:id': {
    access: all,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Matches.js')) )
    }
  },
  '*': {
    access: all,
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
    if( ctx.pathname === window.location.pathname ) return;
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

