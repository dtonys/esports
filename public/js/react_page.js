import _ from 'lodash';
import $ from 'jquery';

import React from 'react';
import Greeting from 'greeting.jsx';

React.render(
  <Greeting name="World" />,
  document.getElementById("main")
);

console.log('react page');
