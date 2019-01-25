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
import {
  authorizationStart,
  authorizationPending,
  authorizationSuccess,
  authorizationFailed,
  authorizationError,
  authorizationStop,
  updateUserStart,
  updateUserSuccess,
  updateUserError,
  confirmEmailStart,
  confirmEmailSuccess,
  confirmEmailError,
  inviteUserStart,
  inviteUserSuccess,
  inviteUserError,
  verifyEmailStart,
  verifyEmailSuccess,
  verifyEmailError,
} from '../actions';
import { API } from '../constants';

const axi = axios.create({
  baseURL: API.BASE_URL(),
  timeout: API.TIME_OUT,
  headers: { Accept: 'application/json' },
});

const checkStatus = (isPending = false, isAuthorized = false, isRejected = false) => {
  if (isRejected) return 3;
  if (isPending) return 1;
  if (isAuthorized) return 2;
  return 0;
};

export const authorize = (ssoGroup, email) => {
  return dispatch => {
    dispatch(authorizationStart());
    axi
      .get(API.GET_SSO_USER(email))
      .then(res => {
        const userStatus = checkStatus(
          res.data.isPending,
          res.data.isAuthorized,
          res.data.isRejected
        );
        const newUserInfo = {
          id: res.data.id,
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
        };
        if (userStatus === 2) return dispatch(authorizationSuccess(ssoGroup, newUserInfo));
        if (userStatus === 3) return dispatch(authorizationFailed(ssoGroup, newUserInfo));
        return dispatch(authorizationPending(ssoGroup, newUserInfo));
      })
      .catch(err => {
        return dispatch(authorizationError([err.message]));
      });
  };
};

export const clearAuthorizationProcess = () => {
  return dispatch => {
    dispatch(authorizationStop());
  };
};

export const updateUser = (userId, userProfile) => {
  return dispatch => {
    dispatch(updateUserStart());
    axi
      .put(API.UPDATE_SSO_USER(userId), userProfile)
      .then(res => {
        return dispatch(updateUserSuccess());
      })
      .catch(err => {
        const errMsg = 'Fail to register your account, please try again.';
        return dispatch(updateUserError([errMsg]));
      });
  };
};

export const confirmEmail = (userId, email, jwt) => {
  return dispatch => {
    dispatch(confirmEmailStart());
    axi
      .put(API.CONFIRM_SSO_USER(userId), { userEmail: email, token: jwt })
      .then(res => {
        return dispatch(confirmEmailSuccess());
      })
      .catch(err => {
        let errMsg = 'Fail to confirm your email, please register again.';
        if (err.response) {
          errMsg = `${err.response.data}. Please register again.`;
        }
        return dispatch(confirmEmailError([errMsg]));
      });
  };
};

export const inviteUser = (userId, email, invitationCode) => {
  return dispatch => {
    dispatch(inviteUserStart());
    axi
      .post(API.INVITE_USER(userId), { email, code: invitationCode })
      .then(res => {
        return dispatch(inviteUserSuccess());
      })
      .catch(err => {
        const errMsg = 'Fail to invite the user.';
        return dispatch(inviteUserError([errMsg]));
      });
  };
};

export const verifyEmail = (userId, email, code, jwt) => {
  return dispatch => {
    dispatch(verifyEmailStart());
    axi
      .get(API.VERIFY_SSO_USER(userId), {
        params: {
          email,
          code,
          token: jwt,
        },
      })
      .then(res => {
        return dispatch(verifyEmailSuccess());
      })
      .catch(err => {
        let errMsg = 'Your email + code pair is invalid.';
        return dispatch(verifyEmailError([errMsg]));
      });
  };
};
