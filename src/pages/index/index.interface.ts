/**
 * index.state 参数类型
 *
 * @export
 * @interface IndexState
 */
export interface IndexState {
  yearMonth: string, // 用于日期选择器
  bookId: string, // 用于存储账本id
  bookType: string, // 用于存储账本类别
}

/**
 * 记账记录返回格式
 */
export interface RecordProps {
  record_id: string,
  uid: string,
  date: string,
  record_type: string,
  category: string,
  username: string,
  money: number,
  note: string,
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
