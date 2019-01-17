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

const authentication = (state = { isAuthenticated: false }, action) => {
  switch (action.type) {
    case AUTHENTICATION.SUCCESS:
      return { isAuthenticated: true, email: implicitAuthManager.idToken.data.email };
    case AUTHENTICATION.FAILED:
      implicitAuthManager.clearAuthLocalStorage();
      return { isAuthenticated: false, email: null };
    default:
      return state;
  }
};

const authorization = (
  state = {
    isAuthorized: false,
    authorizationStarted: false,
    email: null,
    ssoGroup: null,
  },
  action
) => {
  switch (action.type) {
    case AUTHORIZATION.START:
      return {
        ...state,
        ...{
          isAuthorized: false,
          authorizationStarted: true,
        },
      };
    case AUTHORIZATION.SUCCESS:
      return {
        isAuthorized: true,
        authorizationStarted: true,
        email: action.payload.email,
        ssoGroup: action.payload.ssoGroup,
      };
    case AUTHORIZATION.FAILED:
      return {
        isAuthorized: false,
        authorizationStarted: true,
        email: action.payload.email,
        ssoGroup: action.payload.ssoGroup,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({ authentication, authorization });

export default rootReducer;
