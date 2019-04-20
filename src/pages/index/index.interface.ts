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
  // budget: number, // 预算
  uid: string, // 用户openid
  specialDataObj: any, // 用于存放特殊账本数据
  itemNum: number, // 账本内含的项目数量
}

/**
 * index.props 参数类型
 *
 * @export
 * @interface IndexProps
 */
export interface IndexProps {
  dispatch?: any,
  recordData?: any,
  specialBookData?: any,
}
