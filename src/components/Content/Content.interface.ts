
/**
 * Content.state 参数类型
 *
 * @export
 * @interface ContentState
 */
export interface ContentState {
  current: number, // 用于标签页标识
  dailyObj: {
    incomeObj: Object, // 每日数据-收入信息
    expenseObj: Object, // 每日数据-支出信息
  },
}

/**
 * Content.props 参数类型
 *
 * @export
 * @interface ContentProps
 */
export interface ContentProps {
  income: Object,
  expense: Object,
  nowBookType: string,
}
