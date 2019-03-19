
// import Taro from '@tarojs/taro';
import * as newBookApi from './service';

export default {
  namespace: 'newBook',
  state: {
    data: [],
    v: '1.0'
  },

  effects: {
    * createBook({ payload }, { select, call, put }) {
      const { v } = yield select(state => state.newBook)
      const result = yield call(newBookApi.createBook, {
        v,
        ...payload
      })
      if(result) {
        yield put({
          type: 'updateState',
          payload: {
            submitSuccess: true,
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            submitSuccess: false
          }
        })
      }
    },
    * getBookInfo({ payload }, { select, call, put }) {
      const { v } = yield select(state => state.newBook)
      const result = yield call(newBookApi.getBookInfo, {
        v,
        ...payload
      })
      if(result && result.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            book_info: result[0]
          }
        })
      }
    },

  reducers: {
    updateState(state, { payload: data }) {
      return { ...state, ...data }
    }
  }

}
