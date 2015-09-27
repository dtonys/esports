import React from 'react';

class Greeting extends React.Component {
  render(){
    return (
      <div className="greeting" >
        Hello, { this.props.name }
        <a href="/" >Home</a>
      </div>
    )
  }
};

module.exports = Greeting;
