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

import axios from 'axios';
import { authorizationStart, authorizationSuccess, authorizationFailed } from '../actions';
import { API } from '../constants';
const axi = axios.create({
  baseURL: API.BASE_URL(),
  timeout: 4000,
});

export const authorize = (ssoGroup, email) => {
  return dispatch => {
    dispatch(authorizationStart());
    axi
      .get(API.GET_SSO_USER(email), {
        headers: {
          Accept: 'application/json',
        },
      })
      .then(res => {
        return dispatch(authorizationSuccess(ssoGroup, email));
      })
      .catch(err => {
        return dispatch(authorizationFailed(ssoGroup, email));
      });
  };
};
