import {Map, List, fromJS} from 'immutable';
import request from 'superagent';

var log = console.log.bind(console, 'reducer ::');

var initialState = fromJS({
  NODE_ENV: null,
  guest: true,
  member: false,
  admin: false,
  login: {
    loading: false,
    error_message: null
  },
  signup: {
    loading: false,
    error_message: null
  },
  // resp from /api/v1/users/me
  user: {
    _id: null,
    dogecoinBlioAddress: null,
    provider: null,
    username: null,
    dogeBalance: null,
    created: null,
    roles: [],
    email: null
  },
  matches: [],
  matchDetail: {
    bets: [],
    match: {}
  }
});

function login( state, action ){
  switch( action.type ){
    case 'POST_LOGIN':
      var _state = fromJS({
        login: {
          loading: true
        }
      });
      return state.merge( _state )
    case 'LOGIN_SUCCESS':
      var _state = fromJS({
        guest: false,
        member: true,
        admin: false,
        login: {
          loading: false,
          error_message: null
        },
        user: action.payload
      });
      return state.merge( _state )
    case 'LOGIN_ERROR':
      var _state = fromJS({
        login: {
          loading: false,
          error_message: action.payload.message
        }
      });
      return state.merge( _state )
    case 'CLEAR_LOGIN_STATE':
      var _state = fromJS({
        login: {
          error_message: null
        }
      });
      return state.mergeDeep( _state )
    case 'LOGOUT_SUCCESS':
      var _state = fromJS({
        guest: true,
        member: false,
        admin: false,
        user: {}
      });
      return state.merge( _state );
  }
  return state;
}

function signup( state, action ){
  switch( action.type ){
    case 'POST_SIGNUP':
      var _state = fromJS({
        signup: {
          loading: true
        }
      });
      return state.merge( _state );
    case 'SIGNUP_ERROR':
      var _state = fromJS({
        signup: {
          loading: false,
          error_message: action.payload.message
        }
      });
      return state.merge( _state )
    case 'SIGNUP_SUCCESS':
      var _state = fromJS({
        guest: false,
        member: true,
        admin: false,
        signup: {
          loading: false,
          error_message: null
        },
        user: action.payload
      });
      return state.merge( _state )
    case 'CLEAR_SIGNUP_STATE':
      var _state = fromJS({
        signup: {
          error_message: null
        }
      });
      return state.mergeDeep( _state )
  }
  return state;
}

function user( state, action ){
  switch( action.type ){
    case 'SET_GUEST':
      var _state = fromJS({
        guest: true,
        member: false,
        admin: false,
        user: {}
      });
      return state.merge( _state );
    case 'SET_MEMBER':
      var _state = fromJS({
        guest: false,
        member: true,
        admin: false,
        user: action.payload
      });
      return state.merge( _state );
  }
  return state;
}

// TODO: read roles from data, deal with admin
function settings( state, action )
{
  switch( action.type ){
    case 'SET_SETTINGS':
      var _state = fromJS( action.payload );
      // logged in?
      if( _state.get('user') ){
        _state = _state.merge(
          fromJS({
            guest: false,
            member: true,
            admin: false
          })
        );
      }
      else{
        _state = _state.merge(
          fromJS({
            guest: true,
            member: false,
            admin: false
          })
        );
      }
      return state.merge( _state );
  }
  return state;
}

function matches( substate, action )
{
  switch( action.type ){
    case 'GET_MATCHES_SUCCESS':
      var _substate = fromJS( action.payload );
      return _substate;
  }
  return substate;
}

function match( substate, action )
{
  switch( action.type ){
    case 'GET_MATCH_DETAIL_SUCCESS':
      var _substate = fromJS( action.payload );
      return _substate;
  }
  return substate;
}

function reducer(state = initialState, action) {
  log('action >>', action.type, action.status, action.payload);

  var reducers = [
    { reducer: login, keyPath: [] },
    { reducer: signup, keyPath: [] },
    { reducer: user, keyPath: [] },
    { reducer: settings, keyPath: [] },
    { reducer: matches, keyPath: ['matches'] },
    { reducer: match, keyPath: ['matchDetail'] }
  ];

  function reducerFn( state, item, index ){
    var _substate;
    var { reducer, keyPath } = item;
    if( !keyPath || !keyPath.length )
      return reducer( state, action );
    else{
      _substate = state.getIn( keyPath );
      return state.setIn( keyPath, reducer( _substate, action ) );
    }
  };

  return reducers.reduce( reducerFn, state);
}

export default reducer;
