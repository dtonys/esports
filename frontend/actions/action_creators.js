import superagent from 'superagent';
import agent from 'superagent-promise';
var request = agent( superagent, Promise );
import _ from 'lodash';

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

function _postBetSuccess( payload ){
  return {
    type: 'POST_BET_SUCCESS',
    payload
  }
}

function _postBetError( payload ){
  return {
    type: 'POST_BET_ERROR',
    payload
  }
}

function _getAdminPanel( payload ){
  return {
    type: 'GET_ADMIN_PANEL_SUCCESS',
    payload
  }
}

function _postResolveMatchSuccess( payload ){
  return {
    type: 'POST_RESOLVE_MATCH_SUCCESS',
    payload
  }
}
function _postResolveMatchError( payload ){
  return {
    type: 'POST_RESOLVE_MATCH_ERROR',
    payload
  }
}

function _postCreateMatchSuccess( payload ){
  return {
    type: 'POST_CREATE_MATCH_SUCCESS',
    payload
  }
}
function _postCreateMatchError( payload ){
  return {
    type: 'POST_CREATE_MATCH_ERROR',
    payload
  }
}
function _postCreateTournamentSuccess( payload ){
  return {
    type: 'POST_CREATE_TOURNAMENT_SUCCESS',
    payload
  }
}
function _postCreateTournamentError( payload ){
  return {
    type: 'POST_CREATE_TOURNAMENT_ERROR',
    payload
  }
}

function _postWithdrawSuccess( payload) {
  return {
    type: 'POST_WITHDRAW_SUCCESS',
    payload
  }
}

function _postWithdrawError( payload) {
  return {
    type: 'POST_WITHDRAW_ERROR',
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
export function _getMyBets(payload) {
  return {
    type: 'GET_MY_BETS_SUCCESS',
    payload
  }
}
export function _getTransactionHistory(payload) {
  return {
    type: 'GET_TRANSACTION_HISTORY_SUCCESS',
    payload
  }
}

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
        var msg = _.get( res, 'response.body.message' ) || 'error';
        dispatch( _loginError({ message: msg }) );
      });
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
        var msg = _.get( res, 'response.body.message' ) || 'error';
        dispatch( _signupError({ message: msg }) );
      });
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
}

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
      });
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
      });
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

export function getMatches( params = {} ){
  var xhr_promise = null;
  return function( dispatch ){
    params.page=2;
    xhr_promise = request
      .get('/api/v1/matches')
      .query( params )
      .end();

    xhr_promise.then( ( res ) => {
      if( res.body ) dispatch( _getMatches( res.body ) );
    });

    return xhr_promise;
  };
}

export function getMatchDetail( id, callback ){
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
}

export function getMyBets(callback) {
  var xhr_promise = null;
  return function (dispatch) {
    xhr_promise = request
      .get('/api/v1/bets')
      .end();
    xhr_promise
      .then( (res) => {
        if (res.body) dispatch( _getMyBets(res.body));
      });
    return xhr_promise;
  };
}

export function getTransactionHistory(callback) {
  var xhr_promise = null;
  return function (dispatch) {
    xhr_promise = request
      .get('/api/v1/transactions')
      .end();
    xhr_promise
      .then( (res) => {
        if (res.body) dispatch( _getTransactionHistory(res.body));
      });
    return xhr_promise;
  };

}

export function getAdminPanel( callback ){
  var xhr_promise = null;
  return function( dispatch ){
    //get matches
    xhr_promise = request
      .get('/api/v1/matches')
      .end();
    xhr_promise.then( ( res ) => {
      if( res.body ) {

        var resObj = {};

        resObj.matches = res.body;

        //now get tournaments
        var xhr_promise_tournaments = request
          .get('/api/v1/tournaments')
          .end();

        xhr_promise_tournaments.then((tourney_res) => {

          if (tourney_res.body) {

            resObj.tournaments = tourney_res.body;

            dispatch( _getAdminPanel( resObj ) );
          }


        });

      }
    });

    return xhr_promise;
  };
}

export function postResolveMatch( match_data ) {
  var xhr_promise = null;
  return function (dispatch) {
    xhr_promise = request
      .post('/api/v1/resolve/' + match_data.matchid)
      .send( match_data )
      .end();
    xhr_promise
      .then( (res) => {
        if (res.body) dispatch( _postResolveMatchSuccess(res.body));
      })
      .catch( (res) => {
        var msg = _.get( res, 'response.body.message' ) || 'error';
        dispatch( _postResolveMatchError({ message: msg }) );
      });
    return xhr_promise;
  };
}

export function postCreateMatch( match_data ) {
  var xhr_promise = null;
  return function (dispatch) {
    xhr_promise = request
      .post('/api/v1/matches')
      .send( match_data )
      .end();
    xhr_promise
      .then( (res) => {
        if (res.body) dispatch( _postCreateMatchSuccess(res.body));
      })
      .catch( (res) => {
        var msg = _.get( res, 'response.body.message' ) || 'error';
        dispatch( _postCreateMatchError({ message: msg }) );
      });
    return xhr_promise;
  };
}

export function postCreateTournament(tourney_data) {
  var xhr_promise = null;
  return function (dispatch) {
    xhr_promise = request
      .post('/api/v1/tournaments')
      .send( tourney_data )
      .end();
    xhr_promise
      .then( (res) => {
        if (res.body) dispatch( _postCreateTournamentSuccess(res.body));
      })
      .catch( (res) => {
        var msg = _.get( res, 'response.body.message' ) || 'error';
        dispatch( _postCreateTournamentError({ message: msg }) );
      });
    return xhr_promise;
  };

}

export function postWithdraw(withdraw_data) {
  var xhr_promise = null;
  return function (dispatch) {
    xhr_promise = request
      .post('/api/v1/withdraw')
      .send( withdraw_data )
      .end();
    xhr_promise
      .then( (res) => {
        if (res.body) dispatch( _postWithdrawSuccess(res.body));
      })
      .catch( (res) => {
        var msg = _.get( res, 'response.body.message' ) || 'error';
        dispatch( _postWithdrawError({ message: msg }) );
      });
    return xhr_promise;
  };
}

export function postBet( bet_data ) {
  var xhr_promise = null;
  return function (dispatch) {
    /* Mock test */
    // var response_data = {
    //   "__v": 0,
    //   "user": "56089617f80fcbe46d519581",
    //   "amount": 100,
    //   "match": "551d52419a5e1ca41c07263c",
    //   "prediction": 1,
    //   "_id": "562d19a8bb2d13827ae835b3",
    //   "status": 0,
    //   "created": "2015-10-25T18:04:24.606Z"
    // }
    // dispatch( _postBetSuccess( response_data ) );
    // xhr_promise = Promise.resolve( response_data );
    xhr_promise = request
      .post('/api/v1/bets')
      .send( bet_data )
      .end();
    xhr_promise
      .then( (res) => {
        if (res.body) dispatch( _postBetSuccess(res.body));
      })
      .catch( (res) => {
        var msg = _.get( res, 'response.body.message' ) || 'error';
        dispatch( _postBetError({ message: msg }) );
      });
    return xhr_promise;
  };
}

// export function execute(  ){
// }
