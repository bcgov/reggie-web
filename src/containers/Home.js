import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actionCreators from '../actions/index';
//main container

class Home extends Component {
  static displayName = '[Component Home]';

  render() {
    console.log(this.props.isAuthenticated);
    console.log(this.props.isAuthorized);
    console.log(this.props.email);

    const authorizedRedirect = this.props.isAuthorized ? <Redirect to="/rocketChat" /> : <Redirect to="/registration" />;
    // const authorizedRedirect = this.props.isAuthorized ? <Redirect to="/rocketChat" /> : null;
    const content = this.props.isAuthenticated ? (
      <div>
        <h1>Hello {this.props.email} ---</h1>
        <button
          className="rc-button"
          onClick={() => {
            this.props.authorize('rc', this.props.email);
          }}
        >
          Login to Rocket Chat
        </button>
        <button
          className="kk-button"
          onClick={() => {
            this.props.authorize('kk', this.props.email);
          }}
        >
          Login to KK
        </button>
      </div>
    ) : (
      <h1>Please log in to SSO---</h1>
    );

    return (
      <div className="authed">
        {authorizedRedirect}
        <h1>hellocsdfsd</h1>
        {content}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    email: state.authentication.email,
    isAuthorized: state.authorization.isAuthorized,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authorize: (ssoGroup, email) => dispatch(actionCreators.authorize(ssoGroup, email)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
