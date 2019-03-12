
interface BookProps {
  book_name: string,
  book_id: number
}

/**
 * accountBook.state 参数类型
 *
 * @export
 * @interface AccountBookState
 */
export interface AccountBookState {
  bookArray: Array<BookProps>
}

export interface BookInterface {
  user_name: string,
  book_name: string,
  book_type: string,
  book_id: number
}

/**
 * accountBook.props 参数类型
 *
 * @export
 * @interface AccountBookProps
 */
export interface AccountBookProps {
  dispatch?: any,
  data?: Array<BookInterface>
}

