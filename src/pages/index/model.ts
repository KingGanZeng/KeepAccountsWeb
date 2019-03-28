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
      if (result.results.length != 0) {
        yield put({
          type: 'updateState',
          payload: {
            recordData: result.results
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            recordData: []
          }
        })
      }
      return result.results
    },
    * getSpecialBook({ payload }, { select, call, put }) {
      const { key, v } = yield select(state => state.index);
      const result = yield call(indexApi.getSpecialBook, {
        key,
        v,
        ...payload
      });
      if (result && result.length > 0 && typeof result === "object") {
        yield put({
          type: 'updateState',
          payload: {
            specialBookData: result.results
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            specialBookData: [
              // {management_name: '支付宝理财', income: 2000, expense: 3000.02, manage_id: 'm01', create_time: '2019-03-01'}
            ]
          }
        })
      }
      return result.results;
    }
  },

  reducers: {
    updateState(state, { payload: data }) {
      return { ...state, ...data }
    }
  }

}
