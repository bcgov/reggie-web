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
  authorizationSuccess,
  authorizationError,
  authorizationStop,
  updateUserStart,
  updateUserSuccess,
  updateUserError,
  updateUserClear,
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
import { API, AUTH_CODE, SELF_SERVER_APP } from '../constants';

const axi = axios.create({
  baseURL: API.BASE_URL,
  timeout: API.TIME_OUT,
  headers: { Accept: 'application/json' },
});

const checkStatus = (isPending = false, isAuthorized = false, isRejected = false) => {
  if (isRejected) return AUTH_CODE.REJECTED;
  if (isPending) return AUTH_CODE.PENDING;
  if (isAuthorized) return AUTH_CODE.AUTHORIZED;
  return AUTH_CODE.NEW;
};

/**
 * Authorization helper, update authorization states or throw errors
 *
 * @param {String} ssoGroup The targeted SSO group to check aganst
 * @param {String} userId The sso user ID
 *
 */

const _authorizeHelper = async (dispatch, userId, ssoGroup) => {
  let authCode = null;
  let newUserInfo = {};
  try {
    const res = await axi.get(API.GET_SSO_USER(userId));
    // const data = response.data;
    authCode = checkStatus(res.data.isPending, res.data.isAuthorized, res.data.isRejected);
    newUserInfo = {
      id: res.data.id,
      email: res.data.email,
      firstName: res.data.firstName,
      lastName: res.data.lastName,
    };
  } catch (error) {
    throw Error(error);
  }
  return dispatch(authorizationSuccess(ssoGroup, newUserInfo, authCode));
};

/**
 * Check user authorization status
 *
 * @param {String} ssoGroup The targeted SSO group to check aganst
 * @param {String} userId The sso user ID
 * @param {Boolean} doStart Dispatch the start action or not, default is yes
 * This is for other action to skip the start process when trying to update authCode
 */
export const authorize = (ssoGroup, userId, doStart = true) => {
  return async (dispatch, getState) => {
    if (doStart) dispatch(authorizationStart());
    try {
      return await _authorizeHelper(dispatch, userId, ssoGroup);
    } catch (err) {
      const message = 'Fail to connect to KeyCloak, please refresh!';
      return dispatch(authorizationError([message]));
    }
  };
};

export const clearAuthorizationProcess = () => {
  return dispatch => {
    dispatch(authorizationStop());
  };
};

export const updateUser = (userId, userProfile, webUrl) => {
  return async (dispatch, getState) => {
    dispatch(updateUserStart());

    try {
      await axi.put(API.UPDATE_SSO_USER(userId), {
        ...userProfile,
        ...{ refUrl: webUrl },
      });

      // Get the updated the current user info after the API request:
      await _authorizeHelper(dispatch, userId, SELF_SERVER_APP.ROCKETCHAT.NAME);
    } catch (err) {
      const errMsg = err.response.data.error
        ? err.response.data.error
        : 'Fail to register your account, please try again.';
      return dispatch(updateUserError([errMsg]));
    }
    return dispatch(updateUserSuccess());
  };
};

export const clearUpdateUser = () => {
  return dispatch => {
    dispatch(updateUserClear());
  };
};

export const confirmEmail = (userId, email, jwt) => {
  return async (dispatch, getState) => {
    dispatch(confirmEmailStart());

    try {
      await axi.put(API.CONFIRM_SSO_USER(userId), { userEmail: email, token: jwt });

      // Get the updated the current user info after the API request:
      await _authorizeHelper(dispatch, userId, SELF_SERVER_APP.ROCKETCHAT.NAME);
    } catch (err) {
      const hint = '\nPlease register again.';
      let errMsg = 'Fail to confirm your email.';
      if (err.response) {
        errMsg = 'Please close your browser and register again.';
        if (err.response.status === 500) errMsg = err.response.data.error;
      }
      return dispatch(confirmEmailError([`${errMsg} ${hint}`]));
    }
    return dispatch(confirmEmailSuccess());
  };
};

// Using a fix code for now as place holder: https://github.com/axios/axios/issues/1104
export const inviteUser = (
  userId,
  email,
  webUrl,
  invitationCode = SELF_SERVER_APP.ROCKETCHAT.INVITATION_CODE
) => {
  return dispatch => {
    dispatch(inviteUserStart());
    axi
      .post(API.INVITE_USER(userId), { email, code: invitationCode, refUrl: webUrl })
      .then(res => {
        return dispatch(inviteUserSuccess());
      })
      .catch(err => {
        const errMsg =
          'Unable to send out invitation to email provided, please double check the email address';
        return dispatch(inviteUserError([errMsg]));
      });
  };
};

export const verifyEmail = (
  userId,
  email,
  jwt,
  invitationCode = SELF_SERVER_APP.ROCKETCHAT.INVITATION_CODE // Same as above
) => {
  return dispatch => {
    dispatch(verifyEmailStart());
    axi
      .get(API.VERIFY_SSO_USER(userId), {
        params: {
          email,
          code: invitationCode,
          token: jwt,
        },
      })
      .then(res => {
        return dispatch(verifyEmailSuccess());
      })
      .catch(err => {
        let errMsg = 'Your invitation link is invalid, please get inivted again';
        return dispatch(verifyEmailError([errMsg]));
      });
  };
};
