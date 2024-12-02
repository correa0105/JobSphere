import * as typesActions from '../typesActions';

import axios from '../../../services/axios';

const initialState = {
  isLoggedIn: false,
  token: false,
  user: {},
};

export default function reducer(state = initialState, action = null) {
  switch (action.type) {
    case typesActions.LOGIN_REQUEST: {
      const newState = { ...state };
      return newState;
    }

    case typesActions.LOGIN_SUCCESS: {
      const newState = { ...state };
      newState.isLoggedIn = true;
      newState.token = action.payload.token;
      newState.user = action.payload.user;
      return newState;
    }

    case typesActions.LOGIN_FAILURE: {
      delete axios.defaults.headers.Authorization;
      const newState = { ...initialState };
      return newState;
    }

    default: {
      return state;
    }
  }
}
