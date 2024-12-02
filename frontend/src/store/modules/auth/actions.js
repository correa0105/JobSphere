import * as typesActions from '../typesActions';

export function loginRequest(payload) {
  return {
    type: typesActions.LOGIN_REQUEST,
    payload,
  };
}

export function loginSuccess(payload) {
  return {
    type: typesActions.LOGIN_SUCCESS,
    payload,
  };
}

export function loginFailure(payload) {
  return {
    type: typesActions.LOGIN_FAILURE,
    payload,
  };
}
