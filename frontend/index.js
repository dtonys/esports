/*** CSS ***/
import 'base/reset.sass';
import 'base/default.sass';
import 'pages/index.sass'

import Router from './Router.js';

React.render(
  <Router />,
  document.getElementById('app')
);

