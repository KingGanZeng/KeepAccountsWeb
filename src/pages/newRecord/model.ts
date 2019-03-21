import * as newRecordApi from './service';

export default {
  namespace: 'newRecord',
  state: {
    data: [],
    v: '1.0'
  },

  effects: {
    * createRecord({ payload }, { select, call, put }) {
      const { v } = yield select(state => state.newBook)
      const result = yield call(newRecordApi.createRecord, {
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
      return result
    },
  },

  reducers: {

  }

}
