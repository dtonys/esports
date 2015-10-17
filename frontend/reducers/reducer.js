import {Map, List, fromJS} from 'immutable';
import request from 'superagent';

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
  }
});

function reducer( state = initialState, action )
{
  console.log('action >> ', action.type, action.status, action.payload);
  switch( action.type ){
    // LOGIN
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
    case 'CLEAR_LOGIN_ERROR':
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

    // SIGNUP
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
    case 'CLEAR_SIGNUP_ERROR':
      var _state = fromJS({
        signup: {
          error_message: null
        }
      });
      return state.mergeDeep( _state )

    // LOAD PAGE, SET USER TYPE
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
    case 'SET_SETTINGS':
      var _state = fromJS( action.payload );
      return state.merge( _state );
  }
  return state;
}

export default reducer;
