import superagent from 'superagent';
import agent from 'superagent-promise';
var request = agent( superagent, Promise );

import { store } from '../index.js';

/**
 * Private
 */

// Login
function _postLogin( payload ){
  return {
    type: 'POST_LOGIN'
  }
}
function _loginSuccess( payload ){
  return {
    type: 'LOGIN_SUCCESS',
    payload
  }
}
function _loginError( payload ){
  return {
    type: 'LOGIN_ERROR',
    error: true,
    payload
  }
}

function _logoutSuccess(){
  return {
    type: 'LOGOUT_SUCCESS'
  }
}

// Signup
function _postSignup(){
  return {
    type: 'POST_SIGNUP'
  }
}

function _signupError( payload ){
  return {
    type: 'SIGNUP_ERROR',
    error: true,
    payload
  }
}

function _signupSuccess( payload ){
  return {
    type: 'SIGNUP_SUCCESS',
    payload
  }
}

function _setMember( payload ){
  return {
    type: 'SET_MEMBER',
    payload
  }
}

function _setGuest(){
  return {
    type: 'SET_GUEST'
  }
}

function _updateMe( payload ){
  return {
    type: 'UPDATE_ME',
    payload
  }
}

function _getMatches( payload ){
  return {
    type: 'GET_MATCHES_SUCCESS',
    payload
  }
}

function _getMatchDetail( payload ){
  return {
    type: 'GET_MATCH_DETAIL_SUCCESS',
    payload
  }
}

/**
 * Public
 */
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
export function getMyBets(payload) {
  return {
    type: 'GET_MY_BETS_SUCCESS',
    payload
  }
};

// APIs
export function postLogin( login_data ){
  var xhr = null;
  return function( dispatch ){
    if( xhr ) xhr.abort();
    dispatch( _postLogin( login_data ) );
    xhr = request
      .post('/api/v1/auth/signin')
      .send( login_data )
      .end()
      .then( (res) => {
        dispatch( _loginSuccess( res.body ) );
      })
      .catch( (res) => {
        var msg = res.body && res.body.message ? res.body.message : 'error';
        dispatch( _loginError({ message: msg }) );
      })
    return xhr;
  }
}

export function postSignup( signup_data ){
  var xhr = null;
  return function( dispatch ){
    if( xhr ) xhr.abort();
    dispatch( _postSignup( signup_data ) );
    xhr = request
      .post('/api/v1/auth/signup')
      .send( signup_data )
      .end()
      .then( (res) => {
        dispatch( _loginSuccess( res.body ) );
      })
      .catch( (res) => {
        var msg = res.body && res.body.message ? res.body.message : 'error';
        dispatch( _signupError({ message: msg }) );
      })
    return xhr;
  }
}

export function getLogout(){
  var xhr = null;
  return function( dispatch ){
    if( xhr ) xhr.abort();
    xhr = request
      .get('/api/v1/auth/signout')
      .end()
      .then( () => {
        dispatch( _logoutSuccess() );
      });
    return xhr;
  };
};

export function getMe( callback ){
  var xhr = null;
  return function( dispatch ){
    xhr = request
      .get('/api/v1/users/me')
      .end()
      .then( ( res ) => {
        if( res.body )  dispatch( _setMember( res.body ) );
        else            dispatch( _setGuest() );
      })
    return xhr;
  };
}

export function putMe( user_data ){
  var xhr = null;
  return function( dispatch ){
    xhr = request
      .put('/api/v1/users')
      .send( user_data )
      .end()
      .then( ( res ) => {
        if( res.body )  dispatch( _updateMe( res.body ) );
      })
    return xhr;
  }
}

export function postMePassword( password_data ){
  var xhr = null;
  return function( dispatch ){
    xhr = request
      .post('/api/v1/users/password')
      .send( password_data )
      .end()
    return xhr;
  }
}

export function getMatches( callback ){
  var xhr = null;
  return function( dispatch ){
    xhr = request
      .get('/api/v1/matches')
      .end()
      .then( ( res ) => {
        if( res.body ) dispatch( _getMatches( res.body ) );
      })
    return xhr;
  };
};

export function getMatchDetail( id,  callback ){
  var xhr = null;
  return function( dispatch ){
    xhr = request
      .get('/api/v1/matches/'+id)
      .end()
      .then( ( res ) => {
        if( res.body ) dispatch( _getMatchDetail( res.body ) );
      })
    return xhr;
  };
};

export function fetchMyBets(callback) {
  var xhr = null;
  return function (dispatch) {
    xhr = request
      .get('/api/v1/bets')
      .end()
      .then( (res) => {
        if (res.body) dispatch( getMyBets(res.body));
      });
    return xhr;
  };
};

// export function execute(  ){
// }
