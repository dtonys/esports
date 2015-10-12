import {Map, List} from 'immutable';
import request from 'superagent';

function reducer( state = {}, action )
{
  switch( action.type ){
    case 'POST_LOGIN':
      console.log('POST_LOGIN');
      return state;
    case 'LOGIN_SUCCESS':
      console.log('LOGIN_SUCCESS');
      return state;
    case 'LOGIN_ERROR':
      console.log('LOGIN_ERROR');
      return state;
  }
  return state;
}

function postLogin(){
  // var xhr =
  //   request
  //     .post('/api/pet')
  //     .end( (err, res) => {
  //       if( err ){
  //         dispatch
  //       }
  //     });
};

export default reducer;
