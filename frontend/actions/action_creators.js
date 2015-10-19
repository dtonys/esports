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
  var xhr_promise = null;
  return function( dispatch ){
    if( xhr_promise ) xhr_promise.abort();
    dispatch( _postLogin( login_data ) );
    xhr_promise = request
      .post('/api/v1/auth/signin')
      .send( login_data )
      .end();

    xhr_promise
      .then( (res) => {
        dispatch( _loginSuccess( res.body ) );
      })
      .catch( (res) => {
        var msg = res.body && res.body.message ? res.body.message : 'error';
        dispatch( _loginError({ message: msg }) );
      })
    return xhr_promise;
  }
}

export function postSignup( signup_data ){
  var xhr_promise = null;
  return function( dispatch ){
    if( xhr_promise ) xhr_promise.abort();
    dispatch( _postSignup( signup_data ) );
    xhr_promise = request
      .post('/api/v1/auth/signup')
      .send( signup_data )
      .end();
    xhr_promise
      .then( (res) => {
        dispatch( _loginSuccess( res.body ) );
      })
      .catch( (res) => {
        var msg = res.body && res.body.message ? res.body.message : 'error';
        dispatch( _signupError({ message: msg }) );
      })
    return xhr_promise;
  }
}

export function getLogout(){
  var xhr_promise = null;
  return function( dispatch ){
    if( xhr_promise ) xhr_promise.abort();
    xhr_promise = request
      .get('/api/v1/auth/signout')
      .end();
    xhr_promise
      .then( () => {
        dispatch( _logoutSuccess() );
      });
    return xhr_promise;
  };
};

export function getMe( callback ){
  var xhr_promise = null;
  return function( dispatch ){
    xhr_promise = request
      .get('/api/v1/users/me')
      .end();
    xhr_promise
      .then( ( res ) => {
        if( res.body )  dispatch( _setMember( res.body ) );
        else            dispatch( _setGuest() );
      })
    return xhr_promise;
  };
}

export function putMe( user_data ){
  var xhr_promise = null;
  return function( dispatch ){
    xhr_promise = request
      .put('/api/v1/users')
      .send( user_data )
      .end();
    xhr_promise
      .then( ( res ) => {
        if( res.body )  dispatch( _updateMe( res.body ) );
      })
    return xhr_promise;
  }
}

export function postMePassword( password_data ){
  var xhr_promise = null;
  return function( dispatch ){
    xhr_promise = request
      .post('/api/v1/users/password')
      .send( password_data )
      .end();
    return xhr_promise;
  }
}

export function getMatches( callback ){
  var xhr_promise = null;
  return function( dispatch ){
    xhr_promise = request
      .get('/api/v1/matches')
      .end();

    xhr_promise.then( ( res ) => {
      if( res.body ) dispatch( _getMatches( res.body ) );
    });

    return xhr_promise;
  };
};

export function getMatchDetail( id,  callback ){
  var xhr_promise = null;
  return function( dispatch ){
    xhr_promise = request
      .get('/api/v1/matches/'+id)
      .end();
    xhr_promise
      .then( ( res ) => {
        if( res.body ) dispatch( _getMatchDetail( res.body ) );
      })
    return xhr_promise;
  };
};

export function fetchMyBets(callback) {
  var xhr_promise = null;
  return function (dispatch) {
    xhr_promise = request
      .get('/api/v1/bets')
      .end();
    xhr_promise
      .then( (res) => {
        if (res.body) dispatch( getMyBets(res.body));
      });
    return xhr_promise;
  };
};

// export function execute(  ){
// }
