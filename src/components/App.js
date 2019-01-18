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
import Home from '../containers/Home';
import Registration from '../containers/Registration';
import RocketChat from '../containers/RocketChat';
import Layout from '../hoc/Layout';
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
      console.log(implicitAuthManager.idToken.data.email);
    } catch (err) {
      console.log('---implicitAuthManager----not logged in');
    }
  };

  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/registration" component={Registration} />
          <Route
            path="/rocketChat"
            component={RocketChat}
            authorization={this.props.authorization}
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
