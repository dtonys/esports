// Router
import reactMixin from 'react-mixin';
import page from 'page';

import _ from 'lodash';
import util from 'FE_util.js';

import Layout from 'components/Layout.js';
import { routeMap, middlewares, extendCtx } from 'routes.js';

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
    // put data into router ctx
    extendCtx({ userType: 'guest' })
    // apply middlewares
    page('*', ...middlewares );
    // apply each route
    for( var url in routeMap ){
      page( url, this.getData );
    };
    page.start();
  }
  getData( ctx, next ){
    // get Component + its dependencies async via webpack
    ctx.routeData.asyncRequire( ( Component ) => {
      // abort previous data fetch
      clearTimeout( this.state.timeout );
      // load data for page
      var timeout = setTimeout( () => {
        this.setState({ loading: false });
      }, 50);
      // set Component
      ctx.Component = Component;
      // set loading state
      this.setState({
        loading: true,
        timeout: timeout,
        route_ctx: ctx
      });
    });
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

