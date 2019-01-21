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
import { Grid, Row, Col, PageHeader, Button } from 'react-bootstrap';
import Form from 'react-jsonschema-form';
import { connect } from 'react-redux';

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

    return (
      <Grid componentClass="main">
        <Row>
          <Col xs={12}>
            <PageHeader>Registration Page</PageHeader>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form
              schema={schema}
              onChange={console.log('changed')}
              onSubmit={console.log('submitted')}
              onError={console.log('errors')}
            >
              <Button type="submit" bsStyle="primary">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.authorization.userInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);
