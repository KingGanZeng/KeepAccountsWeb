import * as newBookApi from './service';

export default {
  namespace: 'newBook',
  state: {
    data: [],
    v: '1.0'
  },

  effects: {
    * createBook({payload}, {select, call, put}) {
      const {v} = yield select(state => state.newBook)
      const result = yield call(newBookApi.createBook, {
        v,
        ...payload
      })

      if (result.book_id) {
        console.log(result)
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
      return result
    },
    * getBookInfo({payload}, {select, call, put}) {
      const {v} = yield select(state => state.newBook)
      const result = yield call(newBookApi.getBookInfo, {
        v,
        ...payload
      })
      if (result.results.length != 0) {
        yield put({
          type: 'updateState',
          payload: {
            bookInfo: result.results[0]
          }
        })
      }
      return result
    },
  },

  reducers: {
    updateState(state, { payload: data }) {
      return { ...state, ...data }
    }
  }
}
