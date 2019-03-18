
// import Taro from '@tarojs/taro';
import * as newManagementApi from './service';

export default {
  namespace: 'newManagement',
  state: {
    data: [],
    key: '72eed010c976e448971655b56fc2324e',
    v: '1.0'
  },

  effects: {
    * createProject({ payload }, { select, call, put }) {
      const { key, v } = yield select(state => state.index);
      const result = yield call(newManagementApi.createProject, {
        key,
        v,
        ...payload
      });
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            commitSuccess: true,
            projectId: result.project_id
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            commitSuccess: false,
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
