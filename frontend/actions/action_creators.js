import superagent from 'superagent';
import agent from 'superagent-promise';
var request = agent( superagent, Promise );

// var agent = require('superagent-promise')(require('superagent'), Promise);
import { store } from '../index.js';
/**
 * type: 'LOGIN'
 * status
 * status: 'success', error: 'Oops'
 * status: 'error', error: 'Oops'
 */
function postLogin( payload ){
  return {
    type: 'POST_LOGIN',
    payload
  }
}
function loginSuccess( payload ){
  return {
    type: 'LOGIN_SUCCESS',
    payload
  }
}
function loginError( payload ){
  return {
    type: 'LOGIN_ERROR',
    error: true,
    payload
  }
}

function logoutSuccess(){
  return {
    type: 'LOGOUT_SUCCESS'
  }
}

function setMember( payload ){
  return {
    type: 'SET_MEMBER',
    payload
  }
}

function setGuest(){
  return {
    type: 'SET_GUEST'
  }
}

export function executeLogin( login_data, callback ){
  var xhr = null;
  return function( dispatch ){
    if( xhr ) xhr.abort();
    xhr = request
      .post('/api/v1/auth/signin')
      .send( login_data )
      .end( (err, res) => {
        if( !res.ok )   dispatch( loginError({ message: res.body.message }) );
        else            dispatch( loginSuccess( res.body ) );
        return callback( res.ok );
      })
    dispatch( postLogin( login_data ) );
    return xhr;
  }
}

export function executeLogout( callback ){
  var xhr = null;
  return function( dispatch ){
    if( xhr ) xhr.abort();
    xhr = request
      .get('/api/v1/auth/signout')
      .end( (err, res) => {
        dispatch( logoutSuccess() );
        callback(res.ok);
      });
    return xhr;
  };
};

// TODO: replace by setting cookie
// determine if we are loggedin or not
export function checkLogin( callback ){
  var xhr = null;
  return function( dispatch ){
    xhr = request
      .get('/api/v1/users/me')
      .end( (err, res) => {
        if( res.body )  dispatch( setMember( res.body ) );
        else            dispatch( setGuest() );
      });
    return xhr;
  };
}

// function

// export function getLogout(){
//   return {
//     type: 'LOGOUT'
//   }

// export function logoutSuccess(){
//   return {
//     type: 'LOGOUT_SUCCESS'
//   }
// }

// export function fetchUser(){
//   return {
//     type: 'FETCH_USER'
//   }
// }
