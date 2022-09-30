import { put } from 'redux-saga/effects';
import ACTION from '../actions/actionTypes';
import history from '../browserHistory';
import * as restController from '../api/rest/restController';

export function* loginSaga(action) {
  yield put({ type: ACTION.AUTH_ACTION_REQUEST });
  try {
    const {data:{data:{user}}} = yield restController.loginRequest(action.data);
    action.history.replace('/');
    yield put({ type: ACTION.GET_USER_SUCCESS, user });
  } catch (err) {
    yield put({ type: ACTION.AUTH_ACTION_ERROR, error: err.response });
  }
}

export function* registerSaga(action) {
  yield put({ type: ACTION.AUTH_ACTION_REQUEST });
  try {
    const {data:{data:{user}}} = yield restController.registerRequest(action.data);
    action.history.replace('/');
    yield put({ type: ACTION.GET_USER_SUCCESS, user });
  } catch (err) {
    yield put({ type: ACTION.AUTH_ACTION_ERROR, error: err.response });
  }
}
