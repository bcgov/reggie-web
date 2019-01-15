import React, { Component } from 'react';
import { connect } from 'react-redux';
//main container

class RocketChat extends Component {
  static displayName = '[Component RocketChat]';

  render() {
    return (
      <div>
        <h1>Rocket chat invite page</h1>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RocketChat);
