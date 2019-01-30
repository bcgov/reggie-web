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
import { css } from 'react-emotion';
import { BeatLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import './JSForm.css';
import 'react-toastify/dist/ReactToastify.css';

// Toast message:
const toastMsg = (status, msg) => {
  if (!msg) return toast('Something went wrong!');
  if (status) return toast.success(msg, { position: toast.POSITION.BOTTOM_CENTER });
  return toast.error(msg, { position: toast.POSITION.BOTTOM_CENTER });
};

// Loader:
const override = css`
  display: block;
  margin: 0 auto;
  border-color: #003366;
`;
const loader = <BeatLoader css={override} sizeUnit={'px'} size={25} color="#003366" />;

const JSForm = ({ formSchema, toggled, onSubmit, status }) => {
  // Success or error message:
  if (status.success) toastMsg(true, 'Success!');
  if (status.errMsg.length > 0) toastMsg(false, status.errMsg[0]);

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
  const formContent = status.inProgress ? loader : jsform;

  return (
    <div className={toggled ? 'jsform toggled' : 'jsform'}>
      <ToastContainer />
      {formContent}
    </div>
  );
};

JSForm.propTypes = {
  formSchema: PropTypes.object.isRequired,
  toggled: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
};

export default JSForm;
