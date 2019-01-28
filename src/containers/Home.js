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
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { authorize } from '../actionCreators';

// Here provides option to access different services/apps
class Home extends Component {
  static displayName = '[Component Home]';

  render() {
    // get email intention and jwt from localStorage:
    const emailJwt = localStorage.getItem('emailJwt');
    const intention = localStorage.getItem('emailIntention');

    // if there exist email payloads in localstorage, go to confirmation page
    // if user is authorized for Rocket chat, go to invitation page (as there's only one option atm)
    // else if user does not meet the requirement to join Rocket chat, go to rejection page
    // else, stay in the home page untill user pick an option
    let authorizedRedirect = null;
    if (emailJwt) {
      if (intention === 'confirm') {
        authorizedRedirect = <Redirect to="/confirmation" />;
      }
      if (intention === 'invite') {
        authorizedRedirect = <Redirect to="/verify" />;
      }
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
        <Button
          bsStyle="primary"
          onClick={() => {
            this.props.authorize('rc', this.props.userId);
          }}
        >
          Login to Rocket Chat
        </Button>
      </div>
    ) : (
      <p>Please log in to SSO to proceed</p>
    );

    return (
      <div className="authed">
        <h1>Welcome to Reggie web</h1>
        <p>{this.props.errorMessages[0]}</p>
        {content}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    userId: state.authentication.userId,
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
