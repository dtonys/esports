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
  switch( action.type ){
    // LOGIN
    case 'POST_LOGIN':
      console.log('POST_LOGIN');
      var login_state = fromJS({
        login: {
          loading: true
        }
      });
      return state.merge( login_state )
    case 'LOGIN_SUCCESS':
      console.log('LOGIN_SUCCESS');
      var login_state = fromJS({
        guest: false,
        member: true,
        admin: false,
        login: {
          loading: false,
          error_message: null
        },
        user: action.payload
      });
      return state.merge( login_state )
    case 'LOGIN_ERROR':
      console.log('LOGIN_ERROR');
      var login_state = fromJS({
        login: {
          loading: false,
          error_message: action.payload.message
        }
      });
      return state.merge( login_state )
    case 'CLEAR_LOGIN_ERROR':
      var login_state = fromJS({
        login: {
          error_message: null
        }
      });
      return state.mergeDeep( login_state )
    case 'LOGOUT_SUCCESS':
      var logout_state = fromJS({
        guest: true,
        member: false,
        admin: false,
        user: {}
      });
      return state.merge( logout_state );

    // SIGNUP
    case 'POST_SIGNUP':
      console.log('POST_SIGNUP');
      var signup_state = fromJS({
        signup: {
          loading: true
        }
      });
      return state.merge( signup_state );
    case 'SIGNUP_ERROR':
      console.log('SIGNUP_ERROR');
      var signup_state = fromJS({
        signup: {
          loading: false,
          error_message: action.payload.message
        }
      });
      return state.merge( signup_state )
    case 'SIGNUP_SUCCESS':
      console.log('SIGNUP_SUCCESS');
      var signup_state = fromJS({
        guest: false,
        member: true,
        admin: false,
        signup: {
          loading: false,
          error_message: null
        },
        user: action.payload
      });
      return state.merge( signup_state )
    case 'CLEAR_SIGNUP_ERROR':
      console.log('CLEAR_SIGNUP_ERROR');
      var signup_state = fromJS({
        signup: {
          error_message: null
        }
      });
      return state.mergeDeep( signup_state )

    // LOAD PAGE, SET USER TYPE
    case 'SET_GUEST':
      var guest_state = fromJS({
        guest: true,
        member: false,
        admin: false,
        user: {}
      });
      return state.merge( guest_state );
    case 'SET_MEMBER':
      var member_state = fromJS({
        guest: false,
        member: true,
        admin: false,
        user: action.payload
      });
      return state.merge( member_state );
    case 'SET_SETTINGS':
      var _state = fromJS( action.payload );
      return state.merge( _state );
  }
  return state;
}

export default reducer;
