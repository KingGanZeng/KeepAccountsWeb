
/**
 * travelDetails.state 参数类型
 *
 * @export
 * @interface TravelDetailsState
 */
export interface TravelDetailsState {
  sBookId: string, // 总账本编号
  bookId: string, // 内账本编号
  bookType: string, // 类型
  bookData: any, // 数据
  expenseNum: number, // 统计项
  incomeNum: number,
  countNum: number,
  budget: string, // 预算
}

/**
 * travelDetails.props 参数类型
 *
 * @export
 * @interface TravelDetailsProps
 */
export interface TravelDetailsProps {
  dispatch?: any,
  recordData: any,
}
