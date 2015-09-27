import React from 'react';

var Greeting = React.createClass({
  render: function(){
    return (
      <div className="greeting" >
        Hello, { this.props.name }
      </div>
    )
  }
});

module.exports = Greeting;
