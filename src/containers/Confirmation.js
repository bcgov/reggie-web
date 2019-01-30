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
import { BeatLoader } from 'react-spinners';
import { css } from 'react-emotion';
import { Redirect, Link } from 'react-router-dom';
import { confirmEmail } from '../actionCreators';
// import Loader from '../components/UI/Loader';

// Here to confirm if the user email in use is matching the account email:
class Confirmation extends Component {
  static displayName = '[Component Confirmation]';

  componentDidMount = () => {
    const emailJwt = localStorage.getItem('emailJwt');
    if (this.props.isAuthenticated && this.props.userId) {
      if (
        !this.props.confirmed &&
        !this.props.verifyStarted &&
        this.props.errorMessages.length === 0
      ) {
        this.props.confirmEmail(this.props.userId, this.props.email, emailJwt);
      }
    }
  };

  render() {
    // Error message:
    const errMsg =
      this.props.errorMessages.length > 0 ? (
        <div>
          <div className="display-linebreak">{this.props.errorMessages[0]}</div>
          <Link className="btn btn-primary" to="/registration">
            Registration
          </Link>
        </div>
      ) : null;

    // verified action:
    const verifiedRedirect = this.props.confirmed ? <Redirect to="/" /> : null;

    // Loader:
    // TODO: fix loader component!
    const override = css`
      display: block;
      margin: 0 auto;
      border-color: #003366;
    `;
    const loader = this.props.verifyStarted ? (
      <div>
        <p>Verifying your email as {this.props.email}</p>
        <BeatLoader css={override} sizeUnit={'px'} size={25} color="#003366" />
      </div>
    ) : null;

    return (
      <div>
        <h1>Welcome back</h1>
        {errMsg}
        {loader}
        {verifiedRedirect}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    email: state.authentication.email,
    userId: state.authentication.userId,
    verifyStarted: state.confirmEmail.verifyStarted,
    confirmed: state.confirmEmail.confirmed,
    errorMessages: state.confirmEmail.errorMessages,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      confirmEmail,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Confirmation);
