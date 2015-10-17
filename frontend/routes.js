import page from 'page';
import qs from 'qs';
import cookies from 'cookies-js';
import * as actions from './actions/action_creators.js'
import { store } from './index.js';

var default_guest_redirect = '/login';
var default_member_redirect = '/';
var default_admin_redirect = '/';

/**
  * test:
  * route works page -> /login => Login
  * not found catches bad route -> /asdffdasf => not found
  * guest hits not allowed page -> /profile => /login
  * member hits not allowed page -> /signup => /
  * admin hits not allowed page -> /login => /
  * test redirect to for guest work -> /profile => /login => /profile
  */

cookies.set('foo', 'bar');

var all = {
  guest: true,
  member: default_member_redirect,
  admin: true
};
var guest_only = {
  guest: true,
  member: default_member_redirect,
  admin: default_admin_redirect
};
var member_only = {
  guest: default_guest_redirect,
  member: true,
  admin: true,
};
var admin_only = {
  guest: default_guest_redirect,
  member: default_member_redirect,
  admin: true
};

var prevPath = null;

// assume we should match only one route per pass
// webpack doesn't seem to work properly when variable passed into require
var routeMap = {
  '/': {
    access: member_only,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Home.js')) )
    }
  },
  '/login': {
    access: guest_only,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Login.js')) )
    },
    exitFn: ( ctx, next ) => {
      store.dispatch( actions.clearLoginError() );
      next();
    }
  },
  '/signup': {
    access: guest_only,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Signup.js')) )
    },
    exitFn: ( ctx, next ) => {
      store.dispatch( actions.clearSignupError() );
      next();
    }
  },
  '/profile': {
    access: member_only,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Profile.js')) )
    }
  },
  '/accounts': {
    access: member_only,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Accounts.js')) )
    }
  },
  '/matches': {
    access: all,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Matches.js')) )
    }
  },
  '/matches/:id': {
    access: member_only,
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/Matches.js')) )
    }
  },
  '*': {
    access: {},
    asyncRequire: ( cb ) => {
      require.ensure([], () => cb(require('components/NotFound.js')) )
    }
  }
};
for( var url in routeMap ){
  routeMap[url].matchUrl = url;
}

export function extendCtx(){
  // get user state ( for auth )
  page('*', ( ctx, next ) => {
    var current_state = store.getState();
    ctx.guest = current_state.get('guest');
    ctx.member = current_state.get('member');
    ctx.admin = current_state.get('admin');
    ctx.queryparams = qs.parse(ctx.querystring);
    next();
  });
  // pass specific routeMap data per route
  for( var url in routeMap ){
    page( url, function( routeData, ctx, next ){
      if( !ctx.routeData ) ctx.routeData = routeData;
      next();
    }.bind(this, routeMap[url]) );
    // bind exit callback if defined
    if( routeMap[url].exitFn ) page.exit( url, routeMap[url].exitFn );
  };
}

export function logRoute( ctx, next ){
  console.log( 'route >>', ctx.path );
  next();
};

export function authFilter( ctx, next ){
  var access = ctx.routeData.access;
  cookies.expire('redirect_to');
  if( ctx.guest ){
    if( access.guest !== true ){
      console.log(' redirect >> ', access.guest);
      cookies.set('redirect_to', ctx.path );
      return page.redirect( access.guest )
    }
  }
  if( ctx.admin ){
    if( access.member !== true &&
        access.admin  !== true ){
      console.log(' redirect >> ');
      return page.redirect( access.admin );
    }
  }
  if( ctx.member ){
    if( access.member !== true ){
      console.log(' redirect >> ');
      return page.redirect( access.member )
    }
  }
  next();
};

//
export function checkAbort( ctx, next ){
  if( window.skip_abort ){
    window.skip_abort = false;
    next();
  }
  if( prevPath === ctx.path ) return;
  prevPath = ctx.path;
  next();
};

// middleware is run every route call
var middlewares = [
  checkAbort,
  logRoute,
  authFilter
];

export { routeMap, middlewares, extendCtx };
