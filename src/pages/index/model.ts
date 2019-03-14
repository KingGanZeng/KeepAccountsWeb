// import Taro from '@tarojs/taro';
import * as indexApi from './service';

export default {
  namespace: 'index',
  state: {
    data: [],
    key: '72eed010c976e448971655b56fc2324e',
    v: '1.0'
  },

  effects: {
    * getNavBarData({ payload }, { select, call, put }) {
      const { key, v } = yield select(state => state.index);
      const result = yield call(indexApi.getNavBarData, {
        key,
        v,
        ...payload
      });
      if (result && result.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            navBarData: result[0]
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            navBarData: []
          }
        })
      }
    },
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
              {record_id: 'r04', uid: 'DE90ESD290', date: '2019-03-12', username: 'zenggan', record_type: 'expense', category:'food', money: 200.12},
              {record_id: 'r03', uid: 'DE90ESD290', date: '2019-03-12', username: 'zenggan', record_type: 'expense', category:'shopping',money: 2009.00},
              {record_id: 'r02', uid: 'DE90ESD290', date: '2019-03-11', username: 'zenggan', record_type: 'expense', category:'shopping',money: 400.00},
              {record_id: 'r01', uid: 'DE90ESD290', date: '2019-03-7', username: 'zenggan', record_type: 'expense', category:'food',money: 40.00},
              {record_id: 'r00', uid: 'DE90ESD290', date: '2019-03-5', username: 'zenggan', record_type: 'income', category:'salary',money: 40000.00},
            ]
          }
        })
      }
    },
  },

  reducers: {
    updateState(state, { payload: data }) {
      return { ...state, ...data }
    }
  }

}
