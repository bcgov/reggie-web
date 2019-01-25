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
import { verifyEmail } from '../actionCreators';

// Here check if invited user is valid:
class Verify extends Component {
  static displayName = '[Component Verify]';

  // check for authorization first:
  render() {
    const emailJwt = localStorage.getItem('emailJwt');
    const schema = {
      type: 'object',
      required: ['invitationCode', 'email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          title: 'Your Email Address',
        },
        invitationCode: { type: 'string', title: 'Invitation Code' },
      },
    };

    const onSubmit = ({ formData }) => {
      this.props.verifyEmail(this.props.userId, formData.email, formData.invitationCode, emailJwt);
    };

    // TODO: instead of h4, will redirect:
    const updatedContent = this.props.verfied ? (
      <h4>Verified, please register</h4>
    ) : (
      <div>
        <h5>Enter your email and the security code</h5>
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

    const pageContent = this.props.verifyStarted ? (
      <BeatLoader css={override} sizeUnit={'px'} size={25} color="#003366" />
    ) : (
      updatedContent
    );

    return (
      <div>
        <p>Welcome to Rocket chat</p>
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
    userId: state.authentication.userId,
    verifyStarted: state.verifyEmail.verifyStarted,
    verfied: state.verifyEmail.verfied,
    errorMessages: state.verifyEmail.errorMessages,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      verifyEmail,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Verify);
