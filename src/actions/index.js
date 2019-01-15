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

import { AUTHENTICATION, AUTHORIZATION } from '../constants';

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

export const authorizationSuccess = (ssoGroup, email) => {
  return {
    type: AUTHORIZATION.SUCCESS,
    payload: {
      ssoGroup,
      email,
    },
  };
};

export const authorizationFailed = messages => {
  return {
    type: AUTHORIZATION.FAILED,
    payload: {
      messages,
    },
  };
};

//async
export const authorize = async (ssoGroup, email) => {
  console.log('authorizing------------');
  return dispatch => {
    dispatch(authorizationStart());
    try {
      // axios:
      // const response = await xxx(ssoGroup, email);
      if (ssoGroup !== 'rc') throw Error('noono');
      const response = { data: { email: '123' } };
      console.log('authorizing------worked------');
      setTimeout(() => {
        dispatch(authorizationSuccess(ssoGroup, response.data.email));
      }, 250);
    } catch (err) {
      console.log('authorizing-----fail-------');
      dispatch(authorizationFailed('not authorized'));
    }
  };
};
