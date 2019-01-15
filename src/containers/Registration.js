import React, { Component } from 'react';
import { connect } from 'react-redux';
//main container

class Registration extends Component {
  static displayName = '[Component Registration]';

  render() {
    return (
      <div>
        <h1>Registration page</h1>
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
)(Registration);
