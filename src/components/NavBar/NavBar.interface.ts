
/**
 * NavBar.state 参数类型
 *
 * @export
 * @interface NavBarState
 */
export interface NavBarState {
  date: string,
  bookType: string,
}

/**
 * NavBar.props 参数类型
 *
 * @export
 * @interface NavBarProps
 */
export interface NavBarProps {
  yearMonthStr: string, // 从父元素传来的year-month字符串
  onDateState?: any, // 父组件监听事件
  navBarData: {
    incomeCount: number, // 收入额
    expenseCount: number, // 支出额
    count: number, // 笔数
    budget: number, // 预算
  },
  navBookType: string, // 账本类型
  itemNum: number, // 账本项目数量
}
