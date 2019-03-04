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
import { authorize, verifyEmail } from '../actionCreators';
import { SELF_SERVER_APP } from '../constants';
import { Loader } from '../components/UI/Loader';

// Here check if invited user is valid:
class Verify extends Component {
  static displayName = '[Component Verify]';

  // check for authorization status first:
  componentWillMount = () => {
    this.props.authorize(SELF_SERVER_APP.ROCKETCHAT.NAME, this.props.userId);
  };

  // Remove localstorage when done with the flow:
  componentWillUnmount = () => {
    localStorage.removeItem('emailJwt');
    localStorage.removeItem('emailIntention');
  };

  render() {
    let invitationRedirect = null;
    const ssoErrMsg = 'Your SSO account is not complete, please update your profile by login again';

    // Redirect if email invitation is verified:
    if (this.props.verfied) invitationRedirect = <Redirect to="/" />;

    const emailJwt = localStorage.getItem('emailJwt');

    const pageContent =
      this.props.userInfo.id === null || this.props.verifyStarted
        ? Loader
        : this.props.userInfo.email === null
        ? ssoErrMsg
        : this.props.verifyEmail(this.props.userId, this.props.userInfo.email, emailJwt);

    return (
      <div>
        {invitationRedirect}
        <h1>Verify Invitation to Rocket Chat</h1>
        <h4>{this.props.authErrorMessages[0]}</h4>
        {pageContent}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.authentication.userId,
    verifyStarted: state.verifyEmail.verifyStarted,
    verfied: state.verifyEmail.verfied,
    errorMessages: state.verifyEmail.errorMessages,
    userInfo: state.authorization.userInfo,
    authErrorMessages: state.authorization.errorMessages,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      authorize,
      verifyEmail,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Verify);
