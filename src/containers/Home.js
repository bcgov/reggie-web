import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { authorize } from '../actionCreators';
//main container

class Home extends Component {
  static displayName = '[Component Home]';

  render() {
    console.log(this.props.isAuthenticated);
    console.log(this.props.isAuthorized);
    console.log(this.props.authorizationStarted);
    console.log(this.props.email);

    let authorizedRedirect = null;

    if (this.props.isAuthorized) {
      authorizedRedirect = <Redirect to="/rocketChat" />;
    } else if (this.props.authorizationStarted) {
      authorizedRedirect = <Redirect to="/registration" />;
    }

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
          Login to Other self-service app
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
    authorizationStarted: state.authorization.authorizationStarted,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      authorize: (ssoGroup, email) => dispatch(authorize(ssoGroup, email)),
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
