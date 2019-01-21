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
import { Grid, Row, Col, PageHeader, Button } from 'react-bootstrap';
import Form from 'react-jsonschema-form';
import { connect } from 'react-redux';
import { updateUser } from '../actionCreators';

class Registration extends Component {
  static displayName = '[Component Registration]';

  render() {
    const schema = {
      title: 'Please register to continue',
      type: 'object',
      required: ['firstName', 'lastName', 'email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          title: 'Email',
          default: this.props.userInfo.email,
        },
        firstName: { type: 'string', title: 'First Name', default: this.props.userInfo.firstName },
        lastName: { type: 'string', title: 'Last Name', default: this.props.userInfo.lastName },
      },
    };

    const onSubmit = ({ formData }) => {
      this.props.updateUser(this.props.userInfo.id, formData);
    };

    const updatedContent = this.props.updated ? (
      <h4>Thank you for registering, please check your email!</h4>
    ) : (
      <Form schema={schema} onSubmit={onSubmit}>
        <Button type="submit" bsStyle="primary">
          Submit
        </Button>
        <h4>{this.props.errorMessages[0]}</h4>
      </Form>
    );

    const pageContent = this.props.updateStarted ? <h4>Loading....</h4> : updatedContent;

    return (
      <Grid componentClass="main">
        <Row>
          <Col xs={12}>
            <PageHeader>Registration Page</PageHeader>
          </Col>
        </Row>
        <Row>
          <Col>{pageContent}</Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.authorization.userInfo,
    updateStarted: state.updateUser.updateStarted,
    updated: state.updateUser.updated,
    errorMessages: state.updateUser.errorMessages,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateUser,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);
