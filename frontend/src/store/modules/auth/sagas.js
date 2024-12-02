import { call, all, put, takeLatest } from 'redux-saga/effects';
import { get } from 'lodash';
import { toast } from 'react-toastify';

import axios from '../../../services/axios';
import * as typesActions from '../typesActions';
import * as actions from './actions';

function* loginRequest({ payload }) {
  try {
    const response = yield call(axios.post, '/login', payload.user);

    yield put(actions.loginSuccess({ ...response.data }));

    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;

    toast.success('Login successfully!');
    payload.prevPath();
  } catch (err) {
    const errors = get(err, 'response.data.errors', []);

    errors.map((error) => toast.error(error));
    yield put(actions.loginFailure());
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, 'auth.token', '');
  if (!token) return;

  axios.defaults.headers.Authorization = `Bearer ${token}`;
}

export default all([
  takeLatest(typesActions.LOGIN_REQUEST, loginRequest),
  takeLatest(typesActions.PERSIST_REHYDRATE, persistRehydrate),
]);
