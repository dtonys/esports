/*** CSS ***/
import 'base/reset.sass';
import 'base/default.sass';
import 'pages/index.sass'

// global polyfill to allow use of ES6 Promise
require('es6-promise').polyfill();

import Router from './Router.js';

import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers/reducer.js';
import page from 'page';
import * as actions from './actions/action_creators.js'

/** create redux store **/
// attach middleware
const createStoreWithMiddleware = applyMiddleware(
  thunk
)( createStore );
// attach reducer
export var store = createStoreWithMiddleware(reducer);

// load inital server state into store
store.dispatch( actions.setSettings( window.settings ) );

// expose state to window so we can debug
window.store = store;
window.page = page;

/** test dispatch **/
// store.dispatch( actions.setServerState( window.settings ) );
// store.dispatch( actions.loginSuccess({}) );
// store.dispatch( actions.loginError({}) );

/** inject store as props **/
ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('app')
);

