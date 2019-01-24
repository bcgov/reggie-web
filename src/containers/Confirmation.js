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
import qs from 'query-string';
import { confirmEmail } from '../actionCreators';
// import Loader from '../components/UI/Loader';
import { css } from 'react-emotion';
import { BeatLoader } from 'react-spinners';

class Confirmation extends Component {
  static displayName = '[Component Confirmation]';
  componentWillMount = () => {
    try {
      const parsed = qs.parse(this.props.location.search);
      if (parsed.jwt) {
        localStorage.setItem('emailJwt', parsed.jwt);
      }
    } catch (err) {
      console.log('---email confirmation JWT not found---');
    }
  };

  render() {
    const emailJwt = localStorage.getItem('emailJwt');
    // TODO: maybe redirect after?
    const verifiedContent = this.props.confirmed ? (
      <h5>Confirmed!</h5>
    ) : (
      <div>
        <br />
        <h5>Do you want to confirm registration for email: </h5>
        <h5>{this.props.email}</h5>
        <br />
        <Button
          bsStyle="primary"
          onClick={() => {
            this.props.confirmEmail(this.props.userId, this.props.email, emailJwt);
          }}
        >
          Confirm
        </Button>
        <h4>{this.props.errorMessages[0]}</h4>
      </div>
    );
    const override = css`
      display: block;
      margin: 0 auto;
      border-color: #003366;
    `;
    const pageContent = this.props.verifyStarted ? (
      <BeatLoader css={override} sizeUnit={'px'} size={25} color="#003366" />
    ) : (
      verifiedContent
    );

    return (
      <div>
        <h1>Welcome back</h1>
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
