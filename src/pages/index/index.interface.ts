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
  recordData?: Array<RecordProps>
}
