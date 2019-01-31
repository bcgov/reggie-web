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
import { Redirect, Link } from 'react-router-dom';
import { authorize, verifyEmail } from '../actionCreators';
import { AUTH_CODE, SELF_SERVER_APP } from '../constants';
import { JSForm, loader } from '../components/UI/JSForm';

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
    // if user is matching the Rocket chat schema, redirect to home directly:
    if (this.props.authCode !== AUTH_CODE.REJECTED && this.props.userInfo.id !== null) {
      invitationRedirect = <Redirect to="/" />;
    }

    const emailJwt = localStorage.getItem('emailJwt');
    const schema = {
      title: 'Enter your email address',
      type: 'object',
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          title: 'Email',
        },
      },
    };

    const onSubmit = ({ formData }) => {
      this.props.verifyEmail(this.props.userId, formData.email, emailJwt);
    };

    const formStatus = {
      inProgress: this.props.verifyStarted,
      failureMsg: this.props.errorMessages.length > 0 ? this.props.errorMessages[0] : null,
    };

    const formContent = this.props.verfied ? (
      <div>
        <p>Verified, please register your profile first (TBD or straigt forward to registration?)</p>
        <Link className="btn btn-primary" to="/registration">
          Registration
        </Link>
      </div>
    ) : (
      <JSForm formSchema={schema} toggled={true} onSubmit={onSubmit} status={formStatus} />
    );

    const pageContent = this.props.userInfo.id === null ? loader : formContent;

    return (
      <div>
        {invitationRedirect}
        <h1>Welcome to Rocket chat</h1>
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
    authCode: state.authorization.authCode,
    isAuthorizing: state.authorization.isAuthorizing,
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
