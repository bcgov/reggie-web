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
// Created by Shelly Xue Han on 2019-01-30.
//

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Button } from 'react-bootstrap';
import Form from 'react-jsonschema-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from './Loader';
import './BaseForm.css';

/**
 * Json Schema Form
 *
 * @param {Object} formSchema The schema to pass into the form
 * @param {boolean} toggled Display the whole form or not
 * @param {Function} onSubmit The action upon clicking submit button
 * @param {Object} status The form submission status: in process (maybe other status)
 * @param {Object} messages The successful or failed msg
 * @return {Object} The form
 */
export const BaseForm = ({ formSchema, toggled, onSubmit, status, messages }) => {
  // Success or error message:
  if (messages.successMsg)
    toast.success(messages.successMsg, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  // TODO: fix the issue as this get triggered twice, use active check for now
  if (messages.failureMsg && !toast.isActive('failToast')) {
    toast.error(messages.failureMsg, {
      position: toast.POSITION.BOTTOM_CENTER,
      toastId: 'failToast',
    });
  }

  // Form:
  const jsform = (
    <Grid componentClass="main">
      <Row>
        <div className="col-4 mx-auto">
          <Form schema={formSchema} onSubmit={onSubmit}>
            <Button type="submit" bsStyle="primary">
              Submit
            </Button>
          </Form>
        </div>
      </Row>
    </Grid>
  );

  // Alter between form and loading indication:
  const formContent = status.inProgress ? Loader : jsform;

  return (
    <div className={toggled ? 'jsform toggled' : 'jsform'}>
      <ToastContainer />
      {formContent}
    </div>
  );
};

BaseForm.propTypes = {
  formSchema: PropTypes.object.isRequired,
  toggled: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
};