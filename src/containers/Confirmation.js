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
import qs from 'query-string';
import { confirmEmail } from '../actionCreators';

class Confirmation extends Component {
  static displayName = '[Component Confirmation]';
  componentWillMount = () => {
    try {
      const parsed = qs.parse(this.props.location.search);
      console.log('-----------------------parsed.jwt');
      console.log(parsed.jwt);
      if (parsed.jwt) {
        localStorage.setItem('emailJwt', parsed.jwt);
      }
    } catch (err) {
      console.log('---email confirmation JWT not found---');
    }
  };

  render() {
    const emailJwt = localStorage.getItem('emailJwt');
    return (
      <div>
        <h1>Welcome back,</h1>
        <h2>------------{emailJwt}</h2>
        <h2>------------{this.props.email}</h2>
        <button
          onClick={() => {
            localStorage.removeItem('emailJwt');
          }}
        >
          clear jwt
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    email: state.authentication.email,
    updateStarted: state.confirmEmail.updateStarted,
    updated: state.confirmEmail.updated,
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
