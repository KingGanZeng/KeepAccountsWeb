
/**
 * BookList.state 参数类型
 *
 * @export
 * @interface BookListState
 */
export interface BookListState {
  bookTitle: string,
}


export interface BookProps {
  book_id: number,
  book_type: string,
  book_name: string,
  note: string
}
/**
 * BookList.props 参数类型
 *
 * @export
 * @interface BookListProps
 */
export interface BookListProps {
  title: string, // 标题
  list: Array<BookProps>, // book列表
}
