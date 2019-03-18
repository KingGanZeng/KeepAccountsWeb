import * as indexApi from './service';

export default {
  namespace: 'index',
  state: {
    data: [],
    key: '72eed010c976e448971655b56fc2324e',
    v: '1.0'
  },

  effects: {
    * getRecordData({ payload }, { select, call, put }) {
      const { key, v } = yield select(state => state.index);
      const result = yield call(indexApi.getRecordData, {
        key,
        v,
        ...payload
      });
      if (result && result.length > 0 && typeof result === "object") {
        yield put({
          type: 'updateState',
          payload: {
            recordData: result
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            recordData: [
              {record_id: 'r05', uid: 'DE90ESD290', date: '2019-03-12', username: 'zenggan', record_type: 'income', category:'sell', money: 200.32},
            ]
          }
        })
      }
    },
    * getMoneyManagementData({ payload }, { select, call, put }) {
      const { key, v } = yield select(state => state.index);
      const result = yield call(indexApi.getMoneyManagementData, {
        key,
        v,
        ...payload
      });
      if (result && result.length > 0 && typeof result === "object") {
        yield put({
          type: 'updateState',
          payload: {
            moneyManagementData: result
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            moneyManagementData: [
              {management_name: '支付宝理财', income: 2000, expense: 3000.02, manage_id: 'm01', create_time: '2019-03-01'}
            ]
          }
        })
      }
    }
  },

  reducers: {
    updateState(state, { payload: data }) {
      return { ...state, ...data }
    }
  }

}
