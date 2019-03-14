
/**
 * BookList.state 参数类型
 *
 * @export
 * @interface BookListState
 */
export interface BookListState {
  title: string,
  bookList: any
}

/**
 * BookList.props 参数类型
 *
 * @export
 * @interface BookListProps
 */
export interface BookListProps {
  title: string // 标题
  list: Array<bookProps>, // book列表
}

export interface bookProps {
  book_id: number,
  book_type: string,
  book_name: string,
  note: string
}
