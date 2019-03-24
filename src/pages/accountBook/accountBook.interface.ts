/**
 * accountBook.state 参数类型
 *
 * @export
 * @interface AccountBookState
 */
export interface AccountBookState {
  hasAuthorized: boolean, // 是否授权过
  modalOpenState: boolean, // 模态框状态
  uid: string, // uid
  // toastContent: string, // toast弹窗内容
}

/**
 * BookInterface 参数类型
 *
 * @export
 * @interface BookInterface
 */
export interface BookInterface {
  user_name: string,
  book_name: string,
  book_type: string,
  book_id: number,
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

