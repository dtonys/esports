import {Map, List, fromJS} from 'immutable';
import request from 'superagent';

var initialState = fromJS({
  guest: true,
  member: false,
  admin: false,
  login: {
    loading: false,
    error_message: null
  },
  person: {
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
        person: action.payload
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
    case 'LOGOUT_SUCCESS':
      var logout_state = fromJS({
        guest: true,
        member: false,
        admin: false,
        person: {}
      });
      return state.merge( logout_state );
    case 'SET_GUEST':
      var guest_state = fromJS({
        guest: true,
        member: false,
        admin: false,
        person: {}
      });
      return state.merge( guest_state );
    case 'SET_MEMBER':
      var member_state = fromJS({
        guest: false,
        member: true,
        admin: false,
        person: action.payload
      });
      return state.merge( member_state );
  }
  return state;
}

export default reducer;
