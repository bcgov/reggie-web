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
import { SELF_SERVER_APP } from '../constants';
import { inviteUser } from '../actionCreators';
import JSForm from '../components/UI/JSForm';

// Only authorized user can access the app and invite new user:
class RocketChat extends Component {
  static displayName = '[Component RocketChat]';
  state = { toggled: false };

  // TODO: check for user info, do authorization or redirect to home
  // componentDidMount = () => {
  //   if (this.props.userInfo.id === null) {
  //   }
  // };

  render() {
    // Json Schema Form:
    const schema = {
      // title: 'Please register to continue',
      type: 'object',
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          title: 'Email to invite',
        },
      },
    };

    // TODO: disable button when in progress
    const onSubmit = ({ formData }) => {
      this.props.inviteUser(this.props.userInfo.id, formData.email);
    };

    const onClick = () => {
      this.setState({ toggled: !this.state.toggled });
    };

    const formStatus = {
      inProgress: this.props.invitationStarted,
      success: this.props.sent,
      errMsg: this.props.errorMessages,
    };

    return (
      <div>
        <h1>Hello {this.props.userInfo.firstName}</h1>
        <div class="flex-container">
          <div>
            {/* External link */}
            <a href={SELF_SERVER_APP.ROCKETCHAT.URL}>
              <Button bsStyle="primary">Go to Rocket Chat</Button>
            </a>
          </div>
          <div>
            <Button bsStyle="primary" onClick={onClick}>
              Invite New User
            </Button>
          </div>
        </div>
        <JSForm
          formSchema={schema}
          toggled={this.state.toggled}
          onSubmit={onSubmit}
          status={formStatus}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.authorization.userInfo,
    invitationStarted: state.inviteUser.invitationStarted,
    sent: state.inviteUser.sent,
    errorMessages: state.inviteUser.errorMessages,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      inviteUser,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RocketChat);
