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
import { updateUser } from '../actionCreators';
import { BaseForm } from '../components/UI/BaseForm';

// Here is the form for user to complete profile infomation and register for app:
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
      this.props.updateUser(this.props.userInfo.id, formData, window.location.origin);
    };

    const formStatus = {
      inProgress: this.props.updateStarted,
    };

    const formMessages = {
      failureMsg: this.props.errorMessages.length > 0 ? this.props.errorMessages[0] : null,
    };

    const formContent = this.props.updated ? (
      <p>Thank you for registering, please check your email!</p>
    ) : (
      <div>
        <p>You are almost there, we just need to know some details about you!</p>
        <BaseForm
          formSchema={schema}
          toggled={true}
          onSubmit={onSubmit}
          status={formStatus}
          messages={formMessages}
        />
      </div>
    );

    return (
      <div>
        <h1>Rocket Chat Registration</h1>
        {formContent}
      </div>
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
