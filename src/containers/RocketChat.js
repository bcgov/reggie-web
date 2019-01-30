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

  render() {
    // Json Schema Form:
    const schema = {
      // title: 'Please register to continue',
      type: 'object',
      required: ['invitationCode', 'email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          title: 'Email to invite',
        },
        invitationCode: { type: 'string', title: 'Invitation Code' },
      },
    };

    const onSubmit = ({ formData }) => {
      this.props.inviteUser(this.props.userInfo.id, formData.email, formData.invitationCode);
    };

    const onClick = () => {
      console.log('------------clicked');
    };

    const toggled = false;

    const formStatus = {
      inProgress: this.props.invitationStarted,
      success: this.props.sent,
      errMsg: this.props.errorMessages,
    };

    const jsf = (
      <JSForm formSchema={schema} toggled={toggled} onSubmit={onSubmit} status={formStatus} />
    );

    return (
      <div>
        <h1>Hello {this.props.userInfo.firstName}</h1>
        <p>Welcome to Rocket chat</p>
        {/* External link */}
        <a href={SELF_SERVER_APP.ROCKETCHAT.URL}>
          <Button bsStyle="primary">Rocket Chat</Button>
        </a>
        <Button bsStyle="primary" onClick={onClick}>
          Invite New User
        </Button>
        {jsf}
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
