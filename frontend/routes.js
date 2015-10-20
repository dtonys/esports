import page from 'page';
import qs from 'qs';
import cookies from 'cookies-js';
import * as actions from './actions/action_creators.js'
import { store } from './index.js';

var default_guest_redirect = '/login';
var default_member_redirect = '/';
var default_admin_redirect = '/';

var log = console.log.bind(console, 'router ::');

/**
  * test:
  * route works page -> /login => Login
  * not found catches bad route -> /asdffdasf => not found
  * guest hits not allowed page -> /profile => /login
  * member hits not allowed page -> /signup => /
  * admin hits not allowed page -> /login => /
  * test redirect to for guest work -> /profile => /login => /profile
  */

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
var prevMatchUrl = null;

// assume we should match only one route per pass
// webpack doesn't seem to work properly when variable passed into require
var routeMap = {
  // Sample Route
  '/sample': {
    // define { guest, member, admin } access, used by authFilter - REQUIRED
    access: { guest: true, member: true, admin: true },
    // load Page Component, async via webpack - REQUIRED
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/Sample.js')) )
      });
    },
    // load data before showing module - OPTIONAL
    getData: function( params ){
      return Promise.resolve(null);
    },
    // perform cleanup actions on route exit - OPTIONAL
    exit: [
      () => { console.log( 'exit sample' ) }
    ]
  },
  // Sample Admin Route Route
  '/admin': {
    // define { guest, member, admin } access, used by authFilter - REQUIRED
    access: admin_only,
    // load Page Component, async via webpack - REQUIRED
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/Admin.js')) )
      });
    }
  },
  // Sample Admin Route Route
  '/withdraw': {
    access: member_only,
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/Withdraw.js')) )
      });
    }
  },
  '/': {
    access: member_only,
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/Matches.js')) )
      });
    },
    getData: function(){
      return store.dispatch( actions.getMatches() );
    },
  },
  '/login': {
    access: guest_only,
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/Login.js')) )
      });
    },
    getData: function(){
      return Promise.resolve(null);
    },
    exit: [
      () => { store.dispatch( actions.clearLoginState() ) }
    ]
  },
  '/password/reset': {
    access: guest_only,
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/ResetPassword.js')) )
      });
    }
  },
  '/signup': {
    access: guest_only,
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/Signup.js')) )
      });
    },
    getData: function(){
      return Promise.resolve(null);
    },
    exit: [
      () => { store.dispatch( actions.clearSignupState() ) }
    ]
  },
  // Profile
  '/profile': {
    access: member_only,
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/Profile.js')) )
      });
    },
    getData: function(){
      return Promise.resolve(null);
    }
  },
  '/profile/:section': {
    access: member_only,
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/Profile.js')) )
      });
    },
    getData: function(){
      return Promise.resolve(null);
    }
  },
  // Accounts
  '/accounts': {
    access: member_only,
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/Accounts.js')) )
      });
    },
    getData: function(){
      return Promise.resolve(null);
    }
  },
  // Matches
  '/matches': {
    access: all,
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/Matches.js')) )
      });
    },
    getData: function(){
      return Promise.resolve(null);
    }
  },
  // Matches
  '/matches/:id': {
    access: member_only,
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/MatchDetail.js')) )
      });
    },
    getData: function( params ){
      return store.dispatch( actions.getMatchDetail( params.id ) );
    }
  },
  '/mybets': {
    access: member_only,
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/MyBets.js')))
      });
    },
    getData: function(params){
      return store.dispatch( actions.fetchMyBets() );
    }
  },
  // NotFound
  '*': {
    access: {},
    getComponent: () => {
      return new Promise( (res, rej) => {
        require.ensure([], () => res(require('components/NotFound.js')) )
      });
    },
    getData: function(){

    },
  }
};
for( var url in routeMap ){
  // add matchUrl
  routeMap[url].matchUrl = url;
  // default exit function
  (function( _url ){
    var _exit = ()=>{ log('exit >> '+routeMap[_url].matchUrl) };
    if( routeMap[url].exit )
      routeMap[url].exit.unshift( _exit );
    else
      routeMap[url].exit = [_exit];
  })( url );
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
    }.bind(this, routeMap[url]) );;
  };
}

export function logRoute( ctx, next ){
  log( 'route >>', ctx.path );
  next();
};

export function authFilter( ctx, next ){
  var access = ctx.routeData.access;
  cookies.expire('redirect_to');
  if( ctx.guest ){
    if( access.guest !== true ){
      log(`${ctx.routeData.matchUrl} >> redirect >> ${access.guest}`);
      cookies.set('redirect_to', ctx.path );
      return page.redirect( access.guest )
    }
  }
  else if( ctx.admin ){
    if( access.member !== true &&
        access.admin  !== true ){
      log(`${ctx.routeData.matchUrl} >> redirect >> ${access.admin}`);
      return page.redirect( access.admin );
    }
  }
  else if( ctx.member ){
    if( access.member !== true ){
      log(`${ctx.routeData.matchUrl} >> redirect >> ${access.member}`);
      return page.redirect( access.member )
    }
  }
  next();
};

// abort route if our url is not changing
export function checkAbort( ctx, next ){
  if( prevPath === ctx.path ){
    log( 'abort >>', ctx.path );
    return;
  }
  prevPath = ctx.path;
  next();
};

// call exit function before changing to route
export function doExit( ctx, next ){
  if( prevMatchUrl === ctx.routeData.matchUrl ) return next();
  if( routeMap[prevMatchUrl] )
    routeMap[prevMatchUrl].exit.forEach( exit_fn => exit_fn() );
  prevMatchUrl = ctx.routeData.matchUrl;
  next();
}
// middlewares are run every route call.
var middlewares = [
  checkAbort,
  authFilter,
  // middlewares beyond this line should not abort / redirect
  doExit,
  logRoute
];

export { routeMap, middlewares, extendCtx };
