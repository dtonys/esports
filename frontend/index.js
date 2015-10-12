/*** CSS ***/
import 'base/reset.sass';
import 'base/default.sass';
import 'pages/index.sass'

import Router from './Router.js';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers/reducer.js';
import * as actions from './actions/action_creators.js'

/** create redux store **/
// attach middleware
const createStoreWithMiddleware = applyMiddleware(
  thunk
)( createStore );
// attach reducer
const store = createStoreWithMiddleware(reducer)

/** test dispatch **/
// store.dispatch( actions.postLogin({}) );
// store.dispatch( actions.loginSuccess({}) );
// store.dispatch( actions.loginError({}) );

/** inject store as props **/
React.render(
  <Provider store={store}>
    {() => <Router />}
  </Provider>,
  document.getElementById('app')
);

