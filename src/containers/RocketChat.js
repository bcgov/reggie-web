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
import { Grid, Row, Button } from 'react-bootstrap';
import Form from 'react-jsonschema-form';
import { css } from 'react-emotion';
import { BeatLoader } from 'react-spinners';
import { SELF_SERVER_APP } from '../constants';
import { inviteUser } from '../actionCreators';

// Only authorized user can access the app and invite new user:
class RocketChat extends Component {
  static displayName = '[Component RocketChat]';

  render() {
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

    const updatedContent = this.props.sent ? (
      <h4>Invitation sent, please pass your invitation code in person!</h4>
    ) : (
      <div>
        <h5>To invite new user, please provide the email and enter a security code</h5>
        <Form schema={schema} onSubmit={onSubmit}>
          <Button type="submit" bsStyle="primary">
            Submit
          </Button>
          <h4>{this.props.errorMessages[0]}</h4>
        </Form>
      </div>
    );

    const override = css`
      display: block;
      margin: 0 auto;
      border-color: #003366;
    `;

    const pageContent = this.props.invitationStarted ? (
      <BeatLoader css={override} sizeUnit={'px'} size={25} color="#003366" />
    ) : (
      updatedContent
    );

    return (
      <div>
        <h1>Hello {this.props.userInfo.firstName}</h1>
        <p>Welcome to Rocket chat invite page</p>
        <a href={SELF_SERVER_APP.ROCKETCHAT}>Rocket Chat Website</a>
        <Grid componentClass="main">
          <Row>
            <div className="col-4 mx-auto">{pageContent}</div>
          </Row>
        </Grid>
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
