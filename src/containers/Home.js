//
// Reggie Web
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Shelly Xue Han on 2019-01-15.
//

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { authorize } from '../actionCreators';

class Home extends Component {
  static displayName = '[Component Home]';

  render() {
    // get email jwt from localStorage:
    const emailJwt = localStorage.getItem('emailJwt');

    // if there exist emailJwt in localstorage, go to confirmation page
    // if user is authorized for Rocket chat, go to invitation page (as there's only one option atm)
    // else if user does not meet the requirement to join Rocket chat, go to rejection page
    // else, stay in the home page untill user pick an option
    let authorizedRedirect = null;
    if (emailJwt) {
      authorizedRedirect = <Redirect to="/confirmation" />;
    }
    if (this.props.authCode === 2) {
      authorizedRedirect = <Redirect to="/rocketChat" />;
    } else if (this.props.authorizationStarted && this.props.authCode === 3) {
      authorizedRedirect = <Redirect to="/rejection" />;
    } else if (this.props.authorizationStarted) {
      authorizedRedirect = <Redirect to="/registration" />;
    }

    const content = this.props.isAuthenticated ? (
      <div>
        {authorizedRedirect}
        <h1>Hello --- {this.props.email}</h1>
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
          disabled="true"
          onClick={() => {
            this.props.authorize('kk', this.props.email);
          }}
        >
          Login to Other self-service app
        </button>
      </div>
    ) : (
      <h1>Please log in to SSO to proceed</h1>
    );

    return (
      <div className="authed">
        <h1>Welcome to Reggie web</h1>
        <h2>{this.props.errorMessages[0]}</h2>
        {content}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    email: state.authentication.email,
    authCode: state.authorization.authCode,
    authorizationStarted: state.authorization.authorizationStarted,
    userInfo: state.authorization.userInfo,
    errorMessages: state.authorization.errorMessages,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      authorize,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
