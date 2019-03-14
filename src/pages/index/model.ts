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
      const { key, v } = yield select(state => state.index)
      const result = yield call(indexApi.getNavBarData, {
        key,
        v,
        ...payload
      })
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
    * getBookData({ payload }, { select, call, put }) {
      const { key, v } = yield select(state => state.index)
      const result = yield call(indexApi.getBookData, {
        key,
        v,
        ...payload
      })
      if (result && result.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            bookData: result
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            bookData: []
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
