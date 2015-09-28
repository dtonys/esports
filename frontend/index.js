/*** CSS ***/
import 'base/reset.sass';
import 'base/default.sass';
// import 'components/forms.sass';
// import 'components/components.sass';
// import 'layout/layout.sass';

import 'pages/index.sass'

import Router from './Router.js';

React.render(
  <Router />,
  document.getElementById('app')
);

