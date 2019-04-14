import { MAINHOST } from '../../config'


export default {
  createRecord: {
    host: MAINHOST,
    url: '/api/recordDataApi',
    method: 'POST'
  },
}
