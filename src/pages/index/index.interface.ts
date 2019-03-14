/**
 * index.state 参数类型
 *
 * @export
 * @interface IndexState
 */
export interface IndexState {
  yearMonth: string, // 用于日期选择器
}

/**
 * 首页NavBar数据格式
 */
export interface BannerProps {
  user_name: string,
  book_id: number,
  book_name: string,
  month: number,
  year: number,
  income: number,
  expense: number
}

/**
 * 记账记录返回格式
 */
export interface RecordProps {
  record_id: string,
  book_id: number,
  record_type: string,
  username: string,
  uid: string,
  money: number,
  date: string,
}

/**
 * index.props 参数类型
 *
 * @export
 * @interface IndexProps
 */
export interface IndexProps {
  dispatch?: any,
  navBarData?: Array<BannerProps>,
  recordData?: Array<RecordProps>
}
