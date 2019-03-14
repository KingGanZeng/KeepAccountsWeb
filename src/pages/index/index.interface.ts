/**
 * index.state 参数类型
 *
 * @export
 * @interface IndexState
 */
export interface IndexState {
  yearMonth: string, // 用于日期选择器
}

export interface DataInterface {
  day: number,
  des: string,
  lunar: string,
  month: number,
  pic: string,
  title: string,
  year: number,
  _id: string,
}

export interface BannerProps {
  user_name: string,
  book_id: number,
  book_name: string,
  month: number,
  year: number,
  income: number,
  expense: number
}

export interface BookProps {
  book_id: number,
  book_name: string,
  book_type: string,
  user_name: string,
  date: string,
  income_expenses: string,
  number: number,
  note: string,
  quote: string,
}

/**
 * index.props 参数类型
 *
 * @export
 * @interface IndexProps
 */
export interface IndexProps {
  dispatch?: any,
  data?: Array<DataInterface>,
  navBarData?: Array<BannerProps>,
  bookData?: Array<BookProps>
}
