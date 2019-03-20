
/**
 * DailyContent.state 参数类型
 *
 * @export
 * @interface DailyContentState
 */
export interface DailyContentState {
  dailyDetail?: any,
  detailType: string,
}

/**
 * rowArr的格式
 */
// export interface rowArrFormat {
//   type: string,
//   money: number,
//   name: string,
//   category: string
// }

/**
 * DailyContent.props 参数类型
 *
 * @export
 * @interface DailyContentProps
 */
export interface DailyContentProps {
  dailyDetailInfo: Object, // 每一天的消费详情
  type: string, // 支出还是收入
}
