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
import { AUTHENTICATION, AUTHORIZATION } from '../actions/actionTypes';

const authentication = (state = { isAuthenticated: false, email: null }, action) => {
  switch (action.type) {
    case AUTHENTICATION.SUCCESS:
      return {
        ...state,
        ...{
          isAuthenticated: true,
          email: implicitAuthManager.idToken.data.email,
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
    isAuthorized: false,
    authorizationStarted: false,
    userInfo: { email: null, firstName: null, lastName: null },
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
          isAuthorized: false,
          authorizationStarted: false,
        },
      };
    case AUTHORIZATION.SUCCESS:
      return {
        ...state,
        ...{
          isAuthorized: true,
          authorizationStarted: true,
          userInfo: action.payload.userInfo,
          ssoGroup: action.payload.ssoGroup,
        },
      };
    case AUTHORIZATION.FAILED:
      return {
        ...state,
        ...{
          isAuthorized: false,
          authorizationStarted: true,
          userInfo: action.payload.userInfo,
          ssoGroup: action.payload.ssoGroup,
        },
      };
    case AUTHORIZATION.ERROR:
      return {
        ...state,
        ...{
          isAuthorized: false,
          authorizationStarted: false,
          errorMessages: action.payload.errorMessages,
        },
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({ authentication, authorization });

export default rootReducer;
