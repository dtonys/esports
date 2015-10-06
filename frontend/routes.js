import page from 'page';
import qs from 'qs';
import cookies from 'cookies-js';

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
    }
  },
  '/signup': {
    access: guest_only,
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

function extendCtx( { userType } ){
  // get user state ( for auth )
  page('*', ( ctx, next ) => {
    ctx.userType = userType;
    ctx.queryparams = qs.parse(ctx.querystring);
    next();
  });
  // pass specific routeMap data per route
  for( var url in routeMap ){
    page( url, function( routeData, ctx, next ){
      if( !ctx.routeData ) ctx.routeData = routeData;
      next();
    }.bind(this, routeMap[url]) );
  };
}

function logRoute( ctx, next ){
  console.log( 'route >>', ctx.path );
  next();
};

function authFilter( ctx, next ){
  var access = ctx.routeData.access;
  var userType = ctx.userType;
  switch( userType ){
    case 'member':
      if( access.member !== true ){
        console.log(' redirect >> ');
        ctx.state.redirect = true;
        ctx.save();
        return page.redirect( access.member )
      }
      break;
    case 'guest':
      if( access.guest !== true ){
        console.log(' redirect >> ', access.guest);
        cookies.set('redirect_to', ctx.path );
        ctx.state.redirect = true;
        ctx.save();
        return page.redirect( access.guest )
      }
      break;
    case 'admin':
      if( access.member !== true &&
          access.admin  !== true ){
        console.log(' redirect >> ');
        ctx.state.redirect = true;
        ctx.save();
        return page.redirect( access.admin );
      }
      break;
  }
  next();
};

//
function checkAbort( ctx, next ){
  if( prevPath === ctx.path ) return;
  prevPath = ctx.path;
  next();
};

var middlewares = [
  checkAbort,
  logRoute,
  authFilter
];

export { routeMap, middlewares, extendCtx };
