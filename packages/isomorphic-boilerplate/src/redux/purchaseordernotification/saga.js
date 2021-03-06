import { all, takeEvery, put, call } from 'redux-saga/effects';
import axios from 'axios';
// import { getToken } from '@iso/lib/helpers/utility';
import siteConfig from '@iso/config/site.config';
import notification from '@iso/components/Notification';
import actions from './actions';

const onCallReqeust = async (URI) =>
  await axios
    .get(URI)
    .then((res) => res)
    .catch((error) => error);
const onPostCallReqeust = async (sendData, URI) =>
  await axios
    .post(URI, sendData)
    .then((res) => res)
    .catch((error) => error);
const onPutCallReqeust = async (sendData, URI) =>
  await axios
    .put(URI, sendData)
    .then((res) => res)
    .catch((error) => error);
const onDeleteCallReqeust = async (URI) =>
  await axios
    .delete(URI)
    .then((res) => res)
    .catch((error) => error);
export function* getPurchaseOrderNotifications({ payload }) {
  axios.defaults.headers.get['Authorization'] = localStorage.getItem(
    'id_token'
  );
  try {
    const callResult = yield call(
      onCallReqeust,
      `${siteConfig.apiUrl}/purchaseordernotification/filter/${payload.id}`
    );
    if (callResult.response != undefined) {
      notification('error', callResult.response.data.msg);
    } else {
      var temp = [];
      callResult.data.data.map((value, index) => {
        value.key = value._id;
        temp.push(value);
      });

      yield put({
        type: actions.GET_PURCHASEORDER_NOTIFICATIONS_REDUCER,
        data: temp, //createDemoData(),
      });
    }
  } catch (error) {
    notification('error', 'Internal server error!');
  }
}
// export function* getScheduledTaskById({ payload }) {
//   axios.defaults.headers.get['Authorization'] = localStorage.getItem(
//     'id_token'
//   );
//   try {
//     const callResult = yield call(
//       onCallReqeust,
//       `${siteConfig.apiUrl}/scheduledtask/${payload.id}`
//     );

//     if (callResult.response != undefined) {
//       notification('error', callResult.response.data.msg);
//     } else {
//       yield put({
//         type: actions.GET_SCHEDULED_TASK_BY_ID_REDUCER,
//         data: callResult.data.data,
//         msg: null,
//       });
//     }
//   } catch (error) {
//     notification('error', 'Internal server error!');
//   }
// }
export function* addPurchaseOrderNotification({ payload }) {
  axios.defaults.headers.post['Authorization'] = localStorage.getItem(
    'id_token'
  );
  try {
    const callResult = yield call(
      onPostCallReqeust,
      payload.sendData,
      `${siteConfig.apiUrl}/purchaseordernotification`
    );
    if (callResult.response != undefined) {
      notification('error', callResult.response.data.msg);
    } else {
      notification('success', callResult.data.msg);
      yield put({
        type: actions.GET_PURCHASEORDER_NOTIFICATIONS,
        payload: { id: payload.sendData.intPurchaseOrderID },
      });
    }
  } catch (error) {
    yield put({ type: actions.ADD_FAILED, msg: 'Server Internal error!' });
  }
}
export function* updatePurchaseOrderNotification({ payload }) {
  axios.defaults.headers.put['Authorization'] = localStorage.getItem(
    'id_token'
  );
  try {
    const callResult = yield call(
      onPutCallReqeust,
      payload.sendData,
      `${siteConfig.apiUrl}/purchaseordernotification/${payload.id}`
    );

    if (callResult.response != undefined) {
      notification('error', callResult.response.data.msg);
    } else {
      notification('success', callResult.data.msg);
      yield put({
        type: actions.GET_PURCHASEORDER_NOTIFICATIONS,
        payload: { id: payload.sendData.intPurchaseOrderID },
      });
    }
  } catch (error) {
    notification('success', 'Server Internal error!');
  }
}

export function* deletePurchaseOrderNotification({ payload }) {
  axios.defaults.headers.delete['Authorization'] = localStorage.getItem(
    'id_token'
  );
  try {
    const callResult = yield call(
      onDeleteCallReqeust,
      `${siteConfig.apiUrl}/purchaseordernotification/${payload.id}`
    );
    if (callResult.response != undefined) {
      notification('error', callResult.response.data.msg);
    } else {
      notification('success', callResult.data.msg);
      yield put({
        type: actions.DELETE_PURCHASER_NOTIFICATION_SUCCESS,
      });
    }
  } catch (error) {
    notification('error', 'Server Internal error!');
  }
}

export default function* rootSaga() {
  yield all([
    yield takeEvery(
      actions.GET_PURCHASEORDER_NOTIFICATIONS,
      getPurchaseOrderNotifications
    ),
    yield takeEvery(
      actions.ADD_PURCHASEORDER_NOTIFICATION,
      addPurchaseOrderNotification
    ),
    yield takeEvery(
      actions.UPDATE_PURCHASEORDER_NOTIFICATION,
      updatePurchaseOrderNotification
    ),
    yield takeEvery(
      actions.DELETE_PURCHASER_NOTIFICATION,
      deletePurchaseOrderNotification
    ),
  ]);
}
