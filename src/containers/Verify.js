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
import { Redirect, Link } from 'react-router-dom';
import Form from 'react-jsonschema-form';
import { css } from 'react-emotion';
import { BeatLoader } from 'react-spinners';
import { authorize, verifyEmail } from '../actionCreators';
import { AUTH_CODE, SELF_SERVER_APP } from '../constants';

// Here check if invited user is valid:
class Verify extends Component {
  static displayName = '[Component Verify]';

  // check for authorization status first:
  componentWillMount = () => {
    this.props.authorize(SELF_SERVER_APP.ROCKETCHAT.NAME, this.props.userId);
  };

  render() {
    let invitationRedirect = null;
    // if user is matching the Rocket chat schema, redirect to registration directly:
    // TODO: update the check that uses isAuthorizing:
    console.log('------------status!!');
    console.log(this.props.authCode);
    console.log(AUTH_CODE.REJECTED);
    if (this.props.authCode !== AUTH_CODE.REJECTED && this.props.userInfo.id !== null) {
      console.log('-------------this user is good');
      localStorage.removeItem('emailJwt');
      localStorage.removeItem('emailIntention');
      invitationRedirect = <Redirect to="/registration" />;
    }

    const emailJwt = localStorage.getItem('emailJwt');
    const schema = {
      type: 'object',
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          title: 'Email',
        },
      },
    };

    const onSubmit = ({ formData }) => {
      this.props.verifyEmail(this.props.userId, formData.email, emailJwt);
    };

    const updatedContent = this.props.verfied ? (
      <div>
        <h4>Verified, please register</h4>
        <Link className="btn btn-primary" to="/registration">
          Registration
        </Link>
      </div>
    ) : (
      <div>
        <h5>Enter your email to verify invitation</h5>
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

    const loader = <BeatLoader css={override} sizeUnit={'px'} size={25} color="#003366" />;

    const loadedContent = this.props.verifyStarted ? (
      loader
    ) : (
      <Grid componentClass="main">
        <Row>
          <div className="col-4 mx-auto">{updatedContent}</div>
        </Row>
      </Grid>
    );

    const pageContent = this.props.userInfo.id === null ? loader : loadedContent;

    return (
      <div>
        {invitationRedirect}
        <h1>Welcome to Rocket chat</h1>
        <h4>{this.props.authErrorMessages[0]}</h4>
        {pageContent}
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
    authCode: state.authorization.authCode,
    isAuthorizing: state.authorization.isAuthorizing,
    userInfo: state.authorization.userInfo,
    authErrorMessages: state.authorization.errorMessages,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      authorize,
      verifyEmail,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Verify);
