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
// Created by Jason Leach on 2018-08-24.
//

import {
  AUTHENTICATION,
  AUTHORIZATION,
  UPDATE_USER,
  CONFIRM_EMAIL,
  INIVITE_USER,
  VERIFY_EMAIL,
} from './actionTypes';

export const authenticateSuccess = () => {
  return {
    type: AUTHENTICATION.SUCCESS,
  };
};

export const authenticateFailed = () => {
  return {
    type: AUTHENTICATION.FAILED,
  };
};

export const authorizationStart = () => {
  return {
    type: AUTHORIZATION.START,
  };
};

export const authorizationPending = (ssoGroup, userInfo) => {
  return {
    type: AUTHORIZATION.PENDING,
    payload: {
      ssoGroup,
      userInfo,
    },
  };
};

export const authorizationSuccess = (ssoGroup, userInfo) => {
  return {
    type: AUTHORIZATION.SUCCESS,
    payload: {
      ssoGroup,
      userInfo,
    },
  };
};

export const authorizationFailed = (ssoGroup, userInfo) => {
  return {
    type: AUTHORIZATION.FAILED,
    payload: {
      ssoGroup,
      userInfo,
    },
  };
};

export const authorizationError = errorMessages => {
  return {
    type: AUTHORIZATION.ERROR,
    payload: {
      errorMessages,
    },
  };
};

export const authorizationStop = () => {
  return {
    type: AUTHORIZATION.STOP,
  };
};

export const updateUserStart = () => {
  return {
    type: UPDATE_USER.START,
  };
};

export const updateUserSuccess = () => {
  return {
    type: UPDATE_USER.SUCCESS,
  };
};

export const updateUserError = errorMessages => {
  return {
    type: UPDATE_USER.ERROR,
    payload: {
      errorMessages,
    },
  };
};

export const confirmEmailStart = () => {
  return {
    type: CONFIRM_EMAIL.START,
  };
};

export const confirmEmailSuccess = () => {
  return {
    type: CONFIRM_EMAIL.SUCCESS,
  };
};

export const confirmEmailError = errorMessages => {
  return {
    type: CONFIRM_EMAIL.ERROR,
    payload: {
      errorMessages,
    },
  };
};

export const inviteUserStart = () => {
  return {
    type: INIVITE_USER.START,
  };
};

export const inviteUserSuccess = () => {
  return {
    type: INIVITE_USER.SUCCESS,
  };
};

export const inviteUserError = errorMessages => {
  return {
    type: INIVITE_USER.ERROR,
    payload: {
      errorMessages,
    },
  };
};

export const verifyEmailStart = () => {
  return {
    type: VERIFY_EMAIL.START,
  };
};

export const verifyEmailSuccess = () => {
  return {
    type: VERIFY_EMAIL.SUCCESS,
  };
};

export const verifyEmailError = errorMessages => {
  return {
    type: VERIFY_EMAIL.ERROR,
    payload: {
      errorMessages,
    },
  };
};
