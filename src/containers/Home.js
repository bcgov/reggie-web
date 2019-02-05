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
import { authorize } from '../actionCreators';
import { ROUTES, AUTH_CODE, SELF_SERVER_APP, API } from '../constants';
import { Loader } from '../components/UI/Loader';

// Here provides option to access different services/apps
class Home extends Component {
  static displayName = '[Component Home]';

  componentDidUpdate = () => {
    if (this.props.isAuthenticated && this.props.userId) {
      if (this.props.userInfo.id === null && !this.props.isAuthorizing) {
        this.props.authorize(SELF_SERVER_APP.ROCKETCHAT.NAME, this.props.userId);
      }
    }
  };

  render() {
    // get email intention and jwt from localStorage:
    const emailJwt = localStorage.getItem('emailJwt');
    const intention = localStorage.getItem('emailIntention');

    // Set the rendering content based on authentication and authorization:
    const authenticationContent = this.props.isAuthenticated ? null : (
      <p>Please log in to SSO to proceed</p>
    );

    // Error message:
    const errMsg =
      this.props.errorMessages.length > 0 ? <p>{this.props.errorMessages[0]}</p> : null;

    /*
      if there exist email payloads in localstorage, go to confirmation page
      if user is authorized for Rocket chat, go to invitation page (as there's only one option atm)
      else if user does not meet the requirement to join Rocket chat, go to rejection page
      else, stay in the home page untill user pick an option
    */
    // Redirect based on Email:
    const setEmailRedirect = (emailJwt, intention) => {
      if (!emailJwt || !intention) return null;
      if (intention === ROUTES.EMAIL.CONFIRM) return <Redirect to="/confirmation" />;
      if (intention === ROUTES.EMAIL.VERIFY) return <Redirect to="/verify" />;
      return null;
    };
    const emailRedirect = this.props.isAuthenticated ? setEmailRedirect(emailJwt, intention) : null;

    // Redirect based on authorization:
    const setAuthorizationRedirect = authCode => {
      switch (authCode) {
        case AUTH_CODE.AUTHORIZED:
          return <Redirect to="/rocketChat" />;
        case AUTH_CODE.REJECTED:
          return <Redirect to="/rejection" />;
        case AUTH_CODE.NEW:
          return <Redirect to="/registration" />;
        case AUTH_CODE.PENDING:
          return (
            <div>
              <p>You have a pending registration!</p>
              <Link className="btn btn-primary" to="/registration">
                Update Registation Profile
              </Link>
            </div>
          );
        default:
          return null;
      }
    };

    const authorizeRedirect =
      this.props.isAuthenticated && this.props.userInfo.id
        ? setAuthorizationRedirect(this.props.authCode)
        : null;

    const loadingContent = this.props.isAuthorizing ? Loader : null;

    const baseurl = API.BASE_URL;

    return (
      <div className="authed">
        <h1>Welcome to Reggie web *** test the difference 2 ***</h1>
        <h1>test the env {baseurl}</h1>
        {authenticationContent}
        {errMsg}
        {loadingContent}
        {emailRedirect}
        {authorizeRedirect}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    userId: state.authentication.userId,
    authCode: state.authorization.authCode,
    isAuthorizing: state.authorization.isAuthorizing,
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
