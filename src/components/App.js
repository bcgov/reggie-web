//
// Reggie Web
//
// Copyright © 2018 Province of British Columbia
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
// Created by Shelly Xue Han on 2019-01-10.
//

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { authenticateFailed, authenticateSuccess } from '../actions';
import implicitAuthManager from '../auth';
import {
  Confirmation,
  Home,
  Registration,
  RocketChat,
  Rejection,
  Email,
  Verify,
} from '../containers';
import Layout from '../hoc/Layout';
import PrivateRoute from './Navigation/PrivateRoute';
import './App.css';

export class App extends Component {
  componentDidMount = () => {
    implicitAuthManager.registerHooks({
      onAuthenticateSuccess: () => this.props.login(),
      onAuthenticateFail: () => this.props.logout(),
      // onAuthLocalStorageCleared: () => this.props.logout(),
    });
    // don't call function if on localhost
    if (!window.location.host.match(/localhost/)) {
      implicitAuthManager.handleOnPageLoad();
    }
    try {
      console.log(implicitAuthManager.idToken.data.sub);
      // Notice: instead of verifying aganst email, it's more rubst to check again sub(ID)
      // console.log(implicitAuthManager.idToken.data.email);
    } catch (err) {
      console.log('---implicitAuthManager----not logged in');
    }
  };

  render() {
    // Get the current authorization status code for private route:
    const currAuthCode = this.props.authorization.authCode;
    return (
      <Layout>
        <Switch>
          <PrivateRoute
            path="/registration"
            authorization={this.props.authorization}
            updateUser={this.props.updateUser}
            component={Registration}
            shouldRender={currAuthCode !== AUTH_CODE.REJECTED}
          />
          <PrivateRoute
            path="/rocketChat"
            authorization={this.props.authorization}
            component={RocketChat}
            shouldRender={currAuthCode === AUTH_CODE.AUTHORIZED}
          />
          <Route path="/rejection" component={Rejection} />
          <Route path="/email" component={Email} />
          <Route
            path="/confirmation"
            component={Confirmation}
            authentication={this.props.authentication}
            authorization={this.props.authorization}
            confirmEmail={this.props.confirmEmail}
          />
          <Route
            path="/verify"
            component={Verify}
            authentication={this.props.authentication}
            authorization={this.props.authorization}
            verifyEmail={this.props.verifyEmail}
          />
          <Route
            path="/login"
            component={() => {
              window.location = implicitAuthManager.getSSOLoginURI();
            }}
          />
          <Route
            path="/logout"
            component={() => {
              window.location = implicitAuthManager.getSSOLogoutURI();
            }}
          />
          <Route path="/" component={Home} authentication={this.props.authentication} />
        </Switch>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication,
    authorization: state.authorization,
    updateUser: state.updateUser,
    confirmEmail: state.confirmEmail,
    verifyEmail: state.verifyEmail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      login: () => dispatch(authenticateSuccess()),
      logout: () => dispatch(authenticateFailed()),
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
