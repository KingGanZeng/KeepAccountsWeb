
/**
 * NavBar.state 参数类型
 *
 * @export
 * @interface NavBarState
 */
export interface NavBarState {
  date: string
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
}
