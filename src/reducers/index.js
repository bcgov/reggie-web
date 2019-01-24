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

import { combineReducers } from 'redux';
import implicitAuthManager from '../auth';
import {
  AUTHENTICATION,
  AUTHORIZATION,
  UPDATE_USER,
  CONFIRM_EMAIL,
  INIVITE_USER,
} from '../actions/actionTypes';

const authentication = (state = { isAuthenticated: false, email: null, userId: null }, action) => {
  switch (action.type) {
    case AUTHENTICATION.SUCCESS:
      return {
        ...state,
        ...{
          isAuthenticated: true,
          email: implicitAuthManager.idToken.data.email,
          userId: implicitAuthManager.idToken.data.sub,
        },
      };
    case AUTHENTICATION.FAILED:
      implicitAuthManager.clearAuthLocalStorage();
      return state;
    default:
      return state;
  }
};

const authorization = (
  state = {
    authCode: 0,
    authorizationStarted: false,
    userInfo: { id: null, email: null, firstName: null, lastName: null },
    ssoGroup: null,
    errorMessages: [],
  },
  action
) => {
  switch (action.type) {
    case AUTHORIZATION.START:
      return {
        ...state,
        ...{
          authCode: 0,
          authorizationStarted: false,
        },
      };
    case AUTHORIZATION.PENDING:
      return {
        ...state,
        ...{
          authCode: 1,
          authorizationStarted: true,
          userInfo: action.payload.userInfo,
          ssoGroup: action.payload.ssoGroup,
        },
      };
    case AUTHORIZATION.SUCCESS:
      return {
        ...state,
        ...{
          authCode: 2,
          authorizationStarted: true,
          userInfo: action.payload.userInfo,
          ssoGroup: action.payload.ssoGroup,
        },
      };
    case AUTHORIZATION.FAILED:
      return {
        ...state,
        ...{
          authCode: 3,
          authorizationStarted: true,
          userInfo: action.payload.userInfo,
          ssoGroup: action.payload.ssoGroup,
        },
      };
    case AUTHORIZATION.ERROR:
      return {
        ...state,
        ...{
          authCode: 0,
          authorizationStarted: false,
          errorMessages: action.payload.errorMessages,
        },
      };
    default:
      return state;
  }
};

const updateUser = (
  state = { updateStarted: false, updated: false, errorMessages: [] },
  action
) => {
  switch (action.type) {
    case UPDATE_USER.START:
      return {
        ...state,
        ...{
          updateStarted: true,
        },
      };
    case UPDATE_USER.SUCCESS:
      return {
        ...state,
        ...{
          updateStarted: false,
          updated: true,
        },
      };
    case UPDATE_USER.ERROR:
      return {
        ...state,
        ...{
          updateStarted: false,
          errorMessages: action.payload.errorMessages,
        },
      };
    default:
      return state;
  }
};

const confirmEmail = (
  state = { verifyStarted: false, confirmed: false, errorMessages: [] },
  action
) => {
  switch (action.type) {
    case CONFIRM_EMAIL.START:
      return {
        ...state,
        ...{
          verifyStarted: true,
        },
      };
    case CONFIRM_EMAIL.SUCCESS:
      localStorage.removeItem('emailJwt');
      return {
        ...state,
        ...{
          verifyStarted: false,
          confirmed: true,
        },
      };
    case CONFIRM_EMAIL.ERROR:
      localStorage.removeItem('emailJwt');
      return {
        ...state,
        ...{
          verifyStarted: false,
          errorMessages: action.payload.errorMessages,
        },
      };
    default:
      return state;
  }
};

const inviteUser = (
  state = { invitationStarted: false, sent: false, errorMessages: [] },
  action
) => {
  switch (action.type) {
    case INIVITE_USER.START:
      return {
        ...state,
        ...{
          invitationStarted: true,
        },
      };
    case INIVITE_USER.SUCCESS:
      return {
        ...state,
        ...{
          invitationStarted: false,
          sent: true,
        },
      };
    case INIVITE_USER.ERROR:
      return {
        ...state,
        ...{
          invitationStarted: false,
          errorMessages: action.payload.errorMessages,
        },
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  authentication,
  authorization,
  updateUser,
  confirmEmail,
  inviteUser,
});

export default rootReducer;
