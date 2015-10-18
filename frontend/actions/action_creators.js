import superagent from 'superagent';
import agent from 'superagent-promise';
var request = agent( superagent, Promise );

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

export function setSettings( payload ){
  return {
    type: 'SET_SETTINGS',
    payload
  }
}

export function clearLoginState(){
  return {
    type: 'CLEAR_LOGIN_STATE'
  }
}

export function clearSignupState(){
  return {
    type: 'CLEAR_SIGNUP_STATE'
  }
}

export function getMatches( payload ){
  return {
    type: 'GET_MATCHES_SUCCESS',
    payload
  }
}

export function getMatchDetail( payload ){
  return {
    type: 'GET_MATCH_DETAIL_SUCCESS',
    payload
  }
}


export function executeLogin( login_data ){
  var xhr = null;
  return function( dispatch ){
    if( xhr ) xhr.abort();
    dispatch( postLogin( login_data ) );
    xhr = request
      .post('/api/v1/auth/signin')
      .send( login_data )
      .end()
      .then( (res) => {
        dispatch( loginSuccess( res.body ) );
      })
      .catch( (res) => {
        var msg = res.body && res.body.message ? res.body.message : 'error';
        dispatch( loginError({ message: msg }) );
      })
    return xhr;
  }
}

export function executeSignup( signup_data ){
  var xhr = null;
  return function( dispatch ){
    if( xhr ) xhr.abort();
    dispatch( postSignup( signup_data ) );
    xhr = request
      .post('/api/v1/auth/signup')
      .send( signup_data )
      .end()
      .then( (res) => {
        dispatch( loginSuccess( res.body ) );
      })
      .catch( (res) => {
        var msg = res.body && res.body.message ? res.body.message : 'error';
        dispatch( signupError({ message: msg }) );
      })
    return xhr;
  }
}

export function executeLogout(){
  var xhr = null;
  return function( dispatch ){
    if( xhr ) xhr.abort();
    xhr = request
      .get('/api/v1/auth/signout')
      .end()
      .then( () => {
        dispatch( logoutSuccess() );
      });
    return xhr;
  };
};

export function getLoggedInUser( callback ){
  var xhr = null;
  return function( dispatch ){
    xhr = request
      .get('/api/v1/users/me')
      .end()
      .then( ( res ) => {
        if( res.body )  dispatch( setMember( res.body ) );
        else            dispatch( setGuest() );
      })
    return xhr;
  };
}

export function fetchMatches( callback ){
  var xhr = null;
  return function( dispatch ){
    xhr = request
      .get('/api/v1/matches')
      .end()
      .then( ( res ) => {
        if( res.body ) dispatch( getMatches( res.body ) );
      })
    return xhr;
  };
};

export function fetchMatchDetail( id,  callback ){
  var xhr = null;
  return function( dispatch ){
    xhr = request
      .get('/api/v1/matches/'+id)
      .end()
      .then( ( res ) => {
        if( res.body ) dispatch( getMatchDetail( res.body ) );
      })
    return xhr;
  };
};
