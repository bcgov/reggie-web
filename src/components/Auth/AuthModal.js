//
// Reggie Web
//
// Copyright © 2018 Province of British Columbia
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
// Created by Jason Leach on 2018-10-03.
//

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import logo from '../UI/bcgovlogo.svg';
import './AuthModal.css';

export const AuthModal = ({ isAuthenticated }) => {
  return (
    <Modal modalClassName="auth-modal" isOpen={!isAuthenticated} fade={false}>
      <ModalHeader>
        <div className="banner">
          <img src={logo} className="header-logo" alt="logo" />
          <h1>BC Gov Reggie</h1>
        </div>
      </ModalHeader>
      <ModalBody>
        Please login before starting the Rocketchat Registration process with Reggie
      </ModalBody>
      <ModalFooter>
        <Link className="auth-button" to="/login">
          Login
        </Link>
      </ModalFooter>
    </Modal>
  );
};

AuthModal.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default AuthModal;
