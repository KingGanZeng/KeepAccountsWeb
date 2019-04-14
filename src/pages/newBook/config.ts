import { MAINHOST } from '../../config'

export default {
  createBook: {
    host: MAINHOST,
    url: '/api/createBook',
    method: 'POST'
  },
  getBookInfo: {
    host: MAINHOST,
    url: '/api/getBookList',
  }
}
