
/**
 * newBook.state 参数类型
 *
 * @export
 * @interface NewBookState
 */
export interface NewBookState {
  bookName: string,
  bookType: string,
  peopleNum: number,
  loading: boolean
}

/**
 * newBook.interface 参数类型
 * @interface BookInterface
 */
export interface BookInterface {
  user_name: string,
  book_name: string,
  book_type: string,
  book_id: number
}

/**
 * newBook.props 参数类型
 *
 * @export
 * @interface NewBookProps
 */
export interface NewBookProps {
  dispatch?: any,
  submitSuccess?: boolean,
  book_info?: Array<BookInterface>
}

