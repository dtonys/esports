/**
 * type: 'LOGIN'
 * status
 * status: 'success', error: 'Oops'
 * status: 'error', error: 'Oops'
 */

export function postLogin( login_data ){
  return {
    type: 'POST_LOGIN',
    login_data
  }
}
export function loginSuccess( success_data ){
  return {
    type: 'LOGIN_SUCCESS',
    success_data
  }
}
export function loginError( error_data ){
  return {
    type: 'LOGIN_ERROR',
    error_data
  }
}

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
