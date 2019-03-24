
/**
 * newBook.state 参数类型
 *
 * @export
 * @interface NewBookState
 */
export interface NewBookState {
  bookType: string,
  bookCategory: Array<string>, // 账本类型
  bookCategoryChecked: string, // 当前选中账本类型
  budget: number, //账本预算
  hasGroup: boolean, // 是否开启小组
  loading: boolean, // 提交状态，用于页面loading样式渲染
  bookName: string, // 账本名称
  hasError: boolean, // toast状态
  hasErrorMsg: string, // toast信息
  hasErrorIcon: string, // toast图标
  hasBookId: boolean, // 修改账本不允许修改账本类型
  uid: string,
  username: string,
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
  book_id: string,
  book_info?: Array<BookInterface>
}

