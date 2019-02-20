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
import { Link } from 'react-router-dom';
import { updateUser, clearUpdateUser } from '../actionCreators';
import { BaseForm } from '../components/UI/BaseForm';
import SideMessages from '../components/UI/SideMessages';

// Here is the form for user to complete profile infomation and register for app:
class Registration extends Component {
  static displayName = '[Component Registration]';

  // Clear user update states when done with the flow:
  componentWillUnmount = () => {
    if (this.props.updated || this.props.errorMessages.length > 0) this.props.clearUpdateUser();
  };

  render() {
    const schema = {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'emailRepeat'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          title: 'Email',
          default: this.props.userInfo.email,
        },
        emailRepeat: {
          type: 'string',
          format: 'email',
          title: 'Repeat Email',
        },
        firstName: { type: 'string', title: 'First Name', default: this.props.userInfo.firstName },
        lastName: { type: 'string', title: 'Last Name', default: this.props.userInfo.lastName },
      },
    };

    const validate = (formData, errors) => {
      if (formData.email !== formData.emailRepeat) {
        errors.emailRepeat.addError('Emails do not match.');
      }
      return errors;
    };

    const onSubmit = ({ formData }) => {
      delete formData.emailRepeat;
      this.props.updateUser(this.props.userInfo.id, formData, window.location.origin);
    };

    const formStatus = {
      inProgress: this.props.updateStarted,
    };

    const formMessages = {
      failureMsg: this.props.errorMessages.length > 0 ? this.props.errorMessages[0] : null,
    };

    const messages = (
      <SideMessages
        centerContent={<p>Thank you for registering, please check your email!</p>}
        rightContent={
          <div>
            <p>Not receiving email?</p>
            <Link className="hint-link" to="/">
              Restart Registration
            </Link>
          </div>
        }
      />
    );

    const formContent = this.props.updated ? (
      messages
    ) : (
      <div>
        <p>
          Almost there, we just need to know some details about you!
          <br />
          You will need to verify your email address before we can complete the registration.
          <br />
          A confirmation link will be sent to you via email shortly.
          <br />
        </p>
        <BaseForm
          formSchema={schema}
          formValidate={validate}
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
      clearUpdateUser,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);
