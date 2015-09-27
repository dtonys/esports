import _ from 'lodash';
import $ from 'jquery';

import React from 'react';
import Greeting from 'greeting.jsx';

React.render(
  <Greeting name="World" />,
  document.getElementById("main")
);

// setTimeout(function(){
//   require.ensure(['MainPage'], function(){
//     var MainPage = require('MainPage');
//   });
// }, 1000);

console.log('react page');
