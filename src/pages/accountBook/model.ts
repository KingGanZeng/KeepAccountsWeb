
// import Taro from '@tarojs/taro';
import * as accountBookApi from './service';

export default {
  namespace: 'accountBook',
  state: {
    data: [],
    v: '1.0'
  },

  effects: {
    * getBook({ payload }, { select, call, put }) {
      const { v } = yield select(state => state.accountBook)
      const result = yield call(accountBookApi.getBook, {
        v,
        ...payload
      })
      if(result.length != 0) {
        yield put({
          type: 'updateState',
          payload: {
            data: result.results,
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
