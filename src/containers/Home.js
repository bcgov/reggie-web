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
import { css } from 'react-emotion';
import { BeatLoader } from 'react-spinners';

// Here provides option to access different services/apps
class Home extends Component {
  static displayName = '[Component Home]';

  render() {
    // get email intention and jwt from localStorage:
    const emailJwt = localStorage.getItem('emailJwt');
    const intention = localStorage.getItem('emailIntention');

    // Set the rendering content based on authentication and authorization:
    let content = <p>Please log in to SSO to proceed</p>;
    const override = css`
      display: block;
      margin: 0 auto;
      border-color: #003366;
    `;
    const loader = <BeatLoader css={override} sizeUnit={'px'} size={25} color="#003366" />;

    if (this.props.isAuthenticated) {
      content = <p>this should not show up</p>;
      if (this.props.errorMessages.length > 0) {
        content = <p>{this.props.errorMessages[0]}</p>;
      } else if (this.props.isAuthorizing) {
        content = loader;
      } else if (this.props.userInfo.id === null) {
        this.props.authorize('rc', this.props.userId);
      } else {
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
        } else if (this.props.authCode === 2) {
          authorizedRedirect = <Redirect to="/rocketChat" />;
        } else if (this.props.authCode === 3) {
          authorizedRedirect = <Redirect to="/rejection" />;
        } else if (this.props.authCode === 0) {
          authorizedRedirect = <Redirect to="/registration" />;
        } else {
          authorizedRedirect = (
            <div>
              <p>You have a pending registration!</p>
              <Link className="btn btn-primary" to="/registration">
                Update Registation Profile
              </Link>
            </div>
          );
        }
        content = authorizedRedirect;
      }
    }

    return (
      <div className="authed">
        <h1>Welcome to Reggie web</h1>
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
