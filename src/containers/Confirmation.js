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
import { confirmEmail } from '../actionCreators';

// Here to confirm if the user email in use is matching the account email:
class Confirmation extends Component {
  static displayName = '[Component Confirmation]';

  render() {
    const emailJwt = localStorage.getItem('emailJwt');
    // TODO: maybe redirect after?
    const verifiedContent = this.props.confirmed ? (
      <h4>Confirmed!</h4>
    ) : (
      <div>
        <h4>Do you want to confirm registration for email: {this.props.email} ?</h4>
        <button
          onClick={() => {
            this.props.confirmEmail(this.props.userId, this.props.email, emailJwt);
          }}
        >
          Confirm
        </button>
        <h4>{this.props.errorMessages[0]}</h4>
      </div>
    );
    const pageContent = this.props.verifyStarted ? <h4>Verifying....</h4> : verifiedContent;
    return (
      <div>
        <h1>Welcome back,</h1>
        {pageContent}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
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
