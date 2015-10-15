import superagent from 'superagent';
import agent from 'superagent-promise';
var request = agent( superagent, Promise );

// var agent = require('superagent-promise')(require('superagent'), Promise);
import { store } from '../index.js';

/*** LOGIN ***/
function postLogin( payload ){
  return {
    type: 'POST_LOGIN'
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

/*** SIGNUP ***/
function postSignup(){
  return {
    type: 'POST_SIGNUP'
  }
}

function signupError( payload ){
  return {
    type: 'SIGNUP_ERROR',
    error: true,
    payload
  }
}

function signupSuccess( payload ){
  return {
    type: 'SIGNUP_SUCCESS',
    payload
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

export function clearLoginError(){
  return {
    type: 'CLEAR_LOGIN_ERROR'
  }
}

export function clearSignupError(){
  return {
    type: 'CLEAR_SIGNUP_ERROR'
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

export function executeSignup( signup_data, callback ){
  var xhr = null;
  return function( dispatch ){
    if( xhr ) xhr.abort();
    xhr = request
      .post('/api/v1/auth/signup')
      .send( signup_data )
      .end( (err, res) => {
        if( !res.ok )   dispatch( signupError({ message: res.body.message }) );
        else            dispatch( signupSuccess( res.body ) );
        return callback( res.ok );
      })
    dispatch( postSignup( signup_data ) );
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